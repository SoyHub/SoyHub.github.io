import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { SkillMatrixView } from "@/components/views/SkillMatrixView";

export { generateStaticParams } from "@/i18n/static";
export const generateMetadata = pageMetadata("/skills");

export default async function Page({ params }: PageProps<"/[locale]/skills">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <EndpointResponse href="/skills">
      <SkillMatrixView />
    </EndpointResponse>
  );
}
