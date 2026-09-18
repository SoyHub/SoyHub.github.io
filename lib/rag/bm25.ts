import type { IndexFile } from "./types";

const K1 = 1.2;
const B = 0.75;

/** BM25 score of every chunk for the query tokens (Okapi, no stemming). */
export const bm25Scores = (index: IndexFile, queryTokens: string[]): number[] => {
  const n = index.chunks.length;
  const idf = (t: string) => {
    const df = index.df[t] ?? 0;
    return Math.log(1 + (n - df + 0.5) / (df + 0.5));
  };
  const terms = [...new Set(queryTokens)].filter((t) => index.df[t]);
  return index.chunks.map((c) => {
    if (!terms.length) return 0;
    const tf = new Map<string, number>();
    for (const t of c.tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    const norm = K1 * (1 - B + (B * c.tokens.length) / index.avgdl);
    let score = 0;
    for (const t of terms) {
      const f = tf.get(t) ?? 0;
      if (f) score += idf(t) * ((f * (K1 + 1)) / (f + norm));
    }
    return score;
  });
};

export const bm25Stats = (docs: string[][]) => {
  const df: Record<string, number> = {};
  for (const tokens of docs) for (const t of new Set(tokens)) df[t] = (df[t] ?? 0) + 1;
  const avgdl = docs.reduce((s, d) => s + d.length, 0) / Math.max(1, docs.length);
  return { df, avgdl };
};
