import { ogImage, ogSize } from "@/lib/og";

export const alt = "Projects — Sohayb Hassan";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogImage({
    method: "GET",
    path: "/projects",
    title: "Projects",
    subtitle:
      "LLM-assisted legacy modernisation with differential-execution verification. Workflow automation for a banking programme.",
  });
}
