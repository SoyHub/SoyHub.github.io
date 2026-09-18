"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatEvent, UiTool } from "@/lib/chat/events";

export type Part =
  { kind: "text"; text: string } | { kind: "ui"; id: string; tool: UiTool; input: unknown };

export type AssistantMsg = {
  role: "assistant";
  parts: Part[];
  retrieval?: Extract<ChatEvent, { type: "retrieval" }>;
  done?: Extract<ChatEvent, { type: "done" }>;
  error?: Extract<ChatEvent, { type: "error" }>;
};
export type UserMsg = { role: "user"; text: string };
export type Msg = UserMsg | AssistantMsg;

const MAX_TURNS = 12;

/** Compact text history sent back each request: prose plus one marker per UI block. */
const toHistoryText = (m: AssistantMsg) =>
  m.parts
    .map((p) =>
      p.kind === "text"
        ? p.text
        : `[ui:${p.tool}${p.tool === "show_project" ? ` chunk=${(p.input as { chunk_id?: string }).chunk_id ?? ""}` : ""}]`,
    )
    .join(" ")
    .trim() || "[no answer]";

export function useChatStream() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const patchLast = useCallback((fn: (m: AssistantMsg) => AssistantMsg) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.role !== "assistant") return prev;
      return [...prev.slice(0, -1), fn(last)];
    });
  }, []);

  const apply = useCallback(
    (e: ChatEvent) => {
      switch (e.type) {
        case "retrieval":
          patchLast((m) => ({ ...m, retrieval: e }));
          break;
        case "text_delta":
          patchLast((m) => {
            const parts = [...m.parts];
            const last = parts[parts.length - 1];
            if (last?.kind === "text")
              parts[parts.length - 1] = { kind: "text", text: last.text + e.text };
            else parts.push({ kind: "text", text: e.text });
            return { ...m, parts };
          });
          break;
        case "ui":
          patchLast((m) => ({
            ...m,
            parts: [...m.parts, { kind: "ui", id: e.id, tool: e.tool, input: e.input }],
          }));
          break;
        case "done":
          patchLast((m) => ({ ...m, done: e }));
          break;
        case "error":
          patchLast((m) => ({ ...m, error: e }));
          break;
      }
    },
    [patchLast],
  );

  const send = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || busy) return;
      const turns = messages.filter((m) => m.role === "user").length;
      if (turns >= MAX_TURNS) {
        setMessages((prev) => [
          ...prev,
          { role: "user", text: q },
          {
            role: "assistant",
            parts: [],
            error: {
              type: "error",
              status: 413,
              reason: "INVALID_REQUEST",
              message: "Twelve turns is the limit for one conversation. Reload to start another.",
            },
          },
        ]);
        return;
      }
      const history = messages.map((m) =>
        m.role === "user"
          ? { role: "user" as const, text: m.text }
          : { role: "assistant" as const, text: toHistoryText(m) },
      );
      setMessages((prev) => [...prev, { role: "user", text: q }, { role: "assistant", parts: [] }]);
      setBusy(true);
      const ctl = new AbortController();
      abort.current = ctl;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, question: q }),
          signal: ctl.signal,
        });
        if (!res.ok || !res.body) {
          const err = (await res.json().catch(() => null)) as ChatEvent | null;
          apply(
            err && err.type === "error"
              ? err
              : {
                  type: "error",
                  status: res.status,
                  reason: "INTERNAL",
                  message: `HTTP ${res.status}`,
                },
          );
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) if (line.trim()) apply(JSON.parse(line) as ChatEvent);
        }
        if (buffer.trim()) apply(JSON.parse(buffer) as ChatEvent);
      } catch (err) {
        if ((err as Error).name !== "AbortError")
          apply({
            type: "error",
            status: 0,
            reason: "UPSTREAM_UNAVAILABLE",
            message: "Connection lost.",
          });
      } finally {
        setBusy(false);
        abort.current = null;
      }
    },
    [apply, busy, messages],
  );

  const stop = useCallback(() => abort.current?.abort(), []);
  const reset = useCallback(() => {
    abort.current?.abort();
    setMessages([]);
  }, []);

  return { messages, busy, send, stop, reset };
}
