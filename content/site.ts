// site.json, validated: copy, theme, hero, endpoints. CV facts live in profile.json.
import { SiteSchema } from "./schema";
import data from "./site.json";

export const site = SiteSchema.parse(data);
export const heroDiff = { left: site.hero.left, right: site.hero.right };
