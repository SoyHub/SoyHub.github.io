#!/usr/bin/env node
// create-mycv — scaffolds a mycv site (your CV as a site, six designs) with fictional sample content.
//
//   npm create mycv my-site [-- --theme git --lang en]
//
// Downloads the template (the GitHub repo tarball, or a local checkout with --from <dir>), keeps a
// single language, drops the sample persona in, names the package after the folder and runs git init.
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve, basename } from "node:path";

const REPO_TARBALL = "https://codeload.github.com/SoyHub/SoyHub.github.io/tar.gz/main";
const THEMES = ["console", "terminal", "openapi", "git", "status", "rpg"];

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
if (args.includes("--help") || args.includes("-h")) {
  console.log(
    `usage: create-mycv [dir] [--theme ${THEMES.join("|")}] [--lang en] [--from <url|dir>]`,
  );
  process.exit(0);
}
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--"))
    i++; // skip the flag's value
  else positional.push(args[i]);
}
const dir = resolve(positional[0] ?? "mycv");
const theme = flag("theme", "console");
const lang = flag("lang", "en");
const from = flag("from", REPO_TARBALL);

const fail = (msg) => {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
};
if (!THEMES.includes(theme)) fail(`unknown theme "${theme}" — one of ${THEMES.join(", ")}`);
if (existsSync(dir) && readdirSync(dir).length) fail(`${dir} is not empty`);
mkdirSync(dir, { recursive: true });

// 1. fetch or copy the template
if (from.startsWith("http")) {
  console.log(`↓ ${from}`);
  const res = await fetch(from);
  if (!res.ok) fail(`download failed: ${res.status}`);
  const tar = spawnSync("tar", ["-xz", "--strip-components=1", "-C", dir], {
    input: Buffer.from(await res.arrayBuffer()),
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (tar.status !== 0) fail("could not extract the template — is `tar` installed?");
} else {
  const skip = new Set([
    "node_modules",
    ".git",
    ".next",
    "out",
    "packages",
    "tsconfig.tsbuildinfo",
    "next-env.d.ts",
  ]);
  cpSync(resolve(from), dir, {
    recursive: true,
    filter: (src) => !skip.has(basename(src)) && !/public\/[a-z]{2}\/cv\.pdf$/.test(src),
  });
}

// 2. make it a template: one language, the sample persona, a fresh package name
const at = (...p) => join(dir, ...p);
const json = (p) => JSON.parse(readFileSync(at(p), "utf8"));
const write = (p, o) => writeFileSync(at(p), JSON.stringify(o, null, 2) + "\n");
const sample = (p) => readFileSync(at("samples", p));

const site = json("content/site.json");
for (const l of site.locales) {
  if (l === lang) continue;
  rmSync(at("content", l), { recursive: true, force: true });
  rmSync(at("messages", `${l}.json`), { force: true });
}
if (!existsSync(at("content", lang))) mkdirSync(at("content", lang));
writeFileSync(at("content", lang, "profile.json"), sample("profile.json"));
writeFileSync(at("content", lang, "now.json"), sample("now.json"));
writeFileSync(at("messages", `${lang}.json`), sample("messages.json"));
writeFileSync(at("public", "photo.png"), sample("photo.png"));
rmSync(at("content", "knowledge"), { recursive: true, force: true });
cpSync(at("samples", "knowledge"), at("content", "knowledge"), { recursive: true });
for (const f of readdirSync(at("evals")).filter((f) => f.endsWith(".jsonl")))
  rmSync(at("evals", f));
cpSync(at("samples", "evals", "retrieval.jsonl"), at("evals", "retrieval.jsonl"));
write("content/site.json", { ...site, theme, locales: [lang], defaultLocale: lang });

const pkg = json("package.json");
delete pkg.repository;
delete pkg.homepage;
delete pkg.bugs;
write("package.json", { ...pkg, name: basename(dir), version: "0.1.0" });

for (const p of [
  "samples",
  "packages",
  "data/index.json",
  "CONTRIBUTING.md",
  "tests/samples.test.ts",
])
  rmSync(at(p), { recursive: true, force: true });
mkdirSync(at("data"), { recursive: true });

// 3. git init when git is around
const git = spawnSync("git", ["init", "-q"], { cwd: dir, stdio: "ignore" });
console.log(`
✔ ${basename(dir)} is ready (theme: ${theme}, language: ${lang})

  cd ${basename(dir)}
  pnpm install
  pnpm dev                      # http://localhost:3000

Then make it yours — everything is JSON, no code:
  content/${lang}/profile.json  your CV facts
  content/${lang}/now.json      what you are doing this month
  messages/${lang}.json         the site's texts
  public/photo.png              your photo, square

Push to a repo named <you>.github.io, set Pages → Source: GitHub Actions, and it deploys itself.${git.status === 0 ? "" : "\n  (git init skipped — git not found)"}
`);
