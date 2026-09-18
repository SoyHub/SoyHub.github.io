import { ogImage, ogSize } from "@/lib/og";

export const alt = "Experience — Sohayb Hassan";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogImage({
    method: "GET",
    path: "/experience",
    title: "Experience",
    subtitle:
      "Four roles, 2020 → present: mobile banking microservices and BFF, digital HR, media, oil & gas, COBOL → Spring Boot.",
  });
}
