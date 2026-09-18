import { getLocale, getTranslations } from "next-intl/server";
import { getNow } from "@/content";

export async function NowPanel() {
  const now = getNow(await getLocale());
  const t = await getTranslations();
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-ink text-[15px] font-semibold">{t("endpoints./now.title")}</h1>
        <time dateTime={now.updated} className="text-muted font-mono text-[12px]">
          {t("ui.updated", { date: now.updated })}
        </time>
      </div>
      <ul className="mt-3 space-y-2 text-[14px] leading-relaxed">
        {now.items.map((t) => (
          <li key={t} className="flex gap-2">
            <span className="text-verdant font-mono select-none">▸</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
