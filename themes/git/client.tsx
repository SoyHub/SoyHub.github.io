"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { endpoints, type Endpoint } from "@/content/endpoints";
import { site } from "@/content/site";
import { useExplorer } from "@/components/explorer/ExplorerProvider";
import { useKeyboardNav } from "@/components/explorer/useKeyboardNav";
import { useSend } from "@/components/explorer/useSend";
import { LatencyChip } from "@/components/explorer/LatencyChip";
import { cx } from "@/lib/cx";

import { ref, sha } from "./sha";

export function Nav() {
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const { highlight, setHighlight, markSend } = useExplorer();
  const t = useTranslations();
  useKeyboardNav();
  return (
    <nav aria-label={t("ui.endpoints")} className="lg:sticky lg:top-14">
      <div dir="ltr" className="text-muted hidden pb-2 font-mono text-[12px] lg:block">
        $ git log --oneline
      </div>
      <ul
        role="listbox"
        aria-label={t("ui.endpoints")}
        aria-activedescendant={highlight >= 0 ? `ep-${highlight}` : undefined}
        className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0"
      >
        {endpoints.map((e, i) => {
          const active = pathname === e.href;
          return (
            <li
              key={e.href}
              id={`ep-${i}`}
              role="option"
              aria-selected={active}
              className="shrink-0"
            >
              <Link
                href={e.href as never}
                aria-current={active ? "page" : undefined}
                onClick={markSend}
                onMouseEnter={() => setHighlight(i)}
                className={cx(
                  "group flex min-h-11 items-center gap-3 rounded-sm px-2 py-1 text-[13px] lg:min-h-0",
                  active ? "bg-brass-soft" : highlight === i ? "bg-surface" : "hover:bg-surface",
                )}
              >
                {/* the graph column: a line with a dot per commit */}
                <span className="relative hidden h-7 w-3 shrink-0 lg:block" aria-hidden>
                  {i > 0 && <span className="bg-hair absolute start-[5px] top-[-8px] h-4 w-px" />}
                  {i < endpoints.length - 1 && (
                    <span className="bg-hair absolute start-[5px] bottom-[-8px] h-4 w-px" />
                  )}
                  <span
                    className={cx(
                      "absolute start-0.5 top-2 h-2.5 w-2.5 rounded-full border-2",
                      active ? "border-brass bg-brass" : "border-muted bg-paper",
                    )}
                  />
                </span>
                <span dir="ltr" className="text-brass font-mono text-[12px]">
                  {sha(e.href)}
                </span>
                <span dir="ltr" className="text-ink shrink-0 font-mono text-[12px]">
                  {e.method === "POST" ? "feat" : "docs"}({ref(e.href)})
                </span>
                <span className="text-muted hidden min-w-0 truncate text-[12px] xl:inline">
                  {t(`endpoints.${e.href}.description`)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Request({ endpoint }: { endpoint: Endpoint }) {
  const t = useTranslations();
  const send = useSend();
  const { requestBarRef } = useExplorer();
  const [value, setValue] = useState(ref(endpoint.href));
  const [egg, setEgg] = useState(false);

  const show = (e: FormEvent) => {
    e.preventDefault();
    const words = value.trim().split(/\s+/);
    if (
      words[0] === "rm" &&
      words.some((w) => w.replace(/^\//, "") === site.easterEgg.path.slice(1))
    ) {
      setEgg(true);
      return;
    }
    const target = words[words.length - 1];
    send(target === "HEAD" || target === "main" ? "/" : target);
  };

  return (
    <div className="mb-3">
      <form onSubmit={show} role="search" className="flex items-stretch gap-2">
        <label className="border-hair bg-surface focus-within:border-brass flex min-w-0 flex-1 items-center gap-2 rounded-sm border px-3 font-mono text-[13px]">
          <span className="sr-only">{t("ui.request")}</span>
          <span dir="ltr" className="text-muted select-none">
            $ git show
          </span>
          <input
            ref={requestBarRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            dir="ltr"
            aria-label={t("ui.endpointPath")}
            className="text-ink min-w-0 flex-1 bg-transparent py-2.5 outline-none"
          />
        </label>
        <button
          type="submit"
          className="border-hair bg-surface text-ink hover:border-brass rounded-sm border px-3 text-[13px]"
        >
          {t("ui.sendButton")}
        </button>
      </form>
      {egg && (
        <p role="status" className="text-signal mt-2 font-mono text-[12px]">
          {t("site.easterEgg")}
        </p>
      )}
    </div>
  );
}

export function Frame({
  status,
  statusText,
  headers,
  json,
  children,
  commit,
}: {
  status: number;
  statusText: string;
  headers: [string, string][];
  json: unknown;
  children: ReactNode;
  commit: { hash: string; author: string; email: string; date: string };
}) {
  const [tab, setTab] = useState<"rendered" | "json">("rendered");
  const t = useTranslations("ui");
  const ok = status < 400;
  return (
    <section
      aria-label={t("response")}
      className="border-hair bg-surface shadow-panel rounded-sm border"
    >
      <div dir="ltr" className="border-hair bg-sunk border-b px-4 py-3 font-mono text-[12px]">
        <div className="flex flex-wrap items-center gap-x-3">
          <span className="text-brass">commit {commit.hash}</span>
          <span className="text-muted">(HEAD -&gt; main)</span>
          <span
            className={cx(
              "ms-auto rounded-full border px-2 py-0.5 text-[11px]",
              ok ? "border-verdant/50 text-verdant" : "border-signal/50 text-signal",
            )}
          >
            {ok ? "✓" : "✕"} {status} {statusText}
          </span>
          <LatencyChip />
        </div>
        <div className="text-body mt-1">
          Author: {commit.author} &lt;{commit.email}&gt;
        </div>
        <div className="text-body">Date: {commit.date}</div>
        <div className="text-muted mt-1">
          {headers.map(([k, v]) => (
            <div key={k}>
              {k}: {v}
            </div>
          ))}
        </div>
      </div>
      <div className="border-hair flex gap-4 border-b px-4 text-[13px]" role="tablist">
        {(["rendered", "json"] as const).map((name) => (
          <button
            key={name}
            role="tab"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
            className={cx(
              "-mb-px border-b-2 py-2",
              tab === name
                ? "border-brass text-ink"
                : "text-muted hover:text-ink border-transparent",
            )}
          >
            {t(name)}
          </button>
        ))}
      </div>
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
