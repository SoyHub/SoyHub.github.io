export type Block = { title?: string; dates?: string; bullets: string[] };

export type Role = {
  company: string;
  place: string;
  role: string;
  /** "MM/YYYY – MM/YYYY" or "MM/YYYY – present", exactly as on the CV */
  dates: string;
  subtitle?: string;
  blocks: Block[];
};

export type Project = {
  id: string;
  title: string;
  status: "in-progress" | "shipped";
  summary: string;
  stack: string[];
  repo?: { label: string; url: string };
};

export type SkillGroup = { id: string; label: string; items: string[] };

export type Education = { what: string; where: string; when?: string };

export type Profile = {
  meta: { cvVersion: string };
  header: {
    name: string;
    title: string;
    /** shown on the site, e.g. "Turin, Italy" */
    location: string;
    /** structured twin of `location`, for JSON-LD and JSON Resume */
    city: string;
    countryCode: string;
    nationality: string;
    permit: string;
    email: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  headline: { value: string; label: string }[];
  experience: Role[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education[];
  languages: { name: string; level: string }[];
};
