import { StatusChip } from "@/components/ui/StatusChip";

const chip: Record<string, { code: number; text: string }> = {
  shipped: { code: 200, text: "shipped" },
  in_progress: { code: 202, text: "in progress" },
  personal: { code: 202, text: "personal" },
  planned: { code: 204, text: "planned" },
};

export function ProjectCard({
  title,
  period,
  status,
  summary,
  stack,
  highlights,
}: {
  title: string;
  period: string;
  status: string;
  summary: string;
  stack: string[];
  highlights: string[];
}) {
  const c = chip[status] ?? chip.shipped;
  return (
    <article className="border-hair bg-surface rounded-sm border p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 dir="auto" className="text-ink text-[14px] font-semibold">
          {title}
        </h3>
        <span className="flex items-center gap-2">
          <span className="text-muted font-mono text-[11px]">{period}</span>
          <StatusChip code={c.code} text={c.text} />
        </span>
      </div>
      <p dir="auto" className="mt-1.5 text-[13px] leading-relaxed">
        {summary}
      </p>
      {highlights.length > 0 && (
        <ul className="mt-2 space-y-1 text-[13px]">
          {highlights.map((h) => (
            <li key={h} dir="auto" className="flex gap-2">
              <span className="text-verdant font-mono select-none">▸</span>
              {h}
            </li>
          ))}
        </ul>
      )}
      {stack.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1">
          {stack.map((s) => (
            <li
              key={s}
              className="border-hair text-muted rounded-sm border px-1.5 py-0.5 font-mono text-[11px]"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
