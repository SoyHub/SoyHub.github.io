import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sohayb Hassan",
    short_name: "sohayb",
    description: "Full-stack engineer — profile as an API.",
    start_url: "/",
    display: "browser",
    background_color: "#0b171d",
    theme_color: "#0b171d",
  };
}
