"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { StatusChip } from "@/components/ui/StatusChip";

const initial = JSON.stringify({ role: "", location: "", start: "", message: "" }, null, 2);

export function HireForm({ email }: { email: string }) {
  const t = useTranslations();
  const [body, setBody] = useState(initial);
  const [result, setResult] = useState<{ code: number; text: string; detail: string } | null>(null);

  const send = (e: FormEvent) => {
    e.preventDefault();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      setResult({ code: 400, text: t("ui.hire.badRequest"), detail: (err as Error).message });
      return;
    }
    const subject = `${parsed.role ?? "Role"} — ${parsed.location ?? ""}`.trim();
    const lines = Object.entries(parsed).map(([k, v]) => `${k}: ${String(v)}`);
    const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setResult({
      code: 202,
      text: t("ui.hire.accepted"),
      detail: `Location: ${href.slice(0, 60)}…`,
    });
    window.location.href = href;
  };

  return (
    <form onSubmit={send}>
      <h1 className="text-ink text-[15px] font-semibold">{t("endpoints./hire.title")}</h1>
      <p className="text-muted mt-1 text-[13px]">{t("ui.hire.lead")}</p>
      <label className="lbl mt-4 block">{t("ui.hire.body")}</label>
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
          {t("ui.sendButton")}
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
