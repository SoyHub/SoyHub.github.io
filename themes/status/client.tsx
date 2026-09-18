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

/** 90 days of uptime, deterministic per key so every build draws the same bar. */
export function UptimeBar({ seed, degraded = false }: { seed: string; degraded?: boolean }) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (
    <div className="flex h-6 gap-px" aria-hidden>
      {Array.from({ length: 90 }, (_, i) => {
        const dip = degraded && ((h >>> (i % 28)) + i) % 19 === 0;
        return (
          <span key={i} className={cx("flex-1 rounded-[1px]", dip ? "bg-brass" : "bg-verdant")} />
        );
      })}
    </div>
  );
}

export function Nav() {
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const { highlight, setHighlight, markSend } = useExplorer();
  const t = useTranslations();
  useKeyboardNav();
  return (
    <nav aria-label={t("ui.endpoints")} className="lg:sticky lg:top-14">
      <div className="text-ink hidden pb-2 text-[13px] font-semibold lg:block">Components</div>
      <ul
        role="listbox"
        aria-label={t("ui.endpoints")}
        aria-activedescendant={highlight >= 0 ? `ep-${highlight}` : undefined}
        className="border-hair bg-surface flex gap-0 divide-x overflow-x-auto rounded-sm border lg:flex-col lg:divide-x-0 lg:divide-y lg:overflow-visible"
      >
        {endpoints.map((e, i) => {
          const active = pathname === e.href;
          const post = e.method === "POST";
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
                  "flex min-h-11 items-center gap-2.5 px-3 py-2 text-[13px] lg:min-h-0",
                  active ? "bg-brass-soft" : highlight === i ? "bg-sunk" : "hover:bg-sunk",
                )}
              >
                <span
                  className={cx(
                    "h-2.5 w-2.5 shrink-0 rounded-full",
                    post ? "bg-brass" : "bg-verdant",
                  )}
                  aria-hidden
                />
                <span className="text-ink whitespace-nowrap">{t(`endpoints.${e.href}.title`)}</span>
                <span
                  className={cx(
                    "ms-auto hidden font-mono text-[11px] whitespace-nowrap xl:inline",
                    post ? "text-brass" : "text-verdant",
                  )}
                >
                  {post ? "accepting" : "operational"}
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
  const [value, setValue] = useState(endpoint.path);
  const [egg, setEgg] = useState(false);

  const run = (e: FormEvent) => {
    e.preventDefault();
    const [first, ...rest] = value.trim().split(/\s+/);
    if (
      first.toUpperCase() === "DELETE" &&
      rest.join(" ").toLowerCase().startsWith(site.easterEgg.path)
    ) {
      setEgg(true);
      return;
    }
    send(rest.length ? rest.join(" ") : first);
  };

  return (
    <div className="mb-3">
      <form onSubmit={run} role="search" className="flex items-stretch gap-2">
        <label className="border-hair bg-surface focus-within:border-brass flex min-w-0 flex-1 items-center gap-2 rounded-sm border px-3">
          <span className="sr-only">{t("ui.request")}</span>
          <span className="lbl">query</span>
          <input
            ref={requestBarRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            dir="ltr"
            aria-label={t("ui.endpointPath")}
            className="text-ink min-w-0 flex-1 bg-transparent py-2.5 font-mono text-[13px] outline-none"
          />
        </label>
        <button
          type="submit"
          className="bg-brass hover:bg-brass/90 rounded-sm px-4 text-[13px] font-semibold text-white"
        >
          Run
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
  href,
  status,
  statusText,
  headers,
  json,
  children,
}: {
  href: string;
  status: number;
  statusText: string;
  headers: [string, string][];
  json: unknown;
  children: ReactNode;
}) {
  const [tab, setTab] = useState<"rendered" | "json">("rendered");
  const t = useTranslations("ui");
  const ok = status < 400;
  return (
    <section
      aria-label={t("response")}
      className="border-hair bg-surface shadow-panel rounded-sm border"
    >
      <div className="border-hair border-b px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className={cx("h-2.5 w-2.5 rounded-full", ok ? "bg-verdant" : "bg-signal")}
            aria-hidden
          />
          <span className="text-ink text-[14px] font-semibold">
            {ok ? "Operational" : "Degraded"}
          </span>
          <span className={cx("font-mono text-[12px]", ok ? "text-verdant" : "text-signal")}>
            {status} {statusText}
          </span>
          <LatencyChip />
          <span className="ms-auto flex gap-1" role="tablist">
            {(["rendered", "json"] as const).map((name) => (
              <button
                key={name}
                role="tab"
                aria-selected={tab === name}
                onClick={() => setTab(name)}
                className={cx(
                  "rounded-sm px-2 py-0.5 text-[12px]",
                  tab === name ? "bg-sunk text-ink" : "text-muted hover:text-ink",
                )}
              >
                {t(name)}
              </button>
            ))}
          </span>
        </div>
        <div className="mt-3">
          <UptimeBar seed={href} degraded={!ok} />
          <div className="text-muted mt-1 flex justify-between font-mono text-[10px]">
            <span>90 days ago</span>
            <span>{ok ? "100.00%" : "99.90%"}</span>
            <span>today</span>
          </div>
        </div>
      </div>
      <dl
        dir="ltr"
        className="border-hair bg-sunk/60 text-muted grid grid-cols-[max-content_1fr] gap-x-3 border-b px-4 py-1.5 font-mono text-[11px]"
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
