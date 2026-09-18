import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getNow, getProfile } from "@/content";
import { heroDiff } from "@/content/site";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { LED } from "@/components/ui/LED";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DiffView } from "@/components/ui/DiffView";
import { ReplayButton } from "@/components/hero/ReplayButton";
import { cx } from "@/lib/cx";
import { Frame, Nav, Request, UptimeBar } from "./client";

/** The status page: the profile as a service — a banner, metric tiles, uptime bars, components. */
async function TopBar() {
  const profile = getProfile(await getLocale());
  return (
    <header className="border-hair bg-surface sticky top-0 z-10 border-b">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
        <Link href="/" className="text-ink text-[16px] font-semibold">
          {profile.header.name}
        </Link>
        <span className="text-muted text-[13px]">status</span>
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
  const t = await getTranslations();
  const profile = getProfile(locale);
  const now = getNow(locale);
  const leds = t.raw("ui.health.leds") as string[];
  const open = profile.availability.state !== "employed";
  return (
    <section aria-label={t("site.hero.label")} className="mb-4 space-y-3">
      <div
        className={cx(
          "flex flex-wrap items-center gap-3 rounded-sm px-4 py-3 text-white",
          open ? "bg-brass" : "bg-verdant",
        )}
      >
        <span className="h-3 w-3 rounded-full bg-white/90" aria-hidden />
        <span className="text-[15px] font-semibold">{profile.availability.label}</span>
        <span className="ms-auto font-mono text-[12px] opacity-90">
          {t("ui.updated", { date: now.updated })}
        </span>
      </div>
      <dl className="grid gap-3 sm:grid-cols-3">
        {profile.headline.map((h) => (
          <div key={h.label} className="border-hair bg-surface shadow-panel rounded-sm border p-4">
            <dd className="text-ink text-[26px] font-semibold">{h.value}</dd>
            <dt className="text-muted mt-1 text-[12px]">{h.label}</dt>
          </div>
        ))}
      </dl>
      <div className="border-hair bg-surface shadow-panel rounded-sm border p-4">
        <div className="space-y-3">
          {leds.map((label, i) => (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="text-ink">{label}</span>
                <span
                  className={cx("font-mono", i === leds.length - 1 ? "text-brass" : "text-verdant")}
                >
                  {i === leds.length - 1 ? "99.9%" : "100.00%"}
                </span>
              </div>
              <UptimeBar seed={label} degraded={i === leds.length - 1} />
            </div>
          ))}
        </div>
      </div>
      <div className="border-hair bg-surface shadow-panel rounded-sm border">
        <div className="border-hair flex flex-wrap items-center gap-2 border-b px-4 py-2">
          <span className="bg-verdant-soft text-verdant rounded-full px-2 py-0.5 font-mono text-[11px]">
            resolved
          </span>
          <span className="text-ink text-[13px] font-semibold">{t("site.hero.kicker")}</span>
        </div>
        <div
          id="hero-diff"
          className="diff-anim"
          style={{ "--diff-total": `${total}ms` } as React.CSSProperties}
        >
          <DiffView left={heroDiff.left} right={heroDiff.right} />
        </div>
        <div className="border-hair flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2">
          <p className="text-body max-w-3xl text-[13px]">{t("site.hero.caption")}</p>
          <ReplayButton targetId="hero-diff" label={t("site.hero.replay")} />
        </div>
      </div>
    </section>
  );
}

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
