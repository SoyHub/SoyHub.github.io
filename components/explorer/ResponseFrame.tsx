"use client";

import { useState, type ReactNode } from "react";
import { StatusChip } from "@/components/ui/StatusChip";
import { LatencyChip } from "./LatencyChip";
import { cx } from "@/lib/cx";

export function ResponseFrame({
  status,
  statusText,
  headers,
  json,
  children,
}: {
  status: number;
  statusText: string;
  headers: [string, string][];
  json: unknown;
  children: ReactNode;
}) {
  const [tab, setTab] = useState<"rendered" | "json">("rendered");
  return (
    <section
      aria-label="Response"
      className="border-hair bg-surface shadow-panel rounded-sm border"
    >
      <div className="border-hair flex flex-wrap items-center gap-x-4 gap-y-1 border-b px-3 py-2">
        <StatusChip code={status} text={statusText} />
        <LatencyChip />
        <div className="ml-auto flex gap-1" role="tablist">
          {(["rendered", "json"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cx(
                "lbl rounded-sm px-2 py-1",
                tab === t ? "bg-sunk text-ink" : "hover:text-ink",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <dl className="border-hair bg-sunk/60 text-muted grid grid-cols-[max-content_1fr] gap-x-3 border-b px-3 py-1.5 font-mono text-[11px]">
        {headers.map(([k, v]) => (
          <div key={k} className="contents">
            <dt>{k}:</dt>
            <dd className="truncate">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="p-4 sm:p-5" hidden={tab !== "rendered"}>
        {children}
      </div>
      <pre
        className="text-ink overflow-x-auto p-4 font-mono text-[12px] leading-5"
        hidden={tab !== "json"}
      >
        {JSON.stringify(json, null, 2)}
      </pre>
    </section>
  );
}
