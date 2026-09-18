import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: "#0b171d",
        color: "#d5a93f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontFamily: "monospace",
        fontWeight: 700,
        border: "2px solid #24404c",
      }}
    >
      {profile.header.name[0]}&gt;
    </div>,
    size,
  );
}
