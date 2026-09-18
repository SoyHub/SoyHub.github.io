import type { Profile } from "@/content/profile.types";
import type { Endpoint } from "@/content/endpoints";

export const llmsTxt = (p: Profile, endpoints: Endpoint[], site: string) =>
  [
    `# ${p.header.name}`,
    "",
    `> ${p.summary}`,
    "",
    "## Endpoints",
    "",
    ...endpoints
      .filter((e) => e.indexable)
      .map((e) => `- [${e.title}](${site}${e.href}): ${e.description}`),
    "",
    "## Machine-readable",
    "",
    `- [cv.json](${site}/cv.json): JSON Resume`,
    `- [cv.txt](${site}/cv.txt): plain-text CV, 80 columns, ANSI`,
    `- [llms-full.txt](${site}/llms-full.txt): the full knowledge corpus behind the chat console`,
    "",
    "## Optional",
    "",
    `- [LinkedIn](${p.header.linkedin})`,
    `- [GitHub](${p.header.github})`,
    "",
  ].join("\n");
