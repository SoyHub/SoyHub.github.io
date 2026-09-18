import type { ReactNode } from "react";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif, Press_Start_2P } from "next/font/google";
import { theme, themeCss } from "@/lib/themes";
import { site } from "@/content/site";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});
const plexSerif = IBM_Plex_Serif({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["600"],
  variable: "--font-plex-serif",
});

// Only the rpg theme uses it; the class goes on <html> just for that theme.
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-pixel" });

// Runs before paint so the stored theme never flashes.
const themeBoot = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

/** The <html> every page shares: fonts, palette, theme boot. Both root layouts render through it. */
export function HtmlShell({
  lang,
  dir = "ltr",
  head,
  children,
}: {
  lang: string;
  dir?: "ltr" | "rtl";
  head?: ReactNode;
  children: ReactNode;
}) {
  return (
    <html
      lang={lang}
      dir={dir}
      data-theme={theme.mode}
      data-skin={site.theme}
      className={`${plexSans.variable} ${plexMono.variable} ${plexSerif.variable} ${site.theme === "rpg" ? pixel.variable : ""} h-full`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss(theme) }} />
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        {head}
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
