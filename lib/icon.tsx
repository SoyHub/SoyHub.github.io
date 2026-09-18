import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/content/profile";
import { theme } from "@/lib/themes";

const c = theme.dark;

/** One design for every icon size: a dark tile, the initial in brass, a prompt chevron in green. */
export function iconMark(size: number) {
  const s = size;
  const big = s >= 96;
  return (
    <div
      style={{
        width: s,
        height: s,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: c.surface,
        borderRadius: s * 0.2,
        border: `${Math.max(1, Math.round(s * 0.05))}px solid ${c.hair}`,
        fontFamily: "Plex Mono",
        fontSize: s * (big ? 0.5 : 0.62),
        lineHeight: 1,
        letterSpacing: `${-s * 0.04}px`,
        color: c.accent,
      }}
    >
      {big && (
        <div
          style={{
            position: "absolute",
            top: s * 0.14,
            left: s * 0.14,
            width: s * 0.08,
            height: s * 0.08,
            borderRadius: s,
            background: c.ok,
            boxShadow: `0 0 ${s * 0.04}px ${c.ok}`,
          }}
        />
      )}
      <span>{profile.header.name[0]}</span>
      <span style={{ color: c.ok }}>&gt;</span>
    </div>
  );
}

export async function renderIcon(size: number) {
  const mono = await readFile(join(process.cwd(), "assets/fonts/IBMPlexMono-Medium.ttf"));
  return new ImageResponse(iconMark(size), {
    width: size,
    height: size,
    fonts: [{ name: "Plex Mono", data: mono, weight: 500, style: "normal" }],
  });
}
