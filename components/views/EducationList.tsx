import { getLocale, getTranslations } from "next-intl/server";
import { getProfile } from "@/content";

export async function EducationList() {
  const locale = await getLocale();
  const profile = getProfile(locale);
  const t = await getTranslations();
  return (
    <div>
      <h1 className="text-ink text-[15px] font-semibold">{t("endpoints./education.title")}</h1>
      <ul className="divide-hair mt-3 divide-y">
        {profile.education.map((e) => (
          <li key={e.what} className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
            <div>
              <div className="text-ink text-[14px] font-medium">{e.what}</div>
              <div className="text-muted text-[13px]">{e.where}</div>
            </div>
            {e.when && <span className="text-muted font-mono text-[12px]">{e.when}</span>}
          </li>
        ))}
      </ul>
      <h2 className="lbl mt-6">{t("ui.languages")}</h2>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {profile.languages.map((l) => (
          <li
            key={l.name}
            className="border-hair bg-sunk text-ink rounded-sm border px-1.5 py-0.5 font-mono text-[12px]"
          >
            {l.name} <span className="text-muted">{l.level}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
