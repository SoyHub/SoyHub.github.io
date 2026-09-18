const K = 60;

/** Reciprocal rank fusion over one or more ranked id lists. */
export const rrf = (rankings: string[][]): Map<string, number> => {
  const scores = new Map<string, number>();
  for (const ranking of rankings) {
    ranking.forEach((id, i) => scores.set(id, (scores.get(id) ?? 0) + 1 / (K + i + 1)));
  }
  return scores;
};

/** Ids ordered by descending score; only ids with a positive score. */
export const rankIds = (scores: number[], ids: string[]): string[] =>
  scores
    .map((s, i) => ({ s, id: ids[i] }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.id);
