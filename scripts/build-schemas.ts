// content/*.schema.json from content/schema.ts, so editors validate and autocomplete the JSON files.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { NowSchema, ProfileSchema, SiteSchema } from "../content/schema";

const dir = join(import.meta.dirname, "..", "content");
for (const [name, schema] of Object.entries({
  profile: ProfileSchema,
  site: SiteSchema,
  now: NowSchema,
})) {
  const json = z.toJSONSchema(schema, { io: "input" });
  writeFileSync(join(dir, `${name}.schema.json`), JSON.stringify(json, null, 2) + "\n");
  console.log(`wrote content/${name}.schema.json`);
}
