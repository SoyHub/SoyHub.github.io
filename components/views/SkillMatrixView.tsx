import { getLocale, getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import { SkillMatrix } from "@/components/ui/SkillMatrix";

export async function SkillMatrixView() {
  const locale = await getLocale();
  const profile = getProfile(locale);
  const t = await getTranslations();
  return (
    <div>
      <h1 className="text-ink mb-3 text-[15px] font-semibold">{t("endpoints./skills.title")}</h1>
      <SkillMatrix groups={profile.skills} />
    </div>
  );
}
