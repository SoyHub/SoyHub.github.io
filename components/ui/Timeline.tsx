import type { Role } from "@/content/profile.types";
import { LED } from "./LED";
import { splitRange } from "@/lib/dates";

/** "08/2023 – present" with the last word in the visitor's language. */
const localDates = (dates: string, present: string) => dates.replace(/present/i, present);

export function Timeline({ roles, presentWord }: { roles: Role[]; presentWord: string }) {
  return (
    <ol className="border-hair relative border-s ps-5">
      {roles.map((job, i) => {
        const { present, start } = splitRange(job.dates);
        return (
          <li key={i} className="relative pb-8 last:pb-0">
            <span className="absolute -start-[25px] top-1.5">
              <LED state={present ? "ok" : "off"} />
            </span>
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-ink text-[15px] font-semibold">
                {job.role}{" "}
                <span className="text-muted font-normal">
                  · {job.company}, {job.place}
                </span>
              </h2>
              <time dateTime={start} dir="ltr" className="text-muted font-mono text-[12px]">
                {localDates(job.dates, presentWord)}
              </time>
            </header>
            {job.subtitle && <p className="text-muted mt-0.5 text-[13px] italic">{job.subtitle}</p>}
            {job.blocks.map((b, j) => (
              <div key={j} className="mt-3">
                {b.title && (
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-ink text-[13px] font-medium">{b.title}</h3>
                    {b.dates && (
                      <span dir="ltr" className="text-muted font-mono text-[12px]">
                        {localDates(b.dates, presentWord)}
                      </span>
                    )}
                  </div>
                )}
                <ul className="mt-1.5 space-y-1.5 text-[13.5px] leading-relaxed">
                  {b.bullets.map((t, k) => (
                    <li key={k} className="flex gap-2">
                      <span className="text-verdant font-mono select-none">▸</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </li>
        );
      })}
    </ol>
  );
}
