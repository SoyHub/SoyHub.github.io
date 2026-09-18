import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_HOST } from "@/lib/site";
import { getTranslations } from "next-intl/server";
import { endpoints, findEndpoint } from "@/content/endpoints";
import { palette } from "@/lib/themes";
import { fontLocale } from "@/i18n/routing";

const c = palette;

export const ogSize = { width: 1200, height: 630 };

/** Social-preview image of an endpoint page, texts from messages/<locale>.json. */
export async function endpointOg(href: string, locale: string) {
  const e = findEndpoint(href);
  if (!e) throw new Error(`unknown endpoint ${href}`);
  const t = await getTranslations({ locale: fontLocale(locale), namespace: "endpoints" });
  return ogImage({
    method: e.method,
    path: e.href,
    title: t(`${href}.title`),
    subtitle: t(`${href}.seo.og`),
  });
}

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));
const photoUri = async () =>
  `data:image/png;base64,${(await readFile(join(process.cwd(), "public/photo.png"))).toString("base64")}`;
const strip = endpoints
  .filter((e) => e.indexable && e.href !== "/")
  .map((e) => e.path)
  .join("  ·  ");

/** Shared OG frame: a response card in the site's dark palette. */
export async function ogImage({
  method,
  path,
  title,
  subtitle,
  photo = false,
}: {
  method: "GET" | "POST";
  path: string;
  title: string;
  subtitle: string;
  /** show the profile photo on the card (home page) */
  photo?: boolean;
}) {
  const [mono, serif, src] = await Promise.all([
    font("IBMPlexMono-Medium.ttf"),
    font("IBMPlexSerif-SemiBold.ttf"),
    photo ? photoUri() : Promise.resolve(null),
  ]);
  const methodColor = method === "GET" ? c.ok : c.accent;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 56,
        background: c.paper,
        backgroundImage: `linear-gradient(${c.hair}73 1px, transparent 1px), linear-gradient(90deg, ${c.hair}73 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        color: c.ink,
        fontFamily: "Plex Mono",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26 }}>
        <span style={{ color: methodColor }}>{method}</span>
        <span>{path}</span>
        <span style={{ marginLeft: "auto", color: c.muted, fontSize: 20 }}>{SITE_HOST}</span>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          marginTop: 36,
          border: `2px solid ${c.hair}`,
          background: c.surface,
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 28px",
            borderBottom: `2px solid ${c.hair}`,
            fontSize: 22,
          }}
        >
          <span
            style={{
              color: c.ok,
              border: `2px solid ${c.ok}66`,
              background: c.okSoft,
              padding: "4px 12px",
            }}
          >
            200 OK
          </span>
          <span style={{ color: c.muted }}>content-type: text/html</span>
        </div>
        <div style={{ display: "flex", flex: 1, padding: "36px 40px", gap: 40 }}>
          <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 18 }}>
            <div style={{ fontFamily: "Plex Serif", fontSize: 72, lineHeight: 1.05 }}>{title}</div>
            <div style={{ fontSize: 28, color: c.body, lineHeight: 1.35 }}>{subtitle}</div>
          </div>
          {src && (
            // satori renders plain <img>; next/image has no meaning inside an ImageResponse
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              src={src}
              width={220}
              height={220}
              style={{ borderRadius: 12, border: `2px solid ${c.hair}`, objectFit: "cover" }}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "14px 28px",
            borderTop: `2px solid ${c.hair}`,
            fontSize: 18,
            color: c.muted,
          }}
        >
          <span style={{ color: c.ok }}>GET</span>
          <span>{strip}</span>
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
