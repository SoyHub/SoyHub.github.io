"use client";

import { useState } from "react";

export function ReplayButton({ targetId }: { targetId: string }) {
  const [, tick] = useState(0);
  const replay = () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.classList.remove("diff-anim");
    void el.offsetWidth; // restart CSS animations
    el.classList.add("diff-anim");
    tick((n) => n + 1);
  };
  return (
    <button
      type="button"
      onClick={replay}
      className="lbl border-hair hover:border-brass hover:text-ink rounded-sm border px-2 py-1"
    >
      replay ↻
    </button>
  );
}
