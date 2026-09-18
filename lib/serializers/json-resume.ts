import type { Profile } from "@/content/profile.types";
import { splitRange } from "@/lib/dates";
import { handle } from "@/lib/handle";

/** JSON Resume v1.0.0 — https://jsonresume.org/schema */
export const jsonResume = (p: Profile, site: string) => ({
  $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  basics: {
    name: p.header.name,
    label: p.header.title,
    email: p.header.email,
    url: site,
    summary: p.summary,
    location: { city: p.header.city, countryCode: p.header.countryCode },
    profiles: [
      { network: "LinkedIn", username: handle(p.header.linkedin), url: p.header.linkedin },
      { network: "GitHub", username: handle(p.header.github), url: p.header.github },
    ],
  },
  work: p.experience.map((job) => {
    const { start, end } = splitRange(job.dates);
    return {
      name: job.company,
      position: job.role,
      location: job.place,
      startDate: start,
      ...(end ? { endDate: end } : {}),
      ...(job.subtitle ? { summary: job.subtitle } : {}),
      highlights: job.blocks.flatMap((b) =>
        b.bullets.map((t) => (b.title ? `${b.title} (${b.dates}): ${t}` : t)),
      ),
    };
  }),
  education: p.education.map((e) => ({
    institution: e.where,
    studyType: e.what,
    ...(e.when ? { summary: e.when } : {}),
  })),
  skills: p.skills.map((g) => ({ name: g.label, keywords: g.items })),
  languages: p.languages.map((l) => ({ language: l.name, fluency: l.level })),
  projects: p.projects.map((pr) => ({
    name: pr.title,
    description: pr.summary,
    keywords: pr.stack,
    ...(pr.repo ? { url: pr.repo.url } : {}),
  })),
  meta: {
    canonical: `${site}/cv.json`,
    version: p.meta.cvVersion,
    lastModified: `${p.meta.cvVersion.replace(".", "-")}-01`,
  },
});
