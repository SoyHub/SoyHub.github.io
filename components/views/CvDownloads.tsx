import { getLocale, getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import { SITE_URL } from "@/lib/site";
import { MethodBadge } from "@/components/ui/MethodBadge";

export async function CvDownloads() {
  const locale = await getLocale();
  const profile = getProfile(locale);
  const t = await getTranslations("ui");
  const files = [
    { path: `/${locale}/cv.pdf`, type: "application/pdf", note: t("cvNotes.pdf") },
    { path: `/${locale}/cv.json`, type: "application/json", note: t("cvNotes.json") },
    { path: `/${locale}/cv.txt`, type: "text/plain", note: t("cvNotes.txt") },
    { path: "/llms.txt", type: "text/markdown", note: t("cvNotes.llms") },
  ];
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-ink text-[15px] font-semibold">CV</h1>
        <span className="text-muted font-mono text-[12px]">v{profile.meta.cvVersion}</span>
      </div>
      <ul className="divide-hair mt-3 divide-y">
        {files.map((f) => (
          <li key={f.path} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
            <MethodBadge method="GET" />
            <a
              href={f.path}
              className="text-ink decoration-hair hover:text-brass font-mono text-[13px] underline"
            >
              {f.path}
            </a>
            <span className="text-muted font-mono text-[11px]">{f.type}</span>
            <span className="text-muted ms-auto text-[12px]">{f.note}</span>
          </li>
        ))}
      </ul>
      <h2 className="lbl mt-6">{t("fromTerminal")}</h2>
      <pre
        dir="ltr"
        className="border-hair bg-sunk text-ink mt-2 overflow-x-auto rounded-sm border p-3 font-mono text-[12px]"
      >
        {`curl ${SITE_URL}/${locale}/cv.txt\ncurl ${SITE_URL}/${locale}/cv.json | jq .basics`}
      </pre>
    </div>
  );
}
