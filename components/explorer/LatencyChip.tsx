"use client";

import { useRef, useSyncExternalStore } from "react";
import { useExplorer } from "./ExplorerProvider";

const noop = () => () => {};

/** Honest latency: soft-nav delta from Send, or server response time on a hard load. */
export function LatencyChip() {
  const { measure } = useExplorer();
  const cache = useRef<number | null | undefined>(undefined);

  const ms = useSyncExternalStore(
    noop,
    () => {
      if (cache.current !== undefined) return cache.current;
      const soft = measure();
      const nav = performance.getEntriesByType("navigation")[0] as
        PerformanceNavigationTiming | undefined;
      cache.current = soft ?? (nav ? nav.responseStart - nav.requestStart : null);
      return cache.current;
    },
    () => null,
  );

  return (
    <span className="text-muted font-mono text-[11px]">
      {ms == null ? "— ms" : `${Math.max(1, Math.round(ms))} ms`}
    </span>
  );
}
