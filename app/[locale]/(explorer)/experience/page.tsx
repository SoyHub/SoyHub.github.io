import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { ExperienceTimeline } from "@/components/views/ExperienceTimeline";

export { generateStaticParams } from "@/i18n/static";
export const generateMetadata = pageMetadata("/experience");

export default async function Page({ params }: PageProps<"/[locale]/experience">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <EndpointResponse href="/experience">
      <ExperienceTimeline />
    </EndpointResponse>
  );
}
