import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { findEndpoint } from "@/content/endpoints";
import { routing } from "@/i18n/routing";

/** hreflang map for one path: every locale plus x-default on the default one. */
export const languageAlternates = (href: string) => {
  const path = href === "/" ? "/" : `${href}/`;
  return Object.fromEntries([
    ...routing.locales.map((l) => [l, `/${l}${path}`]),
    ["x-default", `/${routing.defaultLocale}${path}`],
  ]);
};

/** `generateMetadata` for an endpoint page: title, description, canonical or noindex, hreflang. */
export const pageMetadata =
  (href: string) =>
  async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
    const { locale } = await params;
    const e = findEndpoint(href);
    if (!e) throw new Error(`unknown endpoint ${href}`);
    const t = await getTranslations({ locale, namespace: "endpoints" });
    const key = `${href}.seo.description`;
    return {
      title: t(`${href}.title`),
      description: t.has(key) ? t(key) : undefined,
      ...(e.indexable
        ? { alternates: { canonical: `/${locale}${href}/`, languages: languageAlternates(href) } }
        : { robots: { index: false, follow: true } }),
    };
  };
