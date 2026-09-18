import type { ReactNode } from "react";
import { site } from "@/content/site";
import { HtmlShell } from "@/app/html-shell";

// Root layout for the language-less URLs: the 404 page and the redirects.
export default function RootLayout({ children }: { children: ReactNode }) {
  return <HtmlShell lang={site.defaultLocale}>{children}</HtmlShell>;
}
