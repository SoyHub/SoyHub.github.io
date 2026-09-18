import { heroDiff } from "@/content/hero-diff";
import { DiffView } from "@/components/ui/DiffView";
import { LED } from "@/components/ui/LED";
import { StatusChip } from "@/components/ui/StatusChip";
import { ReplayButton } from "./ReplayButton";

const lineCount = heroDiff.left.lines.length + heroDiff.right.lines.length;
const total = lineCount * 90 + 400;

export function HeroDiff() {
  return (
    <section
      aria-label="COBOL to Java"
      className="border-hair bg-surface shadow-panel mb-4 rounded-sm border"
    >
      <div
        id="hero-diff"
        className="diff-anim"
        style={{ "--diff-total": `${total}ms` } as React.CSSProperties}
      >
        <div className="border-hair flex flex-wrap items-center justify-between gap-2 border-b px-3 py-1.5">
          <div className="lbl">diff · policy listing</div>
          <div className="grid items-center [&>*]:col-start-1 [&>*]:row-start-1">
            <span className="diff-status-busy justify-self-end">
              <LED state="busy" label="migrating…" />
            </span>
            <span className="diff-status-ok justify-self-end">
              <StatusChip code={200} text="equivalent" />
            </span>
          </div>
        </div>
        <div
          style={{
            minHeight: `${Math.max(heroDiff.left.lines.length, heroDiff.right.lines.length) * 20 + 60}px`,
          }}
        >
          <DiffView left={heroDiff.left} right={heroDiff.right} />
        </div>
      </div>
      <div className="border-hair flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
        <p className="text-body max-w-3xl text-[13px]">
          2020: migrated a COBOL policy-listing system to Spring Boot. Now: LLM-assisted migration
          where the generated code is proven equivalent by differential execution — in progress.
        </p>
        <ReplayButton targetId="hero-diff" />
      </div>
      <span className="sr-only">{lineCount} lines</span>
    </section>
  );
}
