import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProfile } from "@/content";
import { heroDiff } from "@/content/site";
import type { Endpoint } from "@/content/profile.types";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { LED } from "@/components/ui/LED";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DiffView } from "@/components/ui/DiffView";
import { ReplayButton } from "@/components/hero/ReplayButton";
import { Frame, Nav as NavList, Prompt, Request as RequestLine } from "./client";

/** The CLI: `<name> --help`, a shell prompt, command output ending in a blinking cursor. */
const user = (name: string) => name.split(" ")[0].toLowerCase();

async function TopBar() {
  const profile = getProfile(await getLocale());
  return (
    <header className="border-hair bg-paper/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 font-mono text-[13px]">
        <span className="flex gap-1.5" aria-hidden>
          <i className="bg-signal block h-2.5 w-2.5 rounded-full opacity-80" />
          <i className="bg-brass block h-2.5 w-2.5 rounded-full opacity-80" />
          <i className="bg-verdant block h-2.5 w-2.5 rounded-full opacity-80" />
        </span>
        <Link href="/" className="text-ink">
          <Prompt user={user(profile.header.name)} />
        </Link>
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

async function Nav() {
  const profile = getProfile(await getLocale());
  return <NavList user={user(profile.header.name)} />;
}

async function Request({ endpoint }: { endpoint: Endpoint }) {
  const profile = getProfile(await getLocale());
  return <RequestLine endpoint={endpoint} user={user(profile.header.name)} />;
}

const total = (heroDiff.left.lines.length + heroDiff.right.lines.length) * 90 + 400;

async function Hero() {
  const t = await getTranslations("site.hero");
  const profile = getProfile(await getLocale());
  const u = user(profile.header.name);
  return (
    <section aria-label={t("label")} className="mb-6 font-mono text-[13px]">
      <div dir="ltr">
        <Prompt user={u} /> <span className="text-ink">{u} --version</span>
      </div>
      <div className="text-body mt-1 mb-4">
        <div className="text-ink text-[20px] font-medium">{profile.header.name}</div>
        <div>{profile.header.title}</div>
        <div className="text-muted">
          v{profile.meta.cvVersion} · {profile.header.location}
        </div>
      </div>
      <div dir="ltr">
        <Prompt user={u} />{" "}
        <span className="text-ink">
          diff -u {heroDiff.left.title} {heroDiff.right.title}
        </span>
      </div>
      <div
        id="hero-diff"
        className="diff-anim border-hair mt-2 border-s"
        style={{ "--diff-total": `${total}ms` } as React.CSSProperties}
      >
        <DiffView left={heroDiff.left} right={heroDiff.right} />
      </div>
      <p className="text-body mt-3 max-w-3xl font-sans text-[13px]">
        <span className="text-muted font-mono"># </span>
        {t("caption")}
      </p>
      <div className="mt-2">
        <ReplayButton targetId="hero-diff" label={t("replay")} />
      </div>
    </section>
  );
}

async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("ui");
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-6 font-mono text-[12px]">
      <p className="text-muted">
        <span className="text-verdant">exit 0</span> · {t("footer", { locale })}
      </p>
    </footer>
  );
}

function Shell({ nav, children }: { nav: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-start gap-4 px-4 py-4 lg:grid-cols-[300px_1fr] lg:gap-8 lg:py-6">
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
