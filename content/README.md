# content/

Everything a fork changes lives here, as JSON. Nothing outside this folder mentions a person.

| File             | What it holds                                                                                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profile.json`   | Every CV fact: header, summary, headline tiles, experience, projects, skills, education, languages.                                                                                                                     |
| `site.json`      | The theme; page title and description; social-preview subtitle; the hero (caption and the before/after code); the request-bar easter egg; the console's starter questions; the endpoint list with each page's SEO text. |
| `now.json`       | The `/now` page, dated (`YYYY-MM`). A stale "now" is worse than none — the date is shown next to it.                                                                                                                    |
| `*.schema.json`  | Generated from `schema.ts` (`pnpm build-schemas`). Each JSON file's `$schema` points at its own, so editors autocomplete and validate. Don't edit by hand.                                                              |
| `schema.ts`      | The shape of the JSON, with a description per field. The loaders (`profile.ts`, `site.ts`, `now.ts`) parse with it, so a wrong file fails the build with the path of the wrong field.                                   |
| `knowledge/*.md` | The chat console's corpus, one chunk per file with front matter (`id`, `section`, `title`, `url`, `keywords`). Also published as `/llms-full.txt`.                                                                      |

## When a fact changes

1. Edit `profile.json` — and `knowledge/*.md` if the chat console is on.
2. Bump `meta.cvVersion` in `profile.json` (e.g. `2026.10`). It shows in response headers, `cv.json` and the PDF footer.
3. `pnpm test` — guards fail on unfilled `[[placeholders]]`, phone numbers, birth dates, and any name listed in `denylist.local.json`.
4. `pnpm build` regenerates the search index, `public/cv.pdf` and the favicon.

## Publishing rules the tests enforce

- No phone number, no date of birth, no home address anywhere in `content/`.
- No client, programme or colleague names. Describe clients by sector ("a retail bank", "a pay-TV broadcaster").
  Put the real names in `content/denylist.local.json` — `{"names": ["..."]}`, gitignored — and the tests fail if one slips in.
- Nothing that has not actually been built.
