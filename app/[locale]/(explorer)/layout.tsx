import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExplorerProvider } from "@/components/explorer/ExplorerProvider";
import { chrome } from "@/lib/chrome";

export default async function ExplorerLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ui");
  return (
    <ExplorerProvider>
      <a
        href="#main"
        className="focus:bg-surface sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-20 focus:px-3 focus:py-2"
      >
        {t("skip")}
      </a>
      <chrome.TopBar />
      <chrome.Shell nav={<chrome.Nav />}>{children}</chrome.Shell>
      <chrome.Footer locale={locale} />
    </ExplorerProvider>
  );
}
