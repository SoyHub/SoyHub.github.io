// Writes this package's README.md from the repository README, with absolute links so images and
// relative links render on npmjs.com. Runs on `prepublishOnly`; run it by hand after README edits.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const here = import.meta.dirname;
const repo = "https://github.com/SoyHub/SoyHub.github.io";
const raw = "https://raw.githubusercontent.com/SoyHub/SoyHub.github.io/main";

let md = readFileSync(join(here, "../../README.md"), "utf8");
md = md
  .replaceAll('src=".github/', `src="${raw}/.github/`)
  .replaceAll("](.github/", `](${raw}/.github/`)
  .replaceAll("](LICENSE)", `](${repo}/blob/main/LICENSE)`)
  .replaceAll("](CONTRIBUTING.md)", `](${repo}/blob/main/CONTRIBUTING.md)`);

const options = `
## Scaffolder options

\`\`\`
npm create mycv [dir] -- [--theme console|terminal|openapi|git|status|rpg] [--lang en] [--from <url|dir>]
\`\`\`

| Flag      | Default                      | What it does                                                |
| --------- | ---------------------------- | ----------------------------------------------------------- |
| \`--theme\` | \`console\`                    | The design to start with (\`"theme"\` in \`content/site.json\`) |
| \`--lang\`  | \`en\`                         | The single language kept; add more later                    |
| \`--from\`  | the GitHub tarball of \`main\` | A URL to a \`.tar.gz\`, or a local checkout for development   |

Requires Node 20+ and \`tar\` on the PATH. The package has no dependencies; the template is fetched
from the repository at run time, so it is always the current version.
`;
md = md.replace("\n## Deploy to GitHub Pages", `${options}\n## Deploy to GitHub Pages`);
writeFileSync(join(here, "README.md"), md);
console.log("wrote packages/create-mycv/README.md from README.md");
