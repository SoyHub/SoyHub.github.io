export type Chunk = {
  id: string;
  section: string;
  title: string;
  url: string;
  text: string;
  /** BM25 tokens (title + body + keywords) */
  tokens: string[];
  /** L2-normalised embedding of title + body */
  vector: number[];
};

export type IndexFile = {
  model: string;
  dims: number;
  contentHash: string;
  builtAt: string;
  avgdl: number;
  /** document frequency per token */
  df: Record<string, number>;
  chunks: Chunk[];
};

export type RetrievalHit = {
  id: string;
  title: string;
  section: string;
  url: string;
  text: string;
  cosine: number | null;
  bm25: number;
  rankVec: number | null;
  rankBm25: number | null;
  rrf: number;
};

export type RetrievalTrace = {
  mode: "hybrid" | "bm25-only";
  ms: number;
  hits: Omit<RetrievalHit, "text">[];
};
