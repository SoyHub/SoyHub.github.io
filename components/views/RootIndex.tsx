import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProfile } from "@/content";
import { endpoints } from "@/content/endpoints";
import { MethodBadge } from "@/components/ui/MethodBadge";

export async function RootIndex() {
  const locale = await getLocale();
  const profile = getProfile(locale);
  const t = await getTranslations();
  return (
    <div className="grid gap-6 md:grid-cols-[96px_1fr]">
      <Image
        src="/photo.png"
        alt=""
        width={96}
        height={96}
        priority
        className="border-hair rounded-sm border"
      />
      <div className="min-w-0">
        <h1 className="text-ink font-serif text-2xl font-semibold">{profile.header.name}</h1>
        <p className="text-muted mt-1 font-mono text-[12px]">{profile.header.title}</p>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed">{profile.summary}</p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {profile.headline.map((h) => (
            <div key={h.label} className="border-hair bg-sunk rounded-sm border p-3">
              <dd className="text-ink font-serif text-xl font-semibold">{h.value}</dd>
              <dt className="text-muted mt-1 text-[12px]">{h.label}</dt>
            </div>
          ))}
        </dl>
        <h2 className="lbl mt-6">{t("ui.links")}</h2>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {endpoints
            .filter((e) => e.href !== "/")
            .map((e) => (
              <li key={e.href} className="min-w-0">
                <Link
                  href={e.href as never}
                  className="text-ink hover:bg-sunk flex min-w-0 items-center gap-2 rounded-sm px-1 py-0.5 font-mono text-[13px]"
                >
                  <MethodBadge method={e.method} />
                  <span dir="ltr" className="whitespace-nowrap">
                    {e.path}
                  </span>
                  <span className="text-muted truncate text-[12px]">
                    — {t(`endpoints.${e.href}.description`)}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
