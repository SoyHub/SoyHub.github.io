import Anthropic from "@anthropic-ai/sdk";
import { retrieve } from "@/lib/rag/retrieve";
import { SYSTEM_PROMPT } from "./system-prompt";
import { TOOLS, validateToolCall } from "./tools";
import { buildMessages } from "./prompt";
import { addUsage, zeroUsage } from "./cost";
import type { ChatEvent, ChatRequest, Usage, UiTool } from "./events";

export const MODEL = "claude-opus-5";
const MAX_ROUNDS = 3;

type Effort = "low" | "medium" | "high";
const effort = (): Effort => {
  const e = process.env.CHAT_EFFORT;
  return e === "medium" || e === "high" ? e : "low";
};

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic({ maxRetries: 1 }));

const denylist = () =>
  (process.env.CHAT_DENYLIST ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * Retrieval + streaming tool loop. Emits NDJSON events through `emit`; HTTP concerns live in the route.
 * The server executes no tools: each tool_use becomes a `ui` event and is acknowledged as rendered.
 */
export async function runChat(
  input: ChatRequest,
  emit: (e: ChatEvent) => void,
  signal?: AbortSignal,
): Promise<Usage> {
  const { hits, trace } = await retrieve(input.question, { signal });
  emit({ type: "retrieval", ...trace });

  const allowedIds = new Set(hits.map((h) => h.id));
  const messages = buildMessages(input.messages, input.question, hits);
  let totals = zeroUsage();
  let servedBy = MODEL;

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    const stream = getClient().beta.messages.stream(
      {
        model: MODEL,
        max_tokens: 700,
        thinking: { type: "adaptive" },
        output_config: { effort: effort() },
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        tools: TOOLS,
        tool_choice: round === MAX_ROUNDS ? { type: "none" } : { type: "auto" },
        messages,
      },
      { signal },
    );

    stream.on("text", (delta) => emit({ type: "text_delta", text: delta }));

    const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
    stream.on("contentBlock", (block) => {
      if (block.type !== "tool_use") return;
      const verdict = validateToolCall(block.name, block.input, allowedIds, denylist());
      if (verdict.ok)
        emit({ type: "ui", id: block.id, tool: block.name as UiTool, input: block.input });
      results.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: JSON.stringify(
          verdict.ok ? { rendered: true } : { rendered: false, error: verdict.error },
        ),
        ...(verdict.ok ? {} : { is_error: true }),
      });
    });

    const message = await stream.finalMessage();
    totals = addUsage(totals, message.usage);
    servedBy = message.model;

    if (message.stop_reason === "refusal") {
      emit({
        type: "ui",
        id: "srv-refusal",
        tool: "show_status",
        input: {
          code: 403,
          reason: "SCOPE_VIOLATION",
          message: "The model declined this one.",
          hint: "Ask about the profile instead.",
        },
      });
      break;
    }
    if (message.stop_reason === "tool_use" && round < MAX_ROUNDS) {
      messages.push({ role: "assistant", content: message.content });
      messages.push({ role: "user", content: results });
      continue;
    }
    emit({
      type: "done",
      rounds: round,
      servedBy,
      truncated: message.stop_reason === "max_tokens",
      usage: totals,
    });
    return totals;
  }
  emit({ type: "done", rounds: MAX_ROUNDS, servedBy, truncated: false, usage: totals });
  return totals;
}

/** Map SDK errors to a visitor-facing event; most specific class first. */
export function mapError(err: unknown): ChatEvent & { type: "error" } {
  if (err instanceof Anthropic.RateLimitError)
    return {
      type: "error",
      status: 429,
      reason: "UPSTREAM_RATE_LIMITED",
      message: "The model is busy. Retry in a moment.",
      retryAfter: 10,
    };
  if (err instanceof Anthropic.InternalServerError)
    return {
      type: "error",
      status: 503,
      reason: "UPSTREAM_UNAVAILABLE",
      message: "The model is unavailable right now.",
    };
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.BadRequestError) {
    console.error("chat: request rejected", err.status, err.message);
    return {
      type: "error",
      status: 500,
      reason: "INTERNAL",
      message: "This endpoint is misconfigured. Email works.",
    };
  }
  if (err instanceof Anthropic.APIConnectionError)
    return {
      type: "error",
      status: 503,
      reason: "UPSTREAM_UNAVAILABLE",
      message: "Could not reach the model.",
    };
  console.error("chat: unexpected", err);
  return {
    type: "error",
    status: 500,
    reason: "INTERNAL",
    message: "Something broke on this side. Email works.",
  };
}
