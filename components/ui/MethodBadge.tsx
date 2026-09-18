import { cx } from "@/lib/cx";

const tone: Record<string, string> = {
  GET: "text-verdant",
  POST: "text-brass",
  DELETE: "text-signal",
};

export function MethodBadge({ method, className }: { method: string; className?: string }) {
  return (
    <span
      className={cx(
        "inline-block w-11 shrink-0 font-mono text-[11px] font-medium tracking-wider",
        tone[method] ?? "text-muted",
        className,
      )}
    >
      {method}
    </span>
  );
}
