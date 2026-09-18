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
import { monthsBetween, splitRange } from "@/lib/dates";
import type { Profile } from "@/content/profile.types";
import { Bar, Frame, Nav, Request } from "./client";

/** The character sheet: level and XP from the years, stat bars per skill group, a boss fight. */
const level = (p: Profile) => {
  const months = monthsBetween(splitRange(p.experience.at(-1)!.dates).start);
  return { lv: Math.floor(months / 12), xp: (months % 12) / 12, months };
};

async function TopBar() {
  const profile = getProfile(await getLocale());
  const { lv } = level(profile);
  return (
    <header className="border-hair bg-paper/95 sticky top-0 z-10 border-b-2 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
        <span className="rpg-h text-muted hidden xl:inline">PLAYER</span>
        <Link href="/" className="text-ink text-[15px] font-semibold">
          {profile.header.name}
        </Link>
        <span className="rpg-h bg-brass text-paper rounded-[2px] px-1.5 py-1">LV {lv}</span>
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
  const t = await getTranslations("site.hero");
  const profile = getProfile(await getLocale());
  const { lv, xp, months } = level(profile);
  const maxItems = Math.max(...profile.skills.map((g) => g.items.length));
  const party = [...new Set(profile.experience.map((r) => r.company))];
  return (
    <section aria-label={t("label")} className="mb-4 space-y-3">
      <div className="rpg-box p-4 sm:p-5">
        <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
          <div className="border-brass bg-sunk h-[120px] w-[120px] border-4 p-1 shadow-[inset_0_0_0_2px_var(--paper)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photo.png"
              alt=""
              width={104}
              height={104}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="rpg-h text-muted">PLAYER</div>
            <h1 className="text-ink mt-1 text-[22px] leading-tight font-semibold">
              {profile.header.name}
            </h1>
            <p className="text-body mt-1 text-[13px]">{profile.header.title}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="rpg-h text-brass shrink-0">LV {lv}</span>
              <div className="min-w-0 flex-1">
                <Bar value={xp} tone="accent" label={`XP ${months % 12}/12`} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {profile.skills.map((g) => (
            <div key={g.id} className="grid grid-cols-[120px_1fr] items-center gap-3">
              <span className="lbl truncate" title={g.label}>
                {g.label}
              </span>
              <Bar value={g.items.length / maxItems} label={String(g.items.length)} />
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="rpg-h text-muted mb-2">PARTY</div>
            <div className="flex flex-wrap gap-1.5">
              {party.map((c) => (
                <span
                  key={c}
                  className="border-hair bg-sunk text-ink rounded-[2px] border-2 px-2 py-1 text-[12px]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="rpg-h text-muted mb-2">ACHIEVEMENTS</div>
            <div className="flex flex-wrap gap-1.5">
              {profile.headline.map((h) => (
                <span
                  key={h.label}
                  title={h.label}
                  className="border-brass/50 bg-brass-soft text-brass rounded-[2px] border-2 px-2 py-1 text-[12px]"
                >
                  🏆 {h.value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="rpg-box">
        <div className="border-hair flex flex-wrap items-center gap-3 border-b-2 px-4 py-2">
          <span className="rpg-h text-signal">BOSS FIGHT</span>
          <span className="text-body text-[13px]">{t("kicker")}</span>
          <span className="rpg-h text-verdant ms-auto">CLEARED</span>
        </div>
        <div
          id="hero-diff"
          className="diff-anim"
          style={{ "--diff-total": `${total}ms` } as React.CSSProperties}
        >
          <DiffView left={heroDiff.left} right={heroDiff.right} />
        </div>
        <div className="border-hair flex flex-wrap items-center justify-between gap-2 border-t-2 px-4 py-2">
          <p className="text-body max-w-3xl text-[13px]">{t("caption")}</p>
          <ReplayButton targetId="hero-diff" label={t("replay")} />
        </div>
      </div>
    </section>
  );
}

async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("ui");
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-6">
      <p className="lbl">
        <span className="rpg-h text-brass">SAVE POINT</span> · ↑↓ · ↵ · {t("footer", { locale })}
      </p>
    </footer>
  );
}

function Shell({ nav, children }: { nav: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-start gap-4 px-4 py-4 lg:grid-cols-[300px_1fr] lg:gap-6 lg:py-6">
      <aside className="bg-paper/95 sticky top-[51px] z-[5] -mx-4 px-4 pt-2 backdrop-blur lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:pt-0">
        {nav}
      </aside>
      <main id="main" className="min-w-0">
        {children}
      </main>
    </div>
  );
}

export const chrome = { TopBar, Nav, Request, Frame, Hero, Footer, Shell };
