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
    .enum(["console", "paper", "terminal", "slate"])
    .describe("Palette, from lib/themes.ts. Dark and light variants come with it."),
  title: z.string().describe("Home <title>; other pages use “<Page> · <name>”"),
  description: z.string(),
  ogSubtitle: z.string().describe("Subtitle on the home page's social-preview image"),
  locale: z.string().describe("Open Graph locale, e.g. en_GB"),
  hero: z.object({
    label: z.string().describe("Accessible name of the animated diff"),
    caption: z.string(),
    left: diffSide,
    right: diffSide,
  }),
  easterEgg: z.object({
    path: z.string().describe("Typing DELETE <path> in the request bar answers with the message"),
    message: z.string(),
  }),
  consoleSuggestions: z.array(z.string()),
  endpoints: z
    .array(
      z.object({
        method: z.enum(["GET", "POST"]),
        path: z.string().describe('As displayed, e.g. "/skills?filter="'),
        href: z.string().describe("The page folder under app/(explorer), e.g. /skills"),
        title: z.string(),
        description: z.string().describe("One line in the endpoint list"),
        indexable: z.boolean().describe("In the sitemap and llms.txt; false for form-like pages"),
        seo: z
          .object({
            description: z.string().describe("<meta name=description> of the page"),
            og: z.string().optional().describe("Subtitle of the page's social-preview image"),
          })
          .optional(),
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
