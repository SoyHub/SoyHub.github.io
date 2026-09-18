import { describe, expect, it } from "vitest";
import { profile } from "@/content/profile";
import { endpoints } from "@/content/endpoints";
import { plainTextCv } from "@/lib/serializers/plain-text";
import { jsonResume } from "@/lib/serializers/json-resume";
import { llmsTxt } from "@/lib/serializers/llms-txt";
import { stripAnsi } from "@/lib/text/ansi";
import { wrapText } from "@/lib/text/wrap";
import { splitRange, toIso } from "@/lib/dates";

const site = "https://example.test";

describe("dates", () => {
  it("converts MM/YYYY", () => {
    expect(toIso("08/2023")).toBe("2023-08");
    expect(splitRange("08/2023 – present")).toEqual({
      start: "2023-08",
      end: undefined,
      present: true,
    });
    expect(splitRange("06/2020 – 09/2020")).toEqual({
      start: "2020-06",
      end: "2020-09",
      present: false,
    });
  });
});

describe("wrap", () => {
  it("keeps lines within width with hanging indent", () => {
    const lines = wrapText("• " + "word ".repeat(60), 40, 2);
    expect(lines.every((l) => l.length <= 40)).toBe(true);
    expect(lines[1].startsWith("  ")).toBe(true);
  });
});

describe("plain-text CV", () => {
  const txt = plainTextCv(profile, site, { ansi: false });
  it("fits 80 columns", () => {
    for (const line of txt.split("\n")) expect([...line].length, line).toBeLessThanOrEqual(80);
  });
  it("has no ANSI when disabled and some when enabled", () => {
    expect(txt).not.toMatch(/\x1b/);
    const ansi = plainTextCv(profile, site, { ansi: true });
    expect(ansi).toMatch(/\x1b\[1m/);
    expect(stripAnsi(ansi)).toBe(txt);
  });
  it("never prints a phone number", () => {
    expect(txt).not.toMatch(/\+39/);
  });
});

describe("JSON Resume", () => {
  const r = jsonResume(profile, site);
  it("has ISO dates and no endDate for the current role", () => {
    expect(r.work[0].startDate).toBe("2023-08");
    expect(r.work[0]).not.toHaveProperty("endDate");
    expect(r.work.at(-1)?.endDate).toBe("2020-09");
  });
  it("folds blocks into highlights with their title", () => {
    expect(r.work[0].highlights[0]).toMatch(
      /^Mobile banking platform — major Italian retail banking group \(02\/2025 – present\): /,
    );
  });
});

describe("llms.txt", () => {
  it("lists only indexable endpoints", () => {
    const t = llmsTxt(profile, endpoints, site);
    expect(t).toContain(`${site}/experience`);
    expect(t).not.toContain(`${site}/hire`);
  });
});
