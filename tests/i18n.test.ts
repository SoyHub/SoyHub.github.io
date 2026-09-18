import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/content/site";
import { getNow, getProfile } from "@/content";

const root = join(__dirname, "..");
const keys = (o: unknown, prefix = ""): string[] =>
  o && typeof o === "object" && !Array.isArray(o)
    ? Object.entries(o).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
    : [prefix];
const messages = (locale: string) =>
  JSON.parse(readFileSync(join(root, "messages", `${locale}.json`), "utf8")) as unknown;

describe("languages", () => {
  const reference = keys(messages(site.defaultLocale)).sort();

  it.each(site.locales)("%s has every message key of the default language", (locale) => {
    expect(keys(messages(locale)).sort()).toEqual(reference);
  });

  it.each(site.locales)("%s has a valid profile and now", (locale) => {
    expect(existsSync(join(root, "content", locale, "profile.json"))).toBe(true);
    expect(getProfile(locale).header.email).toBe(getProfile().header.email);
    expect(getNow(locale).items.length).toBe(getNow().items.length);
  });
});
