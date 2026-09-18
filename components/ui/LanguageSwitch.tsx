"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

// The visible box hugs the current label; the native <select> sits invisibly on top of it, so the
// click opens the system list and keyboard and screen readers get the real control. A bare
// <select> would size itself to its longest option instead.
export function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("ui");
  const names = new Intl.DisplayNames([locale], { type: "language" });
  const label = (l: string) => `${l} · ${names.of(l) ?? l}`;

  const change = (next: string) => {
    try {
      localStorage.setItem("locale", next);
    } catch {}
    router.replace(pathname, { locale: next });
  };

  return (
    <label className="lbl border-hair hover:border-brass hover:text-ink focus-within:border-brass focus-within:text-ink relative inline-flex cursor-pointer items-center rounded-sm border px-2 py-1 whitespace-nowrap">
      <span aria-hidden>{label(locale)}</span>
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={(e) => change(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 outline-none"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {label(l)}
          </option>
        ))}
      </select>
    </label>
  );
}
