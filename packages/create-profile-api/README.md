# create-profile-api

Scaffolds a [Profile as an API](https://github.com/SoyHub/SoyHub.github.io) site: a portfolio where
every section of your CV is an endpoint — six designs (API explorer, terminal, OpenAPI spec, git
repository, status page, RPG character sheet), ten languages, static export, deploys to GitHub
Pages on push.

```
npm create profile-api my-site
cd my-site
pnpm install
pnpm dev
```

The new project starts with a fictional sample persona and one language; edit the JSON files in
`content/` and `messages/` — no code involved.

## Options

```
npm create profile-api [dir] -- [--theme console|terminal|openapi|git|status|rpg] [--lang en] [--from <url|dir>]
```

| Flag      | Default                      | What it does                                                |
| --------- | ---------------------------- | ----------------------------------------------------------- |
| `--theme` | `console`                    | The design to start with (`"theme"` in `content/site.json`) |
| `--lang`  | `en`                         | The single language kept; add more later                    |
| `--from`  | the GitHub tarball of `main` | A URL to a `.tar.gz`, or a local checkout for development   |

Requires Node 20+ and `tar` on the PATH. No dependencies.
