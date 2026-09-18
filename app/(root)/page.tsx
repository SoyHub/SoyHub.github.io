import type { Metadata } from "next";
import { site } from "@/content/site";
import { LocaleRedirect } from "@/components/LocaleRedirect";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: `/${site.defaultLocale}/` },
};

export default function Root() {
  return <LocaleRedirect />;
}
