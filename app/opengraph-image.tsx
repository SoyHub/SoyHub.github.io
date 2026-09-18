import { ogImage, ogSize } from "@/lib/og";

export const alt = "Sohayb Hassan — profile as an API";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogImage({
    method: "GET",
    path: "/",
    title: "Sohayb Hassan",
    subtitle:
      "Full-stack engineer · Java / Spring Boot · React · six years in banking. Browse the profile as an API.",
  });
}
