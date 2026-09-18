import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { ProjectCards } from "@/components/views/ProjectCards";

export { generateStaticParams } from "@/i18n/static";
export const generateMetadata = pageMetadata("/projects");

export default async function Page({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <EndpointResponse href="/projects">
      <ProjectCards />
    </EndpointResponse>
  );
}
