"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { endpoints, type Endpoint } from "@/content/endpoints";
import { site } from "@/content/site";
import { MethodBadge } from "@/components/ui/MethodBadge";
import { useExplorer } from "./ExplorerProvider";

export function RequestBar({ endpoint }: { endpoint: Endpoint }) {
  const router = useRouter();
  const { requestBarRef, markSend } = useExplorer();
  const [value, setValue] = useState(endpoint.path);
  const [easterEgg, setEasterEgg] = useState(false);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const raw = value.trim();
    const [maybeMethod, ...rest] = raw.split(/\s+/);
    const method = rest.length ? maybeMethod.toUpperCase() : null;
    const path = (rest.length ? rest.join(" ") : raw) || "/";
    if (method === "DELETE" && path.toLowerCase().startsWith(site.easterEgg.path)) {
      setEasterEgg(true);
      return;
    }
    const [pathname, query] = path.split("?");
    const known = endpoints.find((ep) => ep.href === pathname);
    markSend();
    router.push(((known ? known.href : pathname) + (query ? `?${query}` : "")) as never);
  };

  return (
    <div className="mb-3">
      <form onSubmit={send} role="search" className="flex items-stretch gap-2">
        <label className="border-hair bg-surface focus-within:border-brass flex min-w-0 flex-1 items-center gap-2 rounded-sm border px-3">
          <span className="sr-only">Request</span>
          <MethodBadge method={endpoint.method} />
          <input
            ref={requestBarRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="text-ink min-w-0 flex-1 bg-transparent py-2.5 font-mono text-[13px] outline-none"
            aria-label="Endpoint path"
          />
        </label>
        <button
          type="submit"
          className="border-brass bg-brass-soft text-brass hover:bg-brass hover:text-paper rounded-sm border px-3 font-mono text-[12px] font-medium tracking-wider"
        >
          Send ▶
        </button>
      </form>
      {easterEgg && (
        <p role="status" className="text-signal mt-2 font-mono text-[12px]">
          {site.easterEgg.message}
        </p>
      )}
    </div>
  );
}
