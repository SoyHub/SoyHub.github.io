import { describe, expect, it } from "vitest";
import { SiteSchema } from "@/content/schema";
import { themes } from "@/lib/themes";
import { existsSync } from "node:fs";
import { join } from "node:path";

const names = SiteSchema.shape.theme.options;

describe("themes", () => {
  it.each(names)("%s has a palette pair and a chrome folder", (name) => {
    expect(themes[name]).toBeDefined();
    expect(themes[name].dark.paper).toMatch(/^#/);
    expect(themes[name].light.paper).toMatch(/^#/);
    expect(existsSync(join(__dirname, "..", "themes", name, "index.tsx"))).toBe(true);
  });
});
