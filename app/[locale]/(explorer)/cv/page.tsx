import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { CvDownloads } from "@/components/views/CvDownloads";

export { generateStaticParams } from "@/i18n/static";
export const generateMetadata = pageMetadata("/cv");

export default async function Page({ params }: PageProps<"/[locale]/cv">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <EndpointResponse href="/cv">
      <CvDownloads />
    </EndpointResponse>
  );
}
