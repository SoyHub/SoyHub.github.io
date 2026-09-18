import { site } from "@/content/site";

/**
 * Palettes. Pick one in content/site.json → "theme". Each has a dark and a light variant; the
 * toggle in the top bar switches between the two. The CSS variables are injected by app/layout.tsx,
 * and the same values colour the icons, the share cards and the PDF.
 *
 *   paper    page background          ink      headings, strong text
 *   surface  panels                   body     paragraphs
 *   sunk     inputs, code blocks      muted    labels, secondary text
 *   hair     borders                  accent   the brand colour: POST badge, links, focus, buttons
 *   ok       GET badge, 200 chips     signal   errors, 4xx/5xx
 *   *Soft    tinted backgrounds behind accent / ok / signal text
 */
export type Palette = {
  paper: string;
  surface: string;
  sunk: string;
  ink: string;
  body: string;
  muted: string;
  hair: string;
  accent: string;
  accentSoft: string;
  ok: string;
  okSoft: string;
  signal: string;
  signalSoft: string;
  shadow: string;
};

export type Theme = { dark: Palette; light: Palette };

const darkShadow = "0 1px 0 rgba(0, 0, 0, 0.4), 0 12px 32px -16px rgba(0, 0, 0, 0.6)";
const lightShadow = (ink: string) =>
  `0 1px 0 color-mix(in oklab, ${ink} 6%, transparent), 0 12px 32px -16px color-mix(in oklab, ${ink} 25%, transparent)`;

export const themes: Record<string, Theme> = {
  /** Teal-black engineering console with brass accents. The original. */
  console: {
    dark: {
      paper: "#0b171d",
      surface: "#122630",
      sunk: "#0e1f27",
      ink: "#e6ecee",
      body: "#b9c8ce",
      muted: "#7d949d",
      hair: "#24404c",
      accent: "#d5a93f",
      accentSoft: "#2e2716",
      ok: "#6fb08d",
      okSoft: "#172c24",
      signal: "#e3796a",
      signalSoft: "#33201d",
      shadow: darkShadow,
    },
    light: {
      paper: "#edf0f1",
      surface: "#ffffff",
      sunk: "#e3e8ea",
      ink: "#10222b",
      body: "#2c424e",
      muted: "#61757f",
      hair: "#cbd5d9",
      accent: "#8f6a1b",
      accentSoft: "#ebdfc4",
      ok: "#2c6349",
      okSoft: "#d8e7df",
      signal: "#a8332a",
      signalSoft: "#f2dcd9",
      shadow: lightShadow("#10222b"),
    },
  },

  /** Warm cream paper and oxblood ink — reads like a printed CV. */
  paper: {
    dark: {
      paper: "#1a1512",
      surface: "#241d19",
      sunk: "#1f1815",
      ink: "#f1e9df",
      body: "#cfc3b5",
      muted: "#94867a",
      hair: "#3d322b",
      accent: "#d98c6b",
      accentSoft: "#3a241c",
      ok: "#9bb87c",
      okSoft: "#25301c",
      signal: "#e07a6c",
      signalSoft: "#3b211d",
      shadow: darkShadow,
    },
    light: {
      paper: "#f4efe6",
      surface: "#fffdf8",
      sunk: "#ece5d8",
      ink: "#231a14",
      body: "#4a3d33",
      muted: "#7d6e62",
      hair: "#d9cfc0",
      accent: "#8c2f1e",
      accentSoft: "#f2dcd3",
      ok: "#4a6b2f",
      okSoft: "#e2ead6",
      signal: "#b03a2e",
      signalSoft: "#f5dad5",
      shadow: lightShadow("#231a14"),
    },
  },

  /** Black terminal, phosphor green, amber for the write verbs. */
  terminal: {
    dark: {
      paper: "#050705",
      surface: "#0c110c",
      sunk: "#080c08",
      ink: "#d9f2d9",
      body: "#a9c8a9",
      muted: "#6f8f6f",
      hair: "#1f2f1f",
      accent: "#f0b429",
      accentSoft: "#2a2410",
      ok: "#3fd67c",
      okSoft: "#0f2a1a",
      signal: "#ff6b5b",
      signalSoft: "#331612",
      shadow: darkShadow,
    },
    light: {
      paper: "#eef2ee",
      surface: "#ffffff",
      sunk: "#e2e9e2",
      ink: "#0d1a0d",
      body: "#2b3d2b",
      muted: "#5d735d",
      hair: "#c6d3c6",
      accent: "#8a5a00",
      accentSoft: "#f1e4bf",
      ok: "#1f7a45",
      okSoft: "#d5ecdc",
      signal: "#b3261e",
      signalSoft: "#f6d9d6",
      shadow: lightShadow("#0d1a0d"),
    },
  },

  /** Neutral slate with an electric-blue accent — the corporate one. */
  slate: {
    dark: {
      paper: "#0f1218",
      surface: "#171b23",
      sunk: "#12161d",
      ink: "#e8ebf0",
      body: "#bcc3cf",
      muted: "#7f8898",
      hair: "#2a3040",
      accent: "#5b9dff",
      accentSoft: "#17233a",
      ok: "#4fc08d",
      okSoft: "#132a22",
      signal: "#ff7a70",
      signalSoft: "#3a1e1c",
      shadow: darkShadow,
    },
    light: {
      paper: "#f0f2f5",
      surface: "#ffffff",
      sunk: "#e5e8ee",
      ink: "#141922",
      body: "#333c4d",
      muted: "#67717f",
      hair: "#cdd3dc",
      accent: "#1f5fd1",
      accentSoft: "#dce6fa",
      ok: "#1e7a53",
      okSoft: "#d6ede3",
      signal: "#c0392b",
      signalSoft: "#f7dad7",
      shadow: lightShadow("#141922"),
    },
  },
};

export const theme = themes[site.theme];

/** CSS custom properties for both variants; the names match `@theme inline` in globals.css. */
export function themeCss({ dark, light }: Theme) {
  const vars = (p: Palette) =>
    [
      `--paper:${p.paper}`,
      `--surface:${p.surface}`,
      `--sunk:${p.sunk}`,
      `--ink:${p.ink}`,
      `--body:${p.body}`,
      `--muted:${p.muted}`,
      `--hair:${p.hair}`,
      `--brass:${p.accent}`,
      `--brass-soft:${p.accentSoft}`,
      `--verdant:${p.ok}`,
      `--verdant-soft:${p.okSoft}`,
      `--signal:${p.signal}`,
      `--signal-soft:${p.signalSoft}`,
      `--shadow:${p.shadow}`,
    ].join(";");
  return `:root,[data-theme="dark"]{color-scheme:dark;${vars(dark)}}[data-theme="light"]{color-scheme:light;${vars(light)}}`;
}
