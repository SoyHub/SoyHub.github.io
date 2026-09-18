import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import messages from "@/messages/en.json";
import { palette } from "@/lib/themes";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.header.name,
    short_name: profile.header.name.split(" ")[0].toLowerCase(),
    description: messages.site.description,
    start_url: "/",
    display: "browser",
    background_color: palette.paper,
    theme_color: palette.paper,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
