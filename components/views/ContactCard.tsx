import { getLocale, getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import { KeyValue } from "@/components/ui/KeyValue";
import { SITE_HOST } from "@/lib/site";

export async function ContactCard() {
  const locale = await getLocale();
  const h = getProfile(locale).header;
  const t = await getTranslations();
  return (
    <div>
      <h1 className="text-ink text-[15px] font-semibold">{t("endpoints./contact.title")}</h1>
      <div className="mt-3">
        <KeyValue
          rows={[
            {
              k: t("ui.email"),
              v: (
                <a
                  className="decoration-hair hover:text-brass underline"
                  href={`mailto:${h.email}`}
                >
                  {h.email}
                </a>
              ),
            },
            {
              k: t("ui.linkedin"),
              v: (
                <a
                  className="decoration-hair hover:text-brass underline"
                  href={h.linkedin}
                  rel="me noopener"
                >
                  {h.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              ),
            },
            {
              k: t("ui.github"),
              v: (
                <a
                  className="decoration-hair hover:text-brass underline"
                  href={h.github}
                  rel="me noopener"
                >
                  {h.github.replace(/^https?:\/\//, "")}
                </a>
              ),
            },
            { k: t("ui.basedIn"), v: h.location },
            {
              k: t("ui.terminal"),
              v: (
                <code>
                  curl {SITE_HOST}/{locale}/cv.txt
                </code>
              ),
            },
          ]}
        />
      </div>
      <p className="text-muted mt-4 text-[13px]">{t("ui.emailNote")}</p>
    </div>
  );
}
