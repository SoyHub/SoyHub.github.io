"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Ctx = {
  /** index of the keyboard-highlighted endpoint row, or -1 */
  highlight: number;
  setHighlight: (i: number) => void;
  /** call when Send is pressed; the mounted page reports back via `measure()` */
  markSend: () => void;
  measure: () => number | null;
  focusRequestBar: () => void;
  requestBarRef: React.RefObject<HTMLInputElement | null>;
};

const ExplorerContext = createContext<Ctx | null>(null);

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const [highlight, setHighlight] = useState(-1);
  const sentAt = useRef<number | null>(null);
  const requestBarRef = useRef<HTMLInputElement | null>(null);

  const markSend = useCallback(() => {
    sentAt.current = performance.now();
  }, []);
  const measure = useCallback(() => {
    if (sentAt.current == null) return null;
    const ms = performance.now() - sentAt.current;
    sentAt.current = null;
    return ms;
  }, []);
  const focusRequestBar = useCallback(() => requestBarRef.current?.focus(), []);

  const value = useMemo(
    () => ({ highlight, setHighlight, markSend, measure, focusRequestBar, requestBarRef }),
    [highlight, markSend, measure, focusRequestBar],
  );
  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>;
}

export const useExplorer = () => {
  const ctx = useContext(ExplorerContext);
  if (!ctx) throw new Error("useExplorer outside ExplorerProvider");
  return ctx;
};
