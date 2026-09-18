import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { NowPanel } from "@/components/views/NowPanel";

export { generateStaticParams } from "@/i18n/static";
export const generateMetadata = pageMetadata("/now");

export default async function Page({ params }: PageProps<"/[locale]/now">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <EndpointResponse href="/now">
      <NowPanel />
    </EndpointResponse>
  );
}
