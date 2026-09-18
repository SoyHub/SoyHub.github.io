import type { Profile } from "@/content/profile.types";
import { now } from "@/content/now";
import { endpoints } from "@/content/endpoints";
import { splitRange, monthsBetween, humanDuration } from "@/lib/dates";

/** The JSON tab of each endpoint: the real slice of profile.ts that the view rendered. */
export const endpointJson = (href: string, p: Profile, site: string): unknown => {
  switch (href) {
    case "/":
      return {
        name: p.header.name,
        title: p.header.title,
        location: p.header.location,
        headline: p.headline,
        _links: Object.fromEntries(
          endpoints.map((e) => [e.title.toLowerCase(), `${site}${e.href}`]),
        ),
      };
    case "/experience":
      return p.experience;
    case "/skills":
      return p.skills;
    case "/projects":
      return p.projects;
    case "/now":
      return now;
    case "/education":
      return { education: p.education, languages: p.languages };
    case "/health":
      return healthJson(p);
    case "/cv":
      return {
        version: p.meta.cvVersion,
        pdf: `${site}/cv.pdf`,
        json: `${site}/cv.json`,
        txt: `${site}/cv.txt`,
      };
    case "/contact":
      return { email: p.header.email, linkedin: p.header.linkedin, github: p.header.github };
    default:
      return null;
  }
};

export const healthJson = (p: Profile) => {
  const first = splitRange(p.experience.at(-1)!.dates).start;
  const current = splitRange(p.experience[0].dates).start;
  return {
    status: "UP",
    uptime: humanDuration(monthsBetween(first)),
    since: first,
    current_role: {
      title: p.experience[0].role,
      since: current,
      for: humanDuration(monthsBetween(current)),
    },
    learning: p.skills.find((g) => g.id === "learning")?.items ?? [],
    cv_version: p.meta.cvVersion,
  };
};
