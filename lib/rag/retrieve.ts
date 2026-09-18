import { loadIndex } from "./index";
import { tokenize } from "./tokenize";
import { bm25Scores } from "./bm25";
import { cosine, normalize } from "./vector";
import { embed } from "./voyage";
import { rankIds, rrf } from "./rrf";
import type { RetrievalHit, RetrievalTrace } from "./types";

const TOP_K = 5;

export async function retrieve(
  query: string,
  opts: { signal?: AbortSignal; topK?: number } = {},
): Promise<{ hits: RetrievalHit[]; trace: RetrievalTrace }> {
  const t0 = performance.now();
  const index = loadIndex();
  const ids = index.chunks.map((c) => c.id);
  const topK = opts.topK ?? TOP_K;

  const bm25 = bm25Scores(index, tokenize(query));
  const bm25Rank = rankIds(bm25, ids);

  let cos: number[] | null = null;
  let vecRank: string[] = [];
  let mode: RetrievalTrace["mode"] = "hybrid";
  try {
    const [q] = await embed([query], "query", opts.signal);
    const qn = normalize(q);
    cos = index.chunks.map((c) => cosine(qn, c.vector));
    vecRank = rankIds(cos, ids);
  } catch (err) {
    if (opts.signal?.aborted) throw err;
    mode = "bm25-only";
  }

  const fused = rrf(mode === "hybrid" ? [vecRank, bm25Rank] : [bm25Rank]);
  const ordered = [...fused.entries()].sort((a, b) => b[1] - a[1]).slice(0, topK);

  const hits: RetrievalHit[] = ordered.map(([id, score]) => {
    const i = ids.indexOf(id);
    const c = index.chunks[i];
    const rv = vecRank.indexOf(id);
    const rb = bm25Rank.indexOf(id);
    return {
      id,
      title: c.title,
      section: c.section,
      url: c.url,
      text: c.text,
      cosine: cos ? +cos[i].toFixed(4) : null,
      bm25: +bm25[i].toFixed(3),
      rankVec: rv >= 0 ? rv + 1 : null,
      rankBm25: rb >= 0 ? rb + 1 : null,
      rrf: +score.toFixed(5),
    };
  });

  const trace: RetrievalTrace = {
    mode,
    ms: Math.round(performance.now() - t0),
    hits: hits.map((h) => {
      const { text, ...rest } = h;
      void text;
      return rest;
    }),
  };
  return { hits, trace };
}
