import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { Nav } from "./Nav";
import { Request } from "./Request";
import { Frame } from "./Frame";
import { Hero } from "./Hero";

/** The API explorer: a request bar, an endpoint list, a response frame with headers and a JSON tab. */
async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("ui");
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-6">
      <p className="lbl">{t("footer", { locale })}</p>
    </footer>
  );
}

function Shell({ nav, children }: { nav: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-start gap-4 px-4 py-4 lg:grid-cols-[280px_1fr] lg:gap-6 lg:py-6">
      <aside className="border-hair bg-paper/95 sticky top-[49px] z-[5] -mx-4 border-b px-4 pt-2 backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:pt-0">
        {nav}
      </aside>
      <main id="main" className="min-w-0">
        {children}
      </main>
    </div>
  );
}

export const chrome = { TopBar, Nav, Request, Frame, Hero, Footer, Shell };
