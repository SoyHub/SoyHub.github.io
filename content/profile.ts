// profile.json, validated. Every fact on the site renders from here; see README.md in this folder.
import { ProfileSchema } from "./schema";
import data from "./profile.json";

export const profile = ProfileSchema.parse(data);
