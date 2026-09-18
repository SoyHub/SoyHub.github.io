import { getTranslations, setRequestLocale } from "next-intl/server";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { pageMetadata } from "@/lib/seo";
import { getProfile } from "@/content";

export { generateStaticParams } from "@/i18n/static";
export const generateMetadata = pageMetadata("/ask");

// The console needs a server (see lib/chat/handler.ts); this deployment is static.
export default async function Page({ params }: PageProps<"/[locale]/ask">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ui.ask");
  const { email } = getProfile(locale).header;
  return (
    <EndpointResponse href="/ask" status={503} statusText={t("unavailable")}>
      <div>
        <h1 className="text-ink text-[15px] font-semibold">{t("title")}</h1>
        <p className="text-muted mt-1 text-[13px]">{t("lead")}</p>
        <p className="text-muted mt-2 text-[13px]">{t("meanwhile")}</p>
        <pre
          dir="ltr"
          className="border-hair bg-sunk text-ink mt-4 overflow-x-auto rounded-sm border p-3 font-mono text-[12px]"
        >
          {`{ "status": "coming_soon", "meanwhile": ["GET /experience", "GET /cv", "mailto:${email}"] }`}
        </pre>
      </div>
    </EndpointResponse>
  );
}
