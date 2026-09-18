import { ogImage, ogSize } from "@/lib/og";
import { profile } from "@/content/profile";
import { site } from "@/content/site";

export const alt = `${profile.header.name} — profile as an API`;
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogImage({
    method: "GET",
    path: "/",
    title: profile.header.name,
    subtitle: site.ogSubtitle,
  });
}
