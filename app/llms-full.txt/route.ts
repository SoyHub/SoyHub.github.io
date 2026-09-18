import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { profile } from "@/content/profile";

export const dynamic = "force-static";

/** The same corpus the chat console retrieves from, concatenated in file order. */
export async function GET() {
  const dir = join(process.cwd(), "content/knowledge");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort();
  const parts: string[] = [];
  for (const f of files) {
    const { data, content } = matter(await readFile(join(dir, f), "utf8"));
    if (data.owner_todo) continue;
    parts.push(`## ${data.title}\n\n${content.trim()}\n`);
  }
  return new Response(`# ${profile.header.name} — knowledge corpus\n\n${parts.join("\n")}`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
