import { StatusChip } from "@/components/ui/StatusChip";

const text: Record<number, string> = {
  400: "Bad Request",
  403: "Forbidden",
  404: "Not Found",
  413: "Payload Too Large",
  418: "I'm a teapot",
  429: "Too Many Requests",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  503: "Service Unavailable",
};

export function StatusCard({
  code,
  reason,
  message,
  hint,
}: {
  code: number;
  reason: string;
  message: string;
  hint?: string;
}) {
  return (
    <div className="border-hair bg-surface rounded-sm border" role="status">
      <div className="border-hair flex flex-wrap items-center gap-2 border-b px-3 py-1.5">
        <StatusChip code={code} text={text[code] ?? "Error"} />
        <span className="text-muted font-mono text-[11px]">x-reason: {reason}</span>
      </div>
      <div className="p-3">
        <p dir="auto" className="text-ink text-[14px]">
          {message}
        </p>
        {hint && (
          <p dir="auto" className="text-muted mt-1 font-mono text-[12px]">
            hint: {hint}
          </p>
        )}
      </div>
    </div>
  );
}
