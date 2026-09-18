import { getLocale, getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import { Timeline } from "@/components/ui/Timeline";

export async function ExperienceTimeline() {
  const locale = await getLocale();
  const profile = getProfile(locale);
  const t = await getTranslations();
  return (
    <div>
      <h1 className="text-ink mb-4 text-[15px] font-semibold">
        {t("endpoints./experience.title")}
      </h1>
      <Timeline roles={profile.experience} presentWord={t("ui.present")} />
    </div>
  );
}
