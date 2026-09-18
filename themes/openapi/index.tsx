import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProfile } from "@/content";
import { heroDiff } from "@/content/site";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { LED } from "@/components/ui/LED";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DiffView } from "@/components/ui/DiffView";
import { ReplayButton } from "@/components/hero/ReplayButton";
import { SITE_URL } from "@/lib/site";
import { Frame, Nav, Request } from "./client";

/** The API contract: a Swagger-style spec — info block, paths with method pills, responses. */
async function TopBar() {
  const profile = getProfile(await getLocale());
  return (
    <header className="border-hair bg-surface sticky top-0 z-10 border-b">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
        <Link href="/" className="text-ink text-[16px] font-semibold">
          {profile.header.name}
        </Link>
        <span className="bg-verdant rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
          OAS 3.1
        </span>
        <span className="text-muted hidden font-mono text-[12px] xl:inline">
          v{profile.meta.cvVersion}
        </span>
        <LED state={profile.availability.state} label={profile.availability.label} />
        <nav className="ms-auto flex flex-wrap items-center gap-x-3 gap-y-2">
          <a href={`mailto:${profile.header.email}`} className="lbl hover:text-ink">
            email
          </a>
          <a href={profile.header.linkedin} rel="me noopener" className="lbl hover:text-ink">
            linkedin
          </a>
          <a href={profile.header.github} rel="me noopener" className="lbl hover:text-ink">
            github
          </a>
          <ThemeToggle />
          <LanguageSwitch />
        </nav>
      </div>
    </header>
  );
}

const total = (heroDiff.left.lines.length + heroDiff.right.lines.length) * 90 + 400;

async function Hero() {
  const locale = await getLocale();
  const t = await getTranslations("site");
  const profile = getProfile(locale);
  return (
    <section aria-label={t("hero.label")} className="mb-4 space-y-3">
      <div className="border-hair bg-surface shadow-panel rounded-sm border p-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-ink text-[24px] font-semibold">{profile.header.name}</h1>
          <span className="bg-sunk text-muted rounded-sm px-1.5 py-0.5 font-mono text-[11px]">
            {profile.meta.cvVersion}
          </span>
        </div>
        <p className="text-body mt-2 max-w-3xl text-[14px] leading-relaxed">{t("description")}</p>
        <dl className="text-muted mt-3 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 font-mono text-[12px]">
          <dt>servers</dt>
          <dd dir="ltr" className="text-ink">
            {SITE_URL}/{locale}
          </dd>
          <dt>contact</dt>
          <dd dir="ltr" className="text-ink">
            {profile.header.email}
          </dd>
          <dt>license</dt>
          <dd className="text-ink">MIT · content © {profile.header.name}</dd>
        </dl>
      </div>
      <div className="border-hair bg-surface shadow-panel rounded-sm border">
        <div className="border-hair flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
          <span className="text-ink text-[13px] font-semibold">x-code-samples</span>
          <span className="lbl">{t("hero.kicker")}</span>
        </div>
        <div
          id="hero-diff"
          className="diff-anim"
          style={{ "--diff-total": `${total}ms` } as React.CSSProperties}
        >
          <DiffView left={heroDiff.left} right={heroDiff.right} />
        </div>
        <div className="border-hair flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2">
          <p className="text-body max-w-3xl text-[13px]">{t("hero.caption")}</p>
          <ReplayButton targetId="hero-diff" label={t("hero.replay")} />
        </div>
      </div>
    </section>
  );
}

async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("ui");
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-6">
      <p className="lbl">openapi: 3.1.0 · {t("footer", { locale })}</p>
    </footer>
  );
}

function Shell({ nav, children }: { nav: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-start gap-4 px-4 py-4 lg:grid-cols-[320px_1fr] lg:gap-6 lg:py-6">
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
