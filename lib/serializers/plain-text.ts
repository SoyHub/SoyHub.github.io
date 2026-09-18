import type { Profile } from "@/content/profile.types";
import { ansi, stripAnsi } from "@/lib/text/ansi";
import { wrapText } from "@/lib/text/wrap";

const W = 80;

export type CvLabels = {
  profile: string;
  experience: string;
  projects: string;
  skills: string;
  education: string;
  languages: string;
  inProgress: string;
  present: string;
};

export const plainTextCv = (
  p: Profile,
  site: string,
  opts: { ansi: boolean; labels: CvLabels },
) => {
  const L = opts.labels;
  const dates = (d: string) => d.replace(/present/i, L.present);
  const c = opts.ansi
    ? ansi
    : {
        bold: (s: string) => s,
        dim: (s: string) => s,
        yellow: (s: string) => s,
        green: (s: string) => s,
        cyan: (s: string) => s,
      };
  const out: string[] = [];
  const rule = () => out.push(c.dim("─".repeat(W)));
  const section = (t: string) => {
    out.push("");
    out.push(c.yellow(t.toUpperCase()));
    rule();
  };
  const bullet = (t: string) => wrapText(`• ${t}`, W, 2).forEach((l) => out.push(l));
  const row = (left: string, right: string) => {
    const gap = W - stripAnsi(left).length - right.length;
    if (gap > 1) out.push(`${left}${" ".repeat(gap)}${c.dim(right)}`);
    else out.push(left, `${" ".repeat(Math.max(0, W - right.length))}${c.dim(right)}`);
  };

  out.push(c.bold(p.header.name.toUpperCase()));
  out.push(p.header.title);
  out.push(`${p.header.location} · ${p.header.email}`);
  out.push(
    `${p.header.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} · ${p.header.github.replace(/^https?:\/\//, "")} · ${site}`,
  );
  out.push([p.header.nationality, p.header.permit].filter(Boolean).join(" · "));

  section(L.profile);
  wrapText(p.summary, W).forEach((l) => out.push(l));

  section(L.experience);
  for (const job of p.experience) {
    out.push("");
    row(`${c.bold(job.role)} · ${job.company}, ${job.place}`, dates(job.dates));
    if (job.subtitle) out.push(c.dim(job.subtitle));
    for (const b of job.blocks) {
      if (b.title) row(`  ${b.title}`, b.dates ? dates(b.dates) : "");
      b.bullets.forEach(bullet);
    }
  }

  section(L.projects);
  p.projects.forEach((pr) =>
    bullet(`${pr.title} — ${pr.summary}${pr.status === "in-progress" ? ` (${L.inProgress})` : ""}`),
  );

  section(L.skills);
  p.skills.forEach((g) =>
    wrapText(`${g.label}: ${g.items.join(", ")}`, W, 2).forEach((l) => out.push(l)),
  );

  section(L.education);
  p.education.forEach((e) => row(`${c.bold(e.what)} · ${e.where}`, e.when ?? ""));

  section(L.languages);
  out.push(p.languages.map((l) => `${l.name} (${l.level})`).join(" · "));

  out.push("");
  rule();
  out.push(c.dim(`html: ${site}`));
  out.push(c.dim(`json: ${site}/cv.json`));
  out.push(c.dim(`pdf:  ${site}/cv.pdf`));
  out.push("");
  return out.join("\n");
};
