import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.header.name,
    short_name: profile.header.name.split(" ")[0].toLowerCase(),
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: site.themeColor,
    theme_color: site.themeColor,
  };
}
