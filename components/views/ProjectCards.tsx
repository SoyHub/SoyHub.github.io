import { profile } from "@/content/profile";
import { StatusChip } from "@/components/ui/StatusChip";

export function ProjectCards() {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {profile.projects.map((p) => (
        <li key={p.id} className="border-hair bg-sunk flex flex-col rounded-sm border p-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-ink text-[15px] font-semibold">{p.title}</h2>
            {p.status === "in-progress" ? (
              <StatusChip code={202} text="in progress" />
            ) : (
              <StatusChip code={200} text="shipped" />
            )}
          </div>
          <p className="mt-2 text-[13.5px] leading-relaxed">{p.summary}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <li
                key={s}
                className="border-hair text-muted rounded-sm border px-1.5 py-0.5 font-mono text-[11px]"
              >
                {s}
              </li>
            ))}
          </ul>
          {p.repo && (
            <a href={p.repo.url} className="lbl hover:text-ink mt-3">
              {p.repo.label} →
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
