import type { ReactNode } from "react";

export function KeyValue({ rows }: { rows: { k: string; v: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 font-mono text-[13px]">
      {rows.map((r) => (
        <div key={r.k} className="contents">
          <dt className="text-muted">{r.k}</dt>
          <dd dir="auto" className="text-ink break-words">
            {r.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
