import { profile } from "@/content/profile";
import { KeyValue } from "@/components/ui/KeyValue";
import { SITE_HOST } from "@/lib/site";

export function ContactCard() {
  const h = profile.header;
  return (
    <div>
      <h1 className="text-ink text-[15px] font-semibold">Contact</h1>
      <div className="mt-3">
        <KeyValue
          rows={[
            {
              k: "email",
              v: (
                <a
                  className="decoration-hair hover:text-brass underline"
                  href={`mailto:${h.email}`}
                >
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
            { k: "based in", v: h.location },
            { k: "terminal", v: <code>curl {SITE_HOST}/cv.txt</code> },
          ]}
        />
      </div>
      <p className="text-muted mt-4 text-[13px]">
        Email is the reliable channel. A subject line with the role and the location gets a faster
        answer.
      </p>
    </div>
  );
}
