import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { profile } from "@/content/profile";
import { endpoints } from "@/content/endpoints";

const root = join(__dirname, "..");
const contentFiles = (): string[] => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
      d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)],
    );
  return walk(join(root, "content")).filter((f) => /\.(ts|md)$/.test(f));
};

// Real names live in a gitignored file: {"names": ["..."]}. Absent locally → the check is skipped.
const denylist = (): string[] => {
  const p = join(root, "content/denylist.local.json");
  if (!existsSync(p)) return [];
  return JSON.parse(readFileSync(p, "utf8")).names ?? [];
};

describe("publishing rules", () => {
  it("no unfilled [[placeholders]] reach the site", () => {
    for (const f of contentFiles()) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/\[\[[a-z]/i);
    }
  });

  it("no phone number, no date of birth", () => {
    const all = JSON.stringify(profile);
    expect(all).not.toMatch(/\+39|347\s?543|1995/);
    for (const f of contentFiles()) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/\+39\s?3\d\d|347\s?543|5 August 1995|born/i);
    }
  });

  it("no denylisted client / colleague names", () => {
    const names = denylist();
    for (const f of contentFiles()) {
      const text = readFileSync(f, "utf8").toLowerCase();
      for (const n of names) expect(text, `${f} mentions ${n}`).not.toContain(n.toLowerCase());
    }
  });
});

describe("endpoint registry ↔ pages", () => {
  it("every endpoint has a page and every page an endpoint", () => {
    const dir = join(root, "app/(explorer)");
    const pages = readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, "page.tsx")))
      .map((d) => `/${d.name}`)
      .concat("/")
      .sort();
    expect(endpoints.map((e) => e.href).sort()).toEqual(pages);
  });
});
