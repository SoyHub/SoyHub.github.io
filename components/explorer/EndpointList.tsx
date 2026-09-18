"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { endpoints } from "@/content/endpoints";
import { MethodBadge } from "@/components/ui/MethodBadge";
import { cx } from "@/lib/cx";
import { useExplorer } from "./ExplorerProvider";
import { useKeyboardNav } from "./useKeyboardNav";

export function EndpointList() {
  // trailingSlash export: usePathname gives "/experience/", endpoints are stored without it
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const { highlight, setHighlight, markSend } = useExplorer();
  useKeyboardNav();

  return (
    <nav aria-label="Endpoints" className="lg:sticky lg:top-14">
      <div className="lbl hidden px-2 pb-2 lg:block">endpoints</div>
      <ul
        role="listbox"
        aria-label="Endpoints"
        aria-activedescendant={highlight >= 0 ? `ep-${highlight}` : undefined}
        className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
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
                  "flex min-h-11 items-center gap-2 rounded-sm border px-2.5 py-1.5 text-[13px] transition-colors lg:min-h-0",
                  active
                    ? "border-brass/60 bg-brass-soft text-ink"
                    : "hover:border-hair hover:bg-surface border-transparent",
                  highlight === i && !active && "border-brass/40",
                )}
              >
                <MethodBadge method={e.method} />
                <span className="text-ink font-mono whitespace-nowrap">{e.path}</span>
                <span className="text-muted ml-auto hidden min-w-0 truncate pl-3 text-[12px] xl:inline">
                  {e.description}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
