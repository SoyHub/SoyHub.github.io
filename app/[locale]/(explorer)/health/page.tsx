import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { HealthBoard } from "@/components/views/HealthBoard";

export { generateStaticParams } from "@/i18n/static";
export const generateMetadata = pageMetadata("/health");

export default async function Page({ params }: PageProps<"/[locale]/health">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <EndpointResponse href="/health">
      <HealthBoard />
    </EndpointResponse>
  );
}
