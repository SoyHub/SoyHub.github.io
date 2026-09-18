import Link from "next/link";
import { profile } from "@/content/profile";
import { LED } from "@/components/ui/LED";
import { Kbd } from "@/components/ui/Kbd";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SITE_HOST } from "@/lib/site";

export function TopBar() {
  return (
    <header className="border-hair bg-paper/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
        <Link href="/" className="text-ink font-serif text-[17px] font-semibold">
          {profile.header.name}
        </Link>
        <LED state="ok" label="up" />
        <span className="lbl hidden md:inline">{SITE_HOST}</span>
        <div className="ml-auto hidden items-center gap-1.5 md:flex" aria-hidden>
          <Kbd>/</Kbd>
          <span className="lbl">focus</span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <span className="lbl">move</span>
          <Kbd>↵</Kbd>
          <span className="lbl">send</span>
        </div>
        <nav aria-label="Profiles" className="flex items-center gap-3 md:ml-4">
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
        </nav>
      </div>
    </header>
  );
}
