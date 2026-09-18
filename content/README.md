# content/

`profile.ts` is the single source of truth for every fact on the site, hand-derived from
`../../cv/build/content.mjs`. It is never imported across repos.

When the CV changes:

1. Update the matching fields in `profile.ts` — same dates, same numbers, same wording.
2. Bump `meta.cvVersion` (e.g. `2026.10`).
3. Mirror the change in `knowledge/*.md` (the chat corpus) and run `pnpm build-index`.
4. `pnpm test` — the guard tests fail on unfilled double-bracket placeholders, phone numbers and denylisted names.
5. `pnpm sync:assets` if the photo or the public PDF changed.

`owner-todo.ts` holds the facts still missing; `now.ts` is updated monthly.

Rules that apply to every file here: no client, programme or colleague name; no phone number;
no date of birth; nothing that has not been built.
