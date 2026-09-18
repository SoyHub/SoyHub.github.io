import { defineRouting } from "next-intl/routing";
import site from "@/content/site.json";

// Every page lives under /<locale>/; the root redirects to the visitor's language (see app/(root)).
export const routing = defineRouting({
  locales: site.locales,
  defaultLocale: site.defaultLocale,
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
export const rtl = new Set(["ar", "he", "fa", "ur"]);

// The bundled IBM Plex fonts cover Latin, Greek and Cyrillic; share cards for other scripts fall
// back to the default language rather than render garbage.
const otherScripts = new Set(["ar", "he", "fa", "ur", "hi", "zh", "ja", "ko", "th"]);
export const fontLocale = (locale: string) =>
  otherScripts.has(locale) ? routing.defaultLocale : locale;

// The PDF engine shapes Devanagari and CJK with a Noto font fetched at build time, but has no
// bidi layout, so right-to-left languages get the default-language PDF.
export const pdfFonts: Record<string, { file: string; url: string }> = {
  hi: {
    file: "NotoSansDevanagari.ttf",
    url: "https://github.com/google/fonts/raw/main/ofl/notosansdevanagari/NotoSansDevanagari%5Bwdth%2Cwght%5D.ttf",
  },
  zh: {
    file: "NotoSansSC.ttf",
    url: "https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf",
  },
};
export const pdfLocale = (locale: string) =>
  rtl.has(locale) || (otherScripts.has(locale) && !pdfFonts[locale])
    ? routing.defaultLocale
    : locale;
