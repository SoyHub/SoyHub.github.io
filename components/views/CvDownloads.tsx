import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import { MethodBadge } from "@/components/ui/MethodBadge";

const files = [
  { path: "/cv.pdf", type: "application/pdf", note: "two pages, A4" },
  { path: "/cv.json", type: "application/json", note: "JSON Resume v1.0.0" },
  { path: "/cv.txt", type: "text/plain", note: "80 columns, ANSI" },
  { path: "/llms.txt", type: "text/markdown", note: "for crawlers that read" },
];

export function CvDownloads() {
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
            <span className="text-muted ml-auto text-[12px]">{f.note}</span>
          </li>
        ))}
      </ul>
      <h2 className="lbl mt-6">from a terminal</h2>
      <pre className="border-hair bg-sunk text-ink mt-2 overflow-x-auto rounded-sm border p-3 font-mono text-[12px]">
        {`curl ${SITE_URL}/cv.txt\ncurl ${SITE_URL}/cv.json | jq .basics`}
      </pre>
    </div>
  );
}
