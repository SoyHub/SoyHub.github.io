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
import { handle } from "@/lib/handle";
import { Frame as CommitFrame, Nav, Request } from "./client";
import { sha } from "./sha";

/** The repository: endpoints are commits on a graph, pages are `git show`, the hero is a diff. */
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

async function TopBar() {
  const profile = getProfile(await getLocale());
  return (
    <header className="border-hair bg-surface sticky top-0 z-10 border-b">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 text-[14px]">
        <span className="text-muted" aria-hidden>
          ⑂
        </span>
        <Link href="/" className="text-brass hover:underline">
          {handle(profile.header.github)}
        </Link>
        <span className="text-muted">/</span>
        <Link href="/" className="text-brass font-semibold hover:underline">
          {slug(profile.header.name)}
        </Link>
        <span className="border-hair text-muted hidden rounded-full border px-2 py-0.5 text-[11px] xl:inline">
          Public
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

async function Frame(props: {
  href: string;
  status: number;
  statusText: string;
  headers: [string, string][];
  json: unknown;
  children: ReactNode;
}) {
  const profile = getProfile(await getLocale());
  return (
    <CommitFrame
      {...props}
      commit={{
        hash: sha(props.href, 40),
        author: profile.header.name,
        email: profile.header.email,
        date: `${profile.meta.cvVersion.replace(".", "-")}-01`,
      }}
    />
  );
}

const total = (heroDiff.left.lines.length + heroDiff.right.lines.length) * 90 + 400;
const added = heroDiff.right.lines.length;
const removed = heroDiff.left.lines.length;

async function Hero() {
  const t = await getTranslations("site");
  const profile = getProfile(await getLocale());
  return (
    <section aria-label={t("hero.label")} className="mb-4 space-y-3">
      <div className="border-hair bg-surface shadow-panel rounded-sm border p-5">
        <div className="text-muted mb-2 font-mono text-[12px]">README.md</div>
        <h1 className="text-ink text-[24px] font-semibold">{profile.header.name}</h1>
        <p className="text-body mt-1 text-[14px]">{profile.header.title}</p>
      </div>
      <div className="border-hair bg-surface shadow-panel rounded-sm border">
        <div
          dir="ltr"
          className="border-hair flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-2 font-mono text-[12px]"
        >
          <span className="text-ink">
            diff --git a/{heroDiff.left.title} b/{heroDiff.right.title}
          </span>
          <span className="ms-auto">
            <span className="text-verdant">+{added}</span>{" "}
            <span className="text-signal">−{removed}</span>
          </span>
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
  const profile = getProfile(locale);
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-6">
      <p className="lbl">
        HEAD → main · {sha("/")} · v{profile.meta.cvVersion} · {t("footer", { locale })}
      </p>
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
