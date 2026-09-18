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

/** Swagger's method pill: solid colour block, white text. */
export function Pill({ method, className }: { method: string; className?: string }) {
  return (
    <span
      className={cx(
        "inline-block w-14 shrink-0 rounded-sm py-1 text-center font-mono text-[11px] font-semibold tracking-wider text-white",
        method === "GET" ? "bg-brass" : "bg-verdant",
        className,
      )}
    >
      {method}
    </span>
  );
}

export function Nav() {
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const { highlight, setHighlight, markSend } = useExplorer();
  const t = useTranslations();
  useKeyboardNav();
  return (
    <nav aria-label={t("ui.endpoints")} className="lg:sticky lg:top-14">
      <div className="text-ink hidden pb-2 text-[13px] font-semibold lg:block">paths</div>
      <ul
        role="listbox"
        aria-label={t("ui.endpoints")}
        aria-activedescendant={highlight >= 0 ? `ep-${highlight}` : undefined}
        className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
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
                  "flex min-h-11 items-center gap-3 rounded-sm border px-2.5 py-1.5 text-[13px] transition-colors lg:min-h-0",
                  e.method === "GET"
                    ? "bg-brass/8 border-brass/25"
                    : "bg-verdant/8 border-verdant/25",
                  active && (e.method === "GET" ? "border-brass" : "border-verdant"),
                  highlight === i && !active && "bg-surface",
                )}
              >
                <Pill method={e.method} />
                <span dir="ltr" className="text-ink font-mono whitespace-nowrap">
                  {e.path}
                </span>
                <span className="text-muted ms-auto hidden min-w-0 truncate ps-3 text-[12px] xl:inline">
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
  const [value, setValue] = useState(endpoint.path);
  const [egg, setEgg] = useState(false);

  const execute = (e: FormEvent) => {
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
    <div className="border-hair bg-surface shadow-panel mb-3 rounded-sm border">
      <form onSubmit={execute} role="search" className="flex flex-wrap items-stretch gap-2 p-2">
        <label className="border-hair bg-sunk focus-within:border-brass flex min-w-0 flex-1 items-center gap-2 rounded-sm border px-2">
          <span className="sr-only">{t("ui.request")}</span>
          <Pill method={endpoint.method} />
          <input
            ref={requestBarRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            dir="ltr"
            aria-label={t("ui.endpointPath")}
            className="text-ink min-w-0 flex-1 bg-transparent py-2 font-mono text-[13px] outline-none"
          />
        </label>
        <button
          type="submit"
          className="bg-brass hover:bg-brass/90 rounded-sm px-4 text-[13px] font-semibold text-white"
        >
          Execute
        </button>
      </form>
      {egg && (
        <p role="status" className="text-signal px-3 pb-2 font-mono text-[12px]">
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
}: {
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
      <div className="border-hair flex flex-wrap items-center gap-x-4 gap-y-1 border-b px-4 py-2">
        <span className="text-ink text-[13px] font-semibold">Responses</span>
        <LatencyChip />
      </div>
      <div className={cx("border-s-4 px-4 py-3", ok ? "border-verdant" : "border-signal")}>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span
            className={cx(
              "font-mono text-[14px] font-semibold",
              ok ? "text-verdant" : "text-signal",
            )}
          >
            {status}
          </span>
          <span className="text-ink text-[13px]">{statusText}</span>
          <span className="ms-auto flex gap-1" role="tablist">
            {(["rendered", "json"] as const).map((name) => (
              <button
                key={name}
                role="tab"
                aria-selected={tab === name}
                onClick={() => setTab(name)}
                className={cx(
                  "rounded-sm border px-2 py-0.5 text-[12px]",
                  tab === name
                    ? "border-brass text-brass"
                    : "border-hair text-muted hover:text-ink",
                )}
              >
                {t(name)}
              </button>
            ))}
          </span>
        </div>
        <dl
          dir="ltr"
          className="text-muted mt-2 grid grid-cols-[max-content_1fr] gap-x-3 font-mono text-[11px]"
        >
          {headers.map(([k, v]) => (
            <div key={k} className="contents">
              <dt>{k}:</dt>
              <dd className="truncate">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="border-hair border-t p-4 sm:p-5" hidden={tab !== "rendered"}>
        {children}
      </div>
      <pre
        dir="ltr"
        className="border-hair bg-sunk text-ink overflow-x-auto border-t p-4 font-mono text-[12px] leading-5"
        hidden={tab !== "json"}
      >
        {JSON.stringify(json, null, 2)}
      </pre>
    </section>
  );
}
