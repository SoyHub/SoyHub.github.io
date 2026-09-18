// Per-language CV facts, read from content/<locale>/ and validated. Site-wide settings: site.ts.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NowSchema, ProfileSchema } from "./schema";
import { site } from "./site";

const read = (locale: string, file: string) =>
  JSON.parse(readFileSync(join(process.cwd(), "content", locale, file), "utf8")) as unknown;

const cache = new Map<string, unknown>();
const memo = <T>(key: string, load: () => T): T => {
  if (!cache.has(key)) cache.set(key, load());
  return cache.get(key) as T;
};

export const getProfile = (locale = site.defaultLocale) =>
  memo(`profile:${locale}`, () => ProfileSchema.parse(read(locale, "profile.json")));

export const getNow = (locale = site.defaultLocale) =>
  memo(`now:${locale}`, () => NowSchema.parse(read(locale, "now.json")));
