import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { ErrorReason } from "./events";

const day = () => new Date().toISOString().slice(0, 10);
const msgCap = () => Number(process.env.CHAT_DAILY_MSG_CAP ?? 60);
const usdCap = () => Number(process.env.CHAT_DAILY_USD_CAP ?? 1.5);

const hasRedis = () =>
  !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
  !!(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);

let redis: Redis | null = null;
let limiter: Ratelimit | null = null;
const getRedis = () => (redis ??= Redis.fromEnv());
const getLimiter = () =>
  (limiter ??= new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(10, "10 m"),
    prefix: "chat:ip",
    analytics: false,
  }));

// Without Redis (local dev, or an outage) a per-instance counter keeps the blast radius small.
const local = { msgs: 0, usd: 0, dayKey: day() };
const localTick = () => {
  if (local.dayKey !== day()) Object.assign(local, { msgs: 0, usd: 0, dayKey: day() });
};

export type Gate =
  | { ok: true }
  | { ok: false; status: number; reason: ErrorReason; message: string; retryAfter?: number };

const budgetMessage =
  "Today's token budget is spent. The endpoint reopens at 00:00 UTC — meanwhile, email works.";

export async function checkLimits(ipKey: string): Promise<Gate> {
  if (!hasRedis()) {
    localTick();
    if (local.msgs >= msgCap() || local.usd >= usdCap())
      return { ok: false, status: 503, reason: "BUDGET_EXHAUSTED", message: budgetMessage };
    local.msgs++;
    return { ok: true };
  }
  try {
    const r = getRedis();
    const [msgs, usd] = await Promise.all([
      r.get<number>(`chat:msgs:${day()}`),
      r.get<number>(`chat:usd:${day()}`),
    ]);
    if ((msgs ?? 0) >= msgCap() || (Number(usd) || 0) >= usdCap()) {
      return { ok: false, status: 503, reason: "BUDGET_EXHAUSTED", message: budgetMessage };
    }
    const { success, reset, pending } = await getLimiter().limit(ipKey);
    await pending;
    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return {
        ok: false,
        status: 429,
        reason: "RATE_LIMITED",
        message: `Ten messages per ten minutes per visitor. Retry in ${retryAfter}s.`,
        retryAfter,
      };
    }
    const key = `chat:msgs:${day()}`;
    const n = await r.incr(key);
    if (n === 1) await r.expire(key, 172800);
    return { ok: true };
  } catch (err) {
    console.warn("limits: redis unavailable, failing open once", (err as Error).message);
    localTick();
    if (local.msgs >= 100)
      return { ok: false, status: 503, reason: "BUDGET_EXHAUSTED", message: budgetMessage };
    local.msgs++;
    return { ok: true };
  }
}

export async function recordSpend(usd: number) {
  if (!hasRedis()) {
    localTick();
    local.usd += usd;
    return;
  }
  try {
    const key = `chat:usd:${day()}`;
    const r = getRedis();
    await r.incrbyfloat(key, usd);
    await r.expire(key, 172800);
  } catch (err) {
    console.warn("limits: could not record spend", (err as Error).message);
  }
}
