# Contributing

Thanks for looking. This is one person's portfolio that doubles as a template, so the bar is:
keep it small, keep it working, keep the content out of the code.

## Run the checks

```
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm build            # static export in out/, plus PDFs and favicon
```

CI runs the same, then scaffolds a fresh project with `packages/create-mycv` and builds it.

## Add a theme

A theme is a folder under `themes/<name>/` exporting `chrome = { TopBar, Nav, Request, Frame, Hero, Footer, Shell }`
(see `lib/chrome.ts` for the props). Three touch points: `lib/themes.ts` (its dark and light
palette, default mode, body typeface), `lib/chrome.ts` (register it), `content/schema.ts` (the enum;
run `pnpm build-schemas`). Keep the ARIA roles the existing themes use — keyboard navigation and
the tests rely on them. Add a row to the README table and run `pnpm screenshots`.

## Add a language

Add the code to `locales` in `content/site.json`, then create `messages/<code>.json`,
`content/<code>/profile.json` and `content/<code>/now.json` from the English ones. `pnpm test`
checks that every language has the same message keys. Right-to-left scripts go in `rtl` in
`i18n/routing.ts`; scripts the bundled fonts don't cover fall back to the default language for
share cards and the PDF (`fontLocale`, `pdfLocale`).

## Content rules

No phone numbers, birth dates, home addresses, or client/colleague names anywhere in `content/`
or `messages/` — the tests enforce it. Describe clients by sector.

## Publishing the scaffolder

`packages/create-mycv` has no dependencies and fetches the `main` tarball at run time, so
it only needs a new version when its own script changes:

```
cd packages/create-mycv
npm version patch
npm publish
```
