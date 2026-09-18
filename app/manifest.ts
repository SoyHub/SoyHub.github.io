import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { theme } from "@/lib/themes";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.header.name,
    short_name: profile.header.name.split(" ")[0].toLowerCase(),
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: theme.dark.paper,
    theme_color: theme.dark.paper,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
