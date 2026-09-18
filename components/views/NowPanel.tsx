import { now } from "@/content/now";

export function NowPanel() {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-ink text-[15px] font-semibold">Now</h1>
        <time dateTime={now.updated} className="text-muted font-mono text-[12px]">
          updated {now.updated}
        </time>
      </div>
      <ul className="mt-3 space-y-2 text-[14px] leading-relaxed">
        {now.items.map((t) => (
          <li key={t} className="flex gap-2">
            <span className="text-verdant font-mono select-none">▸</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
