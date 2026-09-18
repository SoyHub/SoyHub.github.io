import type Anthropic from "@anthropic-ai/sdk";
import type { Usage } from "./events";

// USD per million tokens. Opus 5 first-party rates; fallback models are billed at their own rate,
// which this table approximates with the same numbers (they are the same tier).
const RATE = { input: 5, cacheRead: 0.5, cacheWrite: 6.25, output: 25 };

export const zeroUsage = (): Usage => ({
  input: 0,
  cacheRead: 0,
  cacheWrite: 0,
  output: 0,
  usd: 0,
});

export const addUsage = (acc: Usage, u: Anthropic.Beta.BetaUsage): Usage => {
  const next = {
    input: acc.input + u.input_tokens,
    cacheRead: acc.cacheRead + (u.cache_read_input_tokens ?? 0),
    cacheWrite: acc.cacheWrite + (u.cache_creation_input_tokens ?? 0),
    output: acc.output + u.output_tokens,
  };
  const usd =
    (next.input * RATE.input +
      next.cacheRead * RATE.cacheRead +
      next.cacheWrite * RATE.cacheWrite +
      next.output * RATE.output) /
    1e6;
  return { ...next, usd: +usd.toFixed(5) };
};
