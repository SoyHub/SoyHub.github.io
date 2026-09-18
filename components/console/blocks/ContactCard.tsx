"use client";

import { useContact } from "../ContactContext";
import { KeyValue } from "@/components/ui/KeyValue";

export function ContactCard({ note }: { reason: string; note: string }) {
  const h = useContact();
  return (
    <div className="border-hair bg-surface rounded-sm border p-3">
      <KeyValue
        rows={[
          {
            k: "email",
            v: (
              <a className="decoration-hair hover:text-brass underline" href={`mailto:${h.email}`}>
                {h.email}
              </a>
            ),
          },
          {
            k: "linkedin",
            v: (
              <a
                className="decoration-hair hover:text-brass underline"
                href={h.linkedin}
                rel="me noopener"
              >
                {h.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            ),
          },
          {
            k: "github",
            v: (
              <a
                className="decoration-hair hover:text-brass underline"
                href={h.github}
                rel="me noopener"
              >
                {h.github.replace(/^https?:\/\//, "")}
              </a>
            ),
          },
        ]}
      />
      {note && (
        <p dir="auto" className="text-muted mt-2 text-[13px]">
          {note}
        </p>
      )}
    </div>
  );
}
