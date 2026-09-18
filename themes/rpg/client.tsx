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

/** A segmented bar: HP/XP/stat. `value` in 0..1; the fill animates in once. */
export function Bar({
  value,
  tone = "ok",
  label,
}: {
  value: number;
  tone?: "ok" | "accent";
  label?: string;
}) {
  return (
    <div className="border-hair bg-sunk relative h-4 w-full overflow-hidden rounded-[2px] border">
      <div
        className={cx("rpg-fill h-full", tone === "ok" ? "bg-verdant" : "bg-brass")}
        style={{ width: `${Math.round(Math.max(0.04, Math.min(1, value)) * 100)}%` }}
      />
      {label && (
        <span className="text-ink absolute inset-0 flex items-center justify-end pe-1.5 font-mono text-[10px] leading-none">
          {label}
        </span>
      )}
    </div>
  );
}

export function Nav() {
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const { highlight, setHighlight, markSend } = useExplorer();
  const t = useTranslations();
  useKeyboardNav();
  return (
    <nav aria-label={t("ui.endpoints")} className="rpg-box lg:sticky lg:top-14">
      <div className="rpg-h text-brass hidden px-3 pt-3 pb-2 lg:block">QUEST LOG</div>
      <ul
        role="listbox"
        aria-label={t("ui.endpoints")}
        aria-activedescendant={highlight >= 0 ? `ep-${highlight}` : undefined}
        className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pt-0"
      >
        {endpoints.map((e, i) => {
          const active = pathname === e.href;
          const cursor = active || highlight === i;
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
                  "flex min-h-11 items-center gap-2 rounded-[2px] px-2 py-1.5 text-[13px] whitespace-nowrap lg:min-h-0",
                  active ? "text-brass" : cursor ? "text-ink" : "text-body hover:text-ink",
                )}
              >
                <span
                  className={cx("w-3 shrink-0 select-none", cursor ? "cursor-blink" : "invisible")}
                  aria-hidden
                >
                  ▶
                </span>
                <span>{t(`endpoints.${e.href}.title`)}</span>
                {e.method === "POST" && (
                  <span className="text-brass text-[11px]" title="side quest" aria-hidden>
                    ★
                  </span>
                )}
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

  const go = (e: FormEvent) => {
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
      <form onSubmit={go} role="search" className="flex items-stretch gap-2">
        <label className="rpg-box focus-within:border-brass flex min-w-0 flex-1 items-center gap-2 px-3">
          <span className="sr-only">{t("ui.request")}</span>
          <span className="text-brass cursor-blink select-none" aria-hidden>
            ▶
          </span>
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
          className="rpg-h rpg-box bg-brass-soft text-brass hover:bg-brass hover:text-paper px-4"
        >
          GO
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
    <section aria-label={t("response")} className="rpg-box">
      <div className="border-hair flex flex-wrap items-center gap-x-4 gap-y-2 border-b-2 px-4 py-3">
        <span className={cx("rpg-h", ok ? "text-verdant" : "text-signal")}>
          {ok ? "★ SUCCESS" : "✖ MISS"}
        </span>
        <span className="text-muted font-mono text-[12px]">
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
                "rpg-h rounded-[2px] border-2 px-2 py-1",
                tab === name
                  ? "border-brass text-brass"
                  : "text-muted hover:text-ink border-transparent",
              )}
            >
              {name === "rendered" ? "STATS" : "RAW"}
            </button>
          ))}
        </span>
      </div>
      <div dir="ltr" className="border-hair flex flex-wrap gap-1.5 border-b-2 px-4 py-2">
        {headers.map(([k, v]) => (
          <span
            key={k}
            className="bg-sunk text-muted rounded-[2px] px-1.5 py-0.5 font-mono text-[10px]"
          >
            {k}: {v}
          </span>
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
