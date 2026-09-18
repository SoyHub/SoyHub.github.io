import { cx } from "@/lib/cx";

type State = "ok" | "busy" | "warn" | "off" | "employed" | "open" | "available";

const color: Record<State, string> = {
  ok: "bg-verdant shadow-[0_0_6px_var(--verdant)]",
  busy: "bg-brass shadow-[0_0_6px_var(--brass)] led-busy",
  warn: "bg-signal shadow-[0_0_6px_var(--signal)]",
  off: "bg-hair",
  // availability, from profile.json
  employed: "bg-verdant shadow-[0_0_6px_var(--verdant)]",
  open: "bg-brass shadow-[0_0_6px_var(--brass)] led-busy",
  available: "bg-verdant shadow-[0_0_6px_var(--verdant)] led-busy",
};

export function LED({
  state,
  label,
  className,
}: {
  state: State;
  label?: string;
  className?: string;
}) {
  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <span aria-hidden className={cx("inline-block size-2 rounded-full", color[state])} />
      {label && <span className="lbl">{label}</span>}
      {!label && <span className="sr-only">{state}</span>}
    </span>
  );
}
