import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getProfile } from "@/content";
import { site } from "@/content/site";
import { routing, rtl } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { languageAlternates } from "@/lib/seo";
import { jsonLd } from "@/lib/serializers/json-ld";
import { HtmlShell } from "@/app/html-shell";

export { generateStaticParams } from "@/i18n/static";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const profile = getProfile(locale);
  const [firstName, ...rest] = profile.header.name.split(" ");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s · ${profile.header.name}` },
    description: t("description"),
    openGraph: {
      type: "profile",
      siteName: profile.header.name,
      locale,
      firstName,
      lastName: rest.join(" "),
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    verification: {
      google: site.verification?.google,
      other: site.verification?.bing ? { "msvalidate.01": site.verification.bing } : undefined,
    },
    alternates: { canonical: `/${locale}/`, languages: languageAlternates("/") },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const profile = getProfile(locale);
  return (
    <HtmlShell
      lang={locale}
      dir={rtl.has(locale) ? "rtl" : "ltr"}
      head={
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd(profile, SITE_URL, locale)).replace(/</g, "\\u003c"),
          }}
        />
      }
    >
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
    </HtmlShell>
  );
}
