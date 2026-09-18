import { setRequestLocale } from "next-intl/server";
import { chrome } from "@/lib/chrome";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { RootIndex } from "@/components/views/RootIndex";

export { generateStaticParams } from "@/i18n/static";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <chrome.Hero />
      <EndpointResponse href="/">
        <RootIndex />
      </EndpointResponse>
    </>
  );
}
