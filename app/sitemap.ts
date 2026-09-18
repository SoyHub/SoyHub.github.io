import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { endpoints } from "@/content/endpoints";
import { now } from "@/content/now";
import { absolute } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${now.updated}-01`);
  return endpoints
    .filter((e) => e.indexable)
    .map((e) => ({
      url: absolute(e.href === "/" ? "/" : `${e.href}/`),
      lastModified,
      changeFrequency: "monthly",
      priority: e.href === "/" ? 1 : 0.7,
    }));
}
