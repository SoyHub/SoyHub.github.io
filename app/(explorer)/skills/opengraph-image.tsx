import { ogImage, ogSize } from "@/lib/og";

export const alt = "Skills — Sohayb Hassan";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogImage({
    method: "GET",
    path: "/skills",
    title: "Skills",
    subtitle:
      "Java 17/21 · Spring Boot 3 · React · React Native · Kubernetes · Azure DevOps · PostgreSQL · Kafka.",
  });
}
