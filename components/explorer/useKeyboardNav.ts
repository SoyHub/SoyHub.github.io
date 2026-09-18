"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { endpoints } from "@/content/endpoints";
import { useExplorer } from "./ExplorerProvider";

const isTyping = (el: Element | null) =>
  !!el &&
  (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || (el as HTMLElement).isContentEditable);

/** `/` focuses the request bar; ↑↓ move the highlight; Enter navigates; Esc blurs. */
export function useKeyboardNav() {
  const router = useRouter();
  const { highlight, setHighlight, markSend, focusRequestBar } = useExplorer();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = isTyping(document.activeElement);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        focusRequestBar();
        return;
      }
      if (typing) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const n = endpoints.length;
        setHighlight((((highlight + (e.key === "ArrowDown" ? 1 : -1)) % n) + n) % n);
      } else if (e.key === "Enter" && highlight >= 0) {
        markSend();
        router.push(endpoints[highlight].href as never);
      } else if (e.key === "Escape") {
        setHighlight(-1);
        (document.activeElement as HTMLElement | null)?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [highlight, setHighlight, markSend, focusRequestBar, router]);
}
