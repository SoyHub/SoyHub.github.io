# content/

Everything a fork changes lives here. Nothing outside this folder mentions a person.

| File             | What it holds                                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profile.ts`     | Every CV fact: header, summary, headline tiles, experience, projects, skills, education, languages. Typed by `profile.types.ts`.                                     |
| `site.ts`        | Site copy that is not a CV fact: page title and description, social-preview subtitle, the hero caption, the request-bar easter egg, the console's starter questions. |
| `endpoints.ts`   | The endpoint list — method, path, title, one-line description, per-page SEO text. Add or remove an entry here and the matching folder under `app/(explorer)/`.       |
| `now.ts`         | The `/now` page, dated. A stale "now" is worse than none — the date is shown next to it.                                                                             |
| `hero-diff.ts`   | The before/after code shown in the animated hero. Write your own; never paste code from a client system.                                                             |
| `owner-todo.ts`  | Facts you have not decided yet. `null` hides the fragment everywhere; fill it and rebuild.                                                                           |
| `knowledge/*.md` | The chat console's corpus, one chunk per file with front matter (`id`, `section`, `title`, `url`, `keywords`). Also published as `/llms-full.txt`.                   |

## When a fact changes

1. Edit `profile.ts` — and `knowledge/*.md` if the chat console is on.
2. Bump `meta.cvVersion` in `profile.ts` (e.g. `2026.10`). It shows in response headers, `cv.json` and the PDF footer.
3. `pnpm test` — guards fail on unfilled `[[placeholders]]`, phone numbers, birth dates, and any name listed in `denylist.local.json`.
4. `pnpm build` regenerates the search index and `public/cv.pdf`.

## Publishing rules the tests enforce

- No phone number, no date of birth, no home address anywhere in `content/`.
- No client, programme or colleague names. Describe clients by sector ("a retail bank", "a pay-TV broadcaster").
  Put the real names in `content/denylist.local.json` — `{"names": ["..."]}`, gitignored — and the tests fail if one slips in.
- Nothing that has not actually been built.
