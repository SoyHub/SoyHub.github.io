import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NowSchema, ProfileSchema } from "@/content/schema";

// The scaffolder ships these; they must stay valid and in step with the real message keys.
const root = join(__dirname, "..");
const read = (p: string) => JSON.parse(readFileSync(join(root, p), "utf8")) as unknown;
const keys = (o: unknown, prefix = ""): string[] =>
  o && typeof o === "object" && !Array.isArray(o)
    ? Object.entries(o).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
    : [prefix];

describe("samples", () => {
  it("profile and now match the schemas", () => {
    expect(() => ProfileSchema.parse(read("samples/profile.json"))).not.toThrow();
    expect(() => NowSchema.parse(read("samples/now.json"))).not.toThrow();
  });
  it("messages have the same keys as messages/en.json", () => {
    expect(keys(read("samples/messages.json")).sort()).toEqual(
      keys(read("messages/en.json")).sort(),
    );
  });
  it("mention nobody real", () => {
    for (const f of ["samples/profile.json", "samples/messages.json", "samples/now.json"])
      expect(readFileSync(join(root, f), "utf8")).not.toMatch(/sohayb|capgemini/i);
  });
});
