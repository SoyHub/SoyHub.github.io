import Link from "next/link";
import { endpoints } from "@/content/endpoints";
import { StatusChip } from "@/components/ui/StatusChip";
import { MethodBadge } from "@/components/ui/MethodBadge";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <section className="border-hair bg-surface shadow-panel rounded-sm border">
        <div className="border-hair flex items-center gap-3 border-b px-3 py-2">
          <StatusChip code={404} text="Not Found" />
          <span className="text-muted font-mono text-[11px]">content-type: text/html</span>
        </div>
        <div className="p-5">
          <h1 className="text-ink text-[15px] font-semibold">No such endpoint.</h1>
          <p className="text-muted mt-1 text-[13px]">The registry knows these:</p>
          <ul className="mt-3 space-y-1">
            {endpoints.map((e) => (
              <li key={e.href}>
                <Link
                  href={e.href as never}
                  className="text-ink hover:text-brass flex items-center gap-2 font-mono text-[13px]"
                >
                  <MethodBadge method={e.method} />
                  {e.path}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
