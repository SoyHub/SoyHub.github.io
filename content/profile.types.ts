import type { z } from "zod";
import type { ProfileSchema, SiteSchema } from "./schema";

export type Profile = z.infer<typeof ProfileSchema>;
export type Role = Profile["experience"][number];
export type Block = Role["blocks"][number];
export type Project = Profile["projects"][number];
export type SkillGroup = Profile["skills"][number];
export type Education = Profile["education"][number];

export type Site = z.infer<typeof SiteSchema>;
export type Endpoint = Site["endpoints"][number];
export type Method = Endpoint["method"];
