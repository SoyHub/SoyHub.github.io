"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { StatusChip } from "@/components/ui/StatusChip";

const initial = JSON.stringify({ role: "", location: "", start: "", message: "" }, null, 2);

export function HireForm() {
  const [body, setBody] = useState(initial);
  const [result, setResult] = useState<{ code: number; text: string; detail: string } | null>(null);

  const send = (e: FormEvent) => {
    e.preventDefault();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      setResult({ code: 400, text: "Bad Request", detail: (err as Error).message });
      return;
    }
    const subject = `${parsed.role ?? "Role"} — ${parsed.location ?? ""}`.trim();
    const lines = Object.entries(parsed).map(([k, v]) => `${k}: ${String(v)}`);
    const href = `mailto:${profile.header.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setResult({ code: 202, text: "Accepted", detail: `Location: ${href.slice(0, 60)}…` });
    window.location.href = href;
  };

  return (
    <form onSubmit={send}>
      <h1 className="text-ink text-[15px] font-semibold">Hire</h1>
      <p className="text-muted mt-1 text-[13px]">
        Edit the request body, press Send. It opens your mail client — nothing is stored here.
      </p>
      <label className="lbl mt-4 block">body · application/json</label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={7}
        spellCheck={false}
        className="border-hair bg-sunk text-ink focus:border-brass mt-1 w-full rounded-sm border p-3 font-mono text-[12px] outline-none"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          className="border-brass bg-brass-soft text-brass hover:bg-brass hover:text-paper rounded-sm border px-3 py-1.5 font-mono text-[12px] font-medium tracking-wider"
        >
          Send ▶
        </button>
        {result && (
          <span className="flex items-center gap-2" role="status">
            <StatusChip code={result.code} text={result.text} />
            <span className="text-muted truncate font-mono text-[11px]">{result.detail}</span>
          </span>
        )}
      </div>
    </form>
  );
}
