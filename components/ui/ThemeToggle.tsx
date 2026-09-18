"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { theme } from "@/lib/themes";

const mode: Theme = theme.mode;

type Theme = "dark" | "light";

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

const subscribe = (cb: () => void) => {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
};

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, () => mode);
  const t = useTranslations("ui");

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="lbl border-hair hover:border-brass hover:text-ink rounded-sm border px-2 py-1 whitespace-nowrap"
      title={t("switchTheme", { theme: t(theme === "dark" ? "light" : "dark") })}
    >
      {t("theme")}: {t(theme)}
    </button>
  );
}
