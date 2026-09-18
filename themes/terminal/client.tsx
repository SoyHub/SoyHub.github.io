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

const cmd = (href: string) => (href === "/" ? "--help" : href.slice(1));

export function Nav({ user }: { user: string }) {
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const { highlight, setHighlight, markSend } = useExplorer();
  const t = useTranslations();
  useKeyboardNav();
  return (
    <nav aria-label={t("ui.endpoints")} className="font-mono text-[13px] lg:sticky lg:top-14">
      <div className="text-muted hidden pb-2 lg:block">usage: {user} &lt;command&gt;</div>
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
                  "flex min-h-11 items-center gap-2 px-1 py-1 whitespace-nowrap lg:min-h-0",
                  active ? "text-brass" : highlight === i ? "text-ink" : "text-body hover:text-ink",
                )}
              >
                <span className="w-3 select-none" aria-hidden>
                  {active ? ">" : " "}
                </span>
                <span dir="ltr" className={cx("w-28", e.method === "POST" && "text-brass")}>
                  {cmd(e.href)}
                </span>
                <span className="text-muted hidden min-w-0 truncate xl:inline">
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

export function Prompt({ user }: { user: string }) {
  return (
    <span dir="ltr" className="shrink-0 select-none">
      <span className="text-verdant">{user}@portfolio</span>
      <span className="text-muted">:</span>
      <span className="text-brass">~</span>
      <span className="text-muted">$</span>
    </span>
  );
}

export function Request({ endpoint, user }: { endpoint: Endpoint; user: string }) {
  const t = useTranslations();
  const send = useSend();
  const { requestBarRef } = useExplorer();
  const [value, setValue] = useState(`${user} ${cmd(endpoint.href)}`);
  const [egg, setEgg] = useState(false);

  const run = (e: FormEvent) => {
    e.preventDefault();
    const words = value.trim().split(/\s+/);
    if (
      words[0] === "rm" &&
      words.some((w) => w.replace(/^\//, "") === site.easterEgg.path.slice(1))
    ) {
      setEgg(true);
      return;
    }
    const arg = words[0] === user ? words.slice(1).join(" ") : words.join(" ");
    send(arg === "--help" || arg === "" ? "/" : arg);
  };

  return (
    <div className="mb-2 font-mono text-[13px]">
      <form onSubmit={run} role="search" className="flex items-center gap-2">
        <Prompt user={user} />
        <label className="flex min-w-0 flex-1 items-center">
          <span className="sr-only">{t("ui.request")}</span>
          <input
            ref={requestBarRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            dir="ltr"
            aria-label={t("ui.endpointPath")}
            className="text-ink min-w-0 flex-1 bg-transparent py-1 outline-none"
          />
        </label>
        <button type="submit" className="text-muted hover:text-ink">
          ↵
        </button>
      </form>
      {egg && (
        <p role="status" className="text-signal mt-1">
          rm: {site.easterEgg.path.slice(1)}: {t("site.easterEgg")}
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
    <section aria-label={t("response")} className="font-mono text-[13px]">
      <div dir="ltr" className="text-muted flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className={ok ? "text-verdant" : "text-signal"}>
          # {status} {statusText}
        </span>
        <LatencyChip />
        <span className="ms-auto flex gap-2" role="tablist">
          {(["rendered", "json"] as const).map((name) => (
            <button
              key={name}
              role="tab"
              aria-selected={tab === name}
              onClick={() => setTab(name)}
              className={cx("hover:text-ink", tab === name ? "text-brass" : "text-muted")}
            >
              --format={name === "rendered" ? "text" : "json"}
            </button>
          ))}
        </span>
      </div>
      <div dir="ltr" className="text-muted">
        {headers.map(([k, v]) => (
          <div key={k}>
            # {k}: {v}
          </div>
        ))}
      </div>
      <div className="border-hair mt-3 border-s ps-4 font-sans" hidden={tab !== "rendered"}>
        {children}
      </div>
      <pre dir="ltr" className="text-ink mt-3 overflow-x-auto" hidden={tab !== "json"}>
        {JSON.stringify(json, null, 2)}
      </pre>
      <div className="mt-4" aria-hidden>
        <span className="text-muted">$ </span>
        <span className="bg-ink cursor-blink inline-block h-[1.1em] w-[0.6em] align-text-bottom" />
      </div>
    </section>
  );
}
