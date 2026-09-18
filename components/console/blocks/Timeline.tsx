import { LED } from "@/components/ui/LED";

type Entry = {
  start: string;
  end: string;
  org: string;
  role: string;
  summary: string;
  chunk_id: string;
};

export function ChatTimeline({ entries }: { entries: Entry[] }) {
  return (
    <ol className="border-hair relative border-l pl-5">
      {entries.map((e, i) => (
        <li key={i} className="relative pb-4 last:pb-0">
          <span className="absolute top-1 -left-[25px]">
            <LED state={/present/i.test(e.end) ? "ok" : "off"} />
          </span>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <span className="text-ink text-[14px] font-medium">
              {e.role} <span className="text-muted font-normal">· {e.org}</span>
            </span>
            <span className="text-muted font-mono text-[11px]">
              {e.start} – {e.end}
            </span>
          </div>
          <p dir="auto" className="text-body text-[13px]">
            {e.summary}
          </p>
        </li>
      ))}
    </ol>
  );
}
