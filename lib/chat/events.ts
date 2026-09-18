import type { RetrievalTrace } from "@/lib/rag/types";

export type UiTool =
  | "show_timeline"
  | "show_skill_matrix"
  | "show_project"
  | "show_contact"
  | "show_status"
  | "show_meme"
  | "cite";

export type ErrorReason =
  | "RATE_LIMITED"
  | "BUDGET_EXHAUSTED"
  | "INVALID_REQUEST"
  | "UPSTREAM_RATE_LIMITED"
  | "UPSTREAM_UNAVAILABLE"
  | "REFUSED"
  | "DISABLED"
  | "INTERNAL";

export type Usage = {
  input: number;
  cacheRead: number;
  cacheWrite: number;
  output: number;
  usd: number;
};

/** One NDJSON line each, in the order the server produces them. */
export type ChatEvent =
  | ({ type: "retrieval" } & RetrievalTrace)
  | { type: "text_delta"; text: string }
  | { type: "ui"; id: string; tool: UiTool; input: unknown }
  | { type: "done"; rounds: number; servedBy: string; truncated: boolean; usage: Usage }
  | { type: "error"; status: number; reason: ErrorReason; message: string; retryAfter?: number };

export type ChatRequest = {
  messages: { role: "user" | "assistant"; text: string }[];
  question: string;
};
