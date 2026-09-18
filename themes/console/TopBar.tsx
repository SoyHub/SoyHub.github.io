import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProfile } from "@/content";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { LED } from "@/components/ui/LED";
import { Kbd } from "@/components/ui/Kbd";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export async function TopBar() {
  const t = await getTranslations("ui");
  const profile = getProfile(await getLocale());
  return (
    <header className="border-hair bg-paper/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
        <Link href="/" className="text-ink font-serif text-[17px] font-semibold">
          {profile.header.name}
        </Link>
        <LED state={profile.availability.state} label={profile.availability.label} />
        <div
          className="ms-auto hidden items-center gap-1.5 xl:flex"
          title={`/ ${t("focus")} · ↑↓ ${t("move")} · ↵ ${t("send")}`}
          aria-hidden
        >
          <Kbd>/</Kbd>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>↵</Kbd>
        </div>
        <nav
          aria-label={t("profiles")}
          className="flex flex-wrap items-center gap-x-3 gap-y-2 md:ms-auto xl:ms-4"
        >
          <a href={`mailto:${profile.header.email}`} className="lbl hover:text-ink">
            {t("email")}
          </a>
          <a href={profile.header.linkedin} rel="me noopener" className="lbl hover:text-ink">
            {t("linkedin")}
          </a>
          <a href={profile.header.github} rel="me noopener" className="lbl hover:text-ink">
            {t("github")}
          </a>
          <ThemeToggle />
          <LanguageSwitch />
        </nav>
      </div>
    </header>
  );
}
