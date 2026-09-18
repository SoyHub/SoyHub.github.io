import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { EducationList } from "@/components/views/EducationList";

export { generateStaticParams } from "@/i18n/static";
export const generateMetadata = pageMetadata("/education");

export default async function Page({ params }: PageProps<"/[locale]/education">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <EndpointResponse href="/education">
      <EducationList />
    </EndpointResponse>
  );
}
