import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_HOST } from "@/lib/site";
import { profile } from "@/content/profile";
import { findEndpoint } from "@/content/endpoints";

export const ogSize = { width: 1200, height: 630 };

/** Social-preview image of an endpoint, from its content entry. */
export function endpointOg(href: string) {
  const e = findEndpoint(href);
  if (!e?.seo?.og) throw new Error(`no og subtitle for ${href}`);
  const { og } = e.seo;
  return {
    alt: `${e.title} — ${profile.header.name}`,
    render: () => ogImage({ method: e.method, path: e.href, title: e.title, subtitle: og }),
  };
}

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

/** Shared OG frame: a response card in the site's dark palette. */
export async function ogImage({
  method,
  path,
  title,
  subtitle,
}: {
  method: "GET" | "POST";
  path: string;
  title: string;
  subtitle: string;
}) {
  const [mono, serif] = await Promise.all([
    font("IBMPlexMono-Medium.ttf"),
    font("IBMPlexSerif-SemiBold.ttf"),
  ]);
  const methodColor = method === "GET" ? "#6fb08d" : "#d5a93f";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 56,
        background: "#0b171d",
        backgroundImage:
          "linear-gradient(rgba(36,64,76,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(36,64,76,0.45) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        color: "#e6ecee",
        fontFamily: "Plex Mono",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26 }}>
        <span style={{ color: methodColor }}>{method}</span>
        <span>{path}</span>
        <span style={{ marginLeft: "auto", color: "#7d949d", fontSize: 20 }}>{SITE_HOST}</span>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          marginTop: 36,
          border: "2px solid #24404c",
          background: "#122630",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 28px",
            borderBottom: "2px solid #24404c",
            fontSize: 22,
          }}
        >
          <span
            style={{
              color: "#6fb08d",
              border: "2px solid rgba(111,176,141,0.4)",
              background: "#172c24",
              padding: "4px 12px",
            }}
          >
            200 OK
          </span>
          <span style={{ color: "#7d949d" }}>content-type: text/html</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "36px 40px", gap: 18 }}>
          <div style={{ fontFamily: "Plex Serif", fontSize: 72, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 28, color: "#b9c8ce", lineHeight: 1.35 }}>{subtitle}</div>
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Plex Mono", data: mono, weight: 500, style: "normal" },
        { name: "Plex Serif", data: serif, weight: 600, style: "normal" },
      ],
    },
  );
}
