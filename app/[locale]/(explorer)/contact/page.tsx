import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { ContactCard } from "@/components/views/ContactCard";

export { generateStaticParams } from "@/i18n/static";
export const generateMetadata = pageMetadata("/contact");

export default async function Page({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <EndpointResponse href="/contact">
      <ContactCard />
    </EndpointResponse>
  );
}
