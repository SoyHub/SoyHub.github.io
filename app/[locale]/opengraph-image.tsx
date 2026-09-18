import { getTranslations } from "next-intl/server";
import { ogImage, ogSize } from "@/lib/og";
import { getProfile } from "@/content";
import { fontLocale } from "@/i18n/routing";

export { generateStaticParams } from "@/i18n/static";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const locale = fontLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "site" });
  return ogImage({
    method: "GET",
    path: "/",
    title: getProfile(locale).header.name,
    subtitle: t("ogSubtitle"),
    photo: true,
  });
}
