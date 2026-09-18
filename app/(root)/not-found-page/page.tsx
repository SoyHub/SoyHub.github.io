import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { site } from "@/content/site";
import NotFound from "@/app/[locale]/not-found";

// GitHub Pages serves out/404.html for unknown URLs; `postbuild` moves this page there. A
// language-less URL has no locale, so the page uses the default one.
export const metadata: Metadata = { title: "404", robots: { index: false } };

export default function NotFoundPage() {
  setRequestLocale(site.defaultLocale);
  return (
    <NextIntlClientProvider>
      <NotFound />
    </NextIntlClientProvider>
  );
}
