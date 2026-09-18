import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CvLabels } from "@/lib/serializers/plain-text";

/** Section headings and status words of the CV in one language, from messages/<locale>.json. */
export function cvLabels(locale: string): CvLabels {
  const m = JSON.parse(readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8")) as {
    ui: { pdf: Omit<CvLabels, "inProgress" | "present">; inProgress: string; present: string };
  };
  return { ...m.ui.pdf, inProgress: m.ui.inProgress, present: m.ui.present };
}
