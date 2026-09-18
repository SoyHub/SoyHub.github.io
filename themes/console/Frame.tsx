"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { StatusChip } from "@/components/ui/StatusChip";
import { LatencyChip } from "@/components/explorer/LatencyChip";
import { cx } from "@/lib/cx";

export function Frame({
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
  const t = useTranslations("ui");
  return (
    <section
      aria-label={t("response")}
      className="border-hair bg-surface shadow-panel rounded-sm border"
    >
      <div className="border-hair flex flex-wrap items-center gap-x-4 gap-y-1 border-b px-3 py-2">
        <StatusChip code={status} text={statusText} />
        <LatencyChip />
        <div className="ms-auto flex gap-1" role="tablist">
          {(["rendered", "json"] as const).map((tabName) => (
            <button
              key={tabName}
              role="tab"
              aria-selected={tab === tabName}
              onClick={() => setTab(tabName)}
              className={cx(
                "lbl rounded-sm px-2 py-1",
                tab === tabName ? "bg-sunk text-ink" : "hover:text-ink",
              )}
            >
              {t(tabName)}
            </button>
          ))}
        </div>
      </div>
      <dl
        dir="ltr"
        className="border-hair bg-sunk/60 text-muted grid grid-cols-[max-content_1fr] gap-x-3 border-b px-3 py-1.5 font-mono text-[11px]"
      >
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
        dir="ltr"
        className="text-ink overflow-x-auto p-4 font-mono text-[12px] leading-5"
        hidden={tab !== "json"}
      >
        {JSON.stringify(json, null, 2)}
      </pre>
    </section>
  );
}
