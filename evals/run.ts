// pnpm evals [retrieval|scope]
// Retrieval: recall@5 over evals/retrieval.jsonl (offline unless VOYAGE_API_KEY is set).
// Scope: the model must deflect off-topic prompts with show_status and answer in-scope ones without it
// (needs ANTHROPIC_API_KEY; ~40 calls). Results land in evals/results.json.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { retrieve } from "../lib/rag/retrieve";
import { runChat } from "../lib/chat/run";
import type { ChatEvent } from "../lib/chat/events";

const dir = __dirname;
const lines = <T>(f: string): T[] =>
  readFileSync(join(dir, f), "utf8")
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l));
const which = process.argv[2] ?? "all";

type RetrievalCase = { q: string; expect: string[] };
type ScopeCase = { q: string; expect: "deflect" | "answer"; code?: number };

async function retrievalEval() {
  const cases = lines<RetrievalCase>("retrieval.jsonl");
  let hit = 0;
  const misses: string[] = [];
  let mode = "";
  for (const c of cases) {
    const { hits, trace } = await retrieve(c.q);
    mode = trace.mode;
    const ids = hits.map((h) => h.id);
    const ok = c.expect.some((e) => ids.includes(e));
    if (ok) hit++;
    else
      misses.push(
        `  ✗ ${c.q}\n      expected one of ${c.expect.join(", ")}\n      got ${ids.join(", ")}`,
      );
  }
  const recall = hit / cases.length;
  console.log(`\nretrieval recall@5 = ${hit}/${cases.length} = ${recall.toFixed(2)}  (${mode})`);
  if (misses.length) console.log(misses.join("\n"));
  return { recall, n: cases.length, mode, misses: misses.length };
}

async function scopeEval() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("\nscope: skipped (ANTHROPIC_API_KEY not set)");
    return null;
  }
  const cases = lines<ScopeCase>("scope.jsonl");
  const rows: {
    q: string;
    expect: string;
    got: string;
    code: number | null;
    ok: boolean;
    usd: number;
  }[] = [];
  for (const c of cases) {
    const events: ChatEvent[] = [];
    let usd = 0;
    try {
      const usage = await runChat({ messages: [], question: c.q }, (e) => events.push(e));
      usd = usage.usd;
    } catch (err) {
      rows.push({
        q: c.q,
        expect: c.expect,
        got: `error: ${(err as Error).message}`,
        code: null,
        ok: false,
        usd,
      });
      continue;
    }
    const status = events.find(
      (e): e is Extract<ChatEvent, { type: "ui" }> => e.type === "ui" && e.tool === "show_status",
    );
    const code = status ? (status.input as { code: number }).code : null;
    const got = status ? "deflect" : "answer";
    const ok = got === c.expect && (c.code == null || c.code === code);
    rows.push({ q: c.q, expect: c.expect, got, code, ok, usd });
    console.log(`${ok ? "✓" : "✗"} ${got.padEnd(7)} ${code ?? "   "}  ${c.q.slice(0, 70)}`);
  }
  const off = rows.filter((r) => r.expect === "deflect");
  const on = rows.filter((r) => r.expect === "answer");
  const deflectRecall = off.filter((r) => r.got === "deflect").length / off.length;
  const falseDeflect = on.filter((r) => r.got === "deflect").length;
  const codeAcc = off.filter((r) => r.ok).length / off.length;
  const cost = rows.reduce((s, r) => s + r.usd, 0);
  console.log(
    `\nscope: deflection recall ${deflectRecall.toFixed(2)} · code accuracy ${codeAcc.toFixed(2)} · false deflections ${falseDeflect}/${on.length} · cost $${cost.toFixed(3)}`,
  );
  return { deflectRecall, codeAcc, falseDeflect, n: rows.length, cost, rows };
}

async function main() {
  const results: Record<string, unknown> = { ranAt: new Date().toISOString() };
  if (which === "all" || which === "retrieval") results.retrieval = await retrievalEval();
  if (which === "all" || which === "scope") results.scope = await scopeEval();
  writeFileSync(join(dir, "results.json"), JSON.stringify(results, null, 2));
  console.log("\nwrote evals/results.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
