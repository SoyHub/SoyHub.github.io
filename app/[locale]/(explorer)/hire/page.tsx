import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { HireForm } from "@/components/views/HireForm";
import { getProfile } from "@/content";

export { generateStaticParams } from "@/i18n/static";
export const generateMetadata = pageMetadata("/hire");

export default async function Page({ params }: PageProps<"/[locale]/hire">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <EndpointResponse href="/hire" status={200} statusText="OK">
      <HireForm email={getProfile(locale).header.email} />
    </EndpointResponse>
  );
}
