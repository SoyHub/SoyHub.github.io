"use client";

import { useState } from "react";
import type { RetrievalTrace } from "@/lib/rag/types";

export function TracePanel({ trace }: { trace: RetrievalTrace }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-hair bg-surface rounded-sm border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-2 py-1 text-start"
      >
        <span className="lbl">retrieval</span>
        <span className="text-muted font-mono text-[11px]">
          {trace.hits.length} hits · {trace.mode} · {trace.ms} ms
        </span>
        <span className="text-muted ms-auto font-mono text-[11px]">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <table className="border-hair w-full border-t font-mono text-[11px]">
          <thead className="text-muted">
            <tr>
              <th className="px-2 py-1 text-start font-normal">chunk</th>
              <th className="px-2 py-1 text-end font-normal">cos</th>
              <th className="px-2 py-1 text-end font-normal">bm25</th>
              <th className="px-2 py-1 text-end font-normal">rrf</th>
            </tr>
          </thead>
          <tbody>
            {trace.hits.map((h) => (
              <tr key={h.id} className="border-hair/60 border-t">
                <td className="text-ink px-2 py-1">
                  <a href={h.url} className="hover:text-brass">
                    {h.id}
                  </a>
                  <span className="text-muted"> · {h.section}</span>
                </td>
                <td className="px-2 py-1 text-end">{h.cosine ?? "—"}</td>
                <td className="px-2 py-1 text-end">{h.bm25}</td>
                <td className="px-2 py-1 text-end">{h.rrf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
