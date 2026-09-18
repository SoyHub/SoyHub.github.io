"use client";

import type { Msg } from "./useChatStream";
import { UiBlock } from "./UiBlock";
import { TracePanel } from "./TracePanel";
import { StatusCard } from "./blocks/StatusCard";
import { MethodBadge } from "@/components/ui/MethodBadge";

export function Transcript({ messages, busy }: { messages: Msg[]; busy: boolean }) {
  return (
    <ol className="space-y-4">
      {messages.map((m, i) =>
        m.role === "user" ? (
          <li key={i} className="flex items-start gap-2">
            <MethodBadge method="POST" className="mt-1" />
            <p dir="auto" className="text-ink min-w-0 font-mono text-[13px]">
              {m.text}
            </p>
          </li>
        ) : (
          <li key={i} className="border-hair bg-sunk/50 rounded-sm border p-3">
            {m.retrieval && <TracePanel trace={m.retrieval} />}
            <div className="mt-2 space-y-3">
              {m.parts.map((p, j) =>
                p.kind === "text" ? (
                  <p key={j} dir="auto" className="text-[14px] leading-relaxed whitespace-pre-wrap">
                    {p.text}
                  </p>
                ) : (
                  <UiBlock key={p.id} tool={p.tool} input={p.input} />
                ),
              )}
              {m.error && (
                <StatusCard
                  code={m.error.status || 503}
                  reason={m.error.reason}
                  message={m.error.message}
                  hint={m.error.retryAfter ? `retry-after: ${m.error.retryAfter}s` : ""}
                />
              )}
              {busy && i === messages.length - 1 && !m.done && !m.error && (
                <span className="text-muted font-mono text-[12px]" aria-live="polite">
                  ▍
                </span>
              )}
            </div>
            {m.done && (
              <p className="text-muted mt-3 font-mono text-[10px]">
                {m.done.rounds} round{m.done.rounds > 1 ? "s" : ""} · {m.done.servedBy} · in{" "}
                {m.done.usage.input + m.done.usage.cacheRead + m.done.usage.cacheWrite} (cache{" "}
                {m.done.usage.cacheRead}) · out {m.done.usage.output} · $
                {m.done.usage.usd.toFixed(4)}
                {m.done.truncated && " · truncated"}
              </p>
            )}
          </li>
        ),
      )}
    </ol>
  );
}
