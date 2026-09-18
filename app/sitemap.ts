import type { MetadataRoute } from "next";
import { endpoints } from "@/content/endpoints";
import { getNow } from "@/content";
import { routing } from "@/i18n/routing";
import { absolute } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${getNow().updated}-01`);
  return endpoints
    .filter((e) => e.indexable)
    .flatMap((e) => {
      const path = e.href === "/" ? "/" : `${e.href}/`;
      const languages = Object.fromEntries(
        routing.locales.map((l) => [l, absolute(`/${l}${path}`)]),
      );
      return routing.locales.map((l) => ({
        url: absolute(`/${l}${path}`),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: e.href === "/" ? 1 : 0.7,
        alternates: { languages },
      }));
    });
}
