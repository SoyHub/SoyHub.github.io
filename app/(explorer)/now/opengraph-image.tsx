import { ogImage, ogSize } from "@/lib/og";

export const alt = "Now — Sohayb Hassan";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogImage({
    method: "GET",
    path: "/now",
    title: "Now",
    subtitle: "What he is working on this month — dated, updated monthly.",
  });
}
