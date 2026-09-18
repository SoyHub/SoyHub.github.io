import { cx } from "@/lib/cx";

type Side = { title: string; lang: string; lines: string[] };

function Column({ side, sign, offset }: { side: Side; sign: "-" | "+"; offset: number }) {
  const tone = sign === "-" ? "text-signal" : "text-verdant";
  const bg = sign === "-" ? "bg-signal-soft/60" : "bg-verdant-soft/60";
  return (
    <div className="min-w-0" style={{ "--col-offset": `${offset}ms` } as React.CSSProperties}>
      <div className="border-hair flex flex-wrap items-baseline justify-between gap-x-3 border-b px-3 py-1.5">
        <span className="text-ink font-mono text-[12px]">{side.title}</span>
        <span className="lbl">{side.lang}</span>
      </div>
      <ol className="overflow-x-auto py-2 font-mono text-[12px] leading-5">
        {side.lines.map((line, i) => (
          <li
            key={i}
            className={cx("diff-line flex", bg)}
            style={{ "--i": i } as React.CSSProperties}
          >
            <span className="text-muted w-8 shrink-0 pr-2 text-right select-none">{i + 1}</span>
            <span className={cx("w-4 shrink-0 select-none", tone)}>{sign}</span>
            <pre className="text-ink whitespace-pre">{line || " "}</pre>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function DiffView({ left, right, animate }: { left: Side; right: Side; animate?: boolean }) {
  return (
    <div
      className={cx(
        "divide-hair grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0",
        animate && "diff-anim",
      )}
    >
      <Column side={left} sign="-" offset={0} />
      <Column side={right} sign="+" offset={left.lines.length * 90 + 200} />
    </div>
  );
}
