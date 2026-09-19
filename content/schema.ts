// The shape of the JSON files in this folder. Loaders parse with these, so a typo fails the build
// with a path, not the visitor. `pnpm build-schemas` turns them into *.schema.json for editors.
import { z } from "zod";

const dates = z.string().describe('"MM/YYYY – MM/YYYY" or "MM/YYYY – present"');

export const ProfileSchema = z.object({
  $schema: z.string().optional(),
  meta: z.object({
    cvVersion: z.string().describe('Bump when facts change, e.g. "2026.10"'),
  }),
  header: z.object({
    name: z.string(),
    title: z.string().describe("One line under the name, e.g. role · stack · domain"),
    location: z.string().describe('Shown as text, e.g. "Turin, Italy"'),
    city: z.string(),
    countryCode: z.string().length(2).describe("ISO 3166-1 alpha-2, e.g. IT"),
    nationality: z.string(),
    permit: z.string().describe("Work-permit line shown on the CV; empty string to omit"),
    email: z.email(),
    linkedin: z.url(),
    github: z.url(),
  }),
  summary: z.string(),
  availability: z.object({
    state: z
      .enum(["employed", "open", "available"])
      .describe(
        "Colours the LED: employed = steady green, open = pulsing amber, available = pulsing green",
      ),
    label: z.string().describe('Shown next to the LED, e.g. "hired · accepting offers"'),
  }),
  headline: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .length(3)
    .describe("Three tiles under the summary"),
  experience: z.array(
    z.object({
      company: z.string(),
      place: z.string(),
      role: z.string(),
      dates,
      subtitle: z.string().optional(),
      blocks: z.array(
        z.object({
          title: z.string().optional(),
          dates: dates.optional(),
          bullets: z.array(z.string()).min(1),
        }),
      ),
    }),
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      status: z.enum(["in-progress", "shipped"]),
      summary: z.string(),
      stack: z.array(z.string()),
      repo: z.object({ label: z.string(), url: z.url() }).optional(),
    }),
  ),
  skills: z.array(
    z.object({
      id: z.string().describe("Used in /skills?filter=<id>"),
      label: z.string(),
      items: z.array(z.string()),
    }),
  ),
  education: z.array(
    z.object({ what: z.string(), where: z.string(), when: z.string().optional() }),
  ),
  languages: z.array(z.object({ name: z.string(), level: z.string() })),
});

const diffSide = z.object({
  title: z.string().describe("File name shown above the column"),
  lang: z.string(),
  lines: z.array(z.string()),
});

export const SiteSchema = z.object({
  $schema: z.string().optional(),
  theme: z
    .enum(["console", "terminal", "openapi", "git", "status", "rpg"])
    .describe(
      "The design: console (API explorer), terminal (CLI), openapi (Swagger spec), git (repository), status (status page), rpg (character sheet).",
    ),
  locales: z
    .array(z.string().min(2).max(5))
    .min(1)
    .describe(
      "Languages the site is built in; each needs messages/<locale>.json and content/<locale>/",
    ),
  defaultLocale: z
    .string()
    .describe("Where / redirects when the visitor's language is not available"),
  verification: z
    .object({ google: z.string().optional(), bing: z.string().optional() })
    .optional()
    .describe("Search Console / Webmaster Tools HTML-tag tokens; rendered as <meta> on every page"),
  hero: z.object({ left: diffSide, right: diffSide }),
  easterEgg: z.object({
    path: z.string().describe("Typing DELETE <path> in the request bar answers with the message"),
  }),
  endpoints: z
    .array(
      z.object({
        method: z.enum(["GET", "POST"]),
        path: z.string().describe('As displayed, e.g. "/skills?filter="'),
        href: z.string().describe("The page folder under app/[locale]/(explorer), e.g. /skills"),
        indexable: z.boolean().describe("In the sitemap and llms.txt; false for form-like pages"),
      }),
    )
    .min(1),
});

export const NowSchema = z.object({
  $schema: z.string().optional(),
  updated: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .describe("YYYY-MM, shown next to the list"),
  items: z.array(z.string()).min(1),
});
