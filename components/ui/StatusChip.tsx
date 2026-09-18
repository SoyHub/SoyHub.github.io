import { cx } from "@/lib/cx";

const tone = (code: number) =>
  code < 300
    ? "border-verdant/40 bg-verdant-soft text-verdant"
    : code < 400
      ? "border-brass/40 bg-brass-soft text-brass"
      : "border-signal/40 bg-signal-soft text-signal";

export function StatusChip({
  code,
  text,
  className,
}: {
  code: number;
  text: string;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[11px] font-medium tracking-wider",
        tone(code),
        className,
      )}
    >
      <span>{code}</span>
      <span className="opacity-90">{text}</span>
    </span>
  );
}
