import { site } from "@/content/site";

/**
 * One palette pair per theme (the components live in themes/<name>/; content/site.json picks one).
 * Each has a dark and a light variant; the toggle in the top bar switches between the two. The CSS
 * variables are injected by app/html-shell.tsx, and the same values colour the icons, the share
 * cards and the PDF.
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

export type Theme = {
  dark: Palette;
  light: Palette;
  /** the variant a first-time visitor gets */
  mode: "dark" | "light";
  /** body typeface; the chrome components decide the rest */
  font: "sans" | "mono";
};

const darkShadow = "0 1px 0 rgba(0, 0, 0, 0.4), 0 12px 32px -16px rgba(0, 0, 0, 0.6)";
const lightShadow = (ink: string) =>
  `0 1px 0 color-mix(in oklab, ${ink} 6%, transparent), 0 12px 32px -16px color-mix(in oklab, ${ink} 25%, transparent)`;

export const themes: Record<string, Theme> = {
  /** The API explorer: teal-black console, brass accents, request bar and response frames. */
  console: {
    mode: "dark",
    font: "sans",
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

  /** The CLI: `<name> --help`, a shell prompt, command output, phosphor green on black. */
  terminal: {
    mode: "dark",
    font: "mono",
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

  /** The API contract: a Swagger-style spec, light and clean, blue GET / green POST pills. */
  openapi: {
    mode: "light",
    font: "sans",
    light: {
      paper: "#f7f8fa",
      surface: "#ffffff",
      sunk: "#eef1f5",
      ink: "#1b2733",
      body: "#3b4b5a",
      muted: "#6b7a89",
      hair: "#d6dde6",
      accent: "#1a6fd6",
      accentSoft: "#e3eefc",
      ok: "#1f9d61",
      okSoft: "#dff3e8",
      signal: "#d1433b",
      signalSoft: "#fbe1df",
      shadow: lightShadow("#1b2733"),
    },
    dark: {
      paper: "#101720",
      surface: "#182230",
      sunk: "#131b26",
      ink: "#e8eef5",
      body: "#b8c4d2",
      muted: "#7f8fa1",
      hair: "#2a3646",
      accent: "#61affe",
      accentSoft: "#17304a",
      ok: "#49cc90",
      okSoft: "#12352a",
      signal: "#f0605a",
      signalSoft: "#3b1e1c",
      shadow: darkShadow,
    },
  },

  /** The repository: roles as commits, projects as branches, GitHub-like greys and blues. */
  git: {
    mode: "dark",
    font: "sans",
    dark: {
      paper: "#0d1117",
      surface: "#161b22",
      sunk: "#0f141b",
      ink: "#e6edf3",
      body: "#c9d1d9",
      muted: "#8b949e",
      hair: "#30363d",
      accent: "#58a6ff",
      accentSoft: "#132a45",
      ok: "#3fb950",
      okSoft: "#12301b",
      signal: "#f85149",
      signalSoft: "#3d1a19",
      shadow: darkShadow,
    },
    light: {
      paper: "#f6f8fa",
      surface: "#ffffff",
      sunk: "#eff2f5",
      ink: "#1f2328",
      body: "#3d444d",
      muted: "#656d76",
      hair: "#d0d7de",
      accent: "#0969da",
      accentSoft: "#ddf4ff",
      ok: "#1a7f37",
      okSoft: "#dafbe1",
      signal: "#cf222e",
      signalSoft: "#ffebe9",
      shadow: lightShadow("#1f2328"),
    },
  },

  /** The status page: components, uptime bars, metric tiles, the profile as a service. */
  status: {
    mode: "light",
    font: "sans",
    light: {
      paper: "#f2f5f9",
      surface: "#ffffff",
      sunk: "#e9eef5",
      ink: "#15202b",
      body: "#3a4856",
      muted: "#6e7d8c",
      hair: "#d3dbe5",
      accent: "#3d6fe0",
      accentSoft: "#e4ecfb",
      ok: "#2da44e",
      okSoft: "#dcf3e3",
      signal: "#e0553f",
      signalSoft: "#fbe3de",
      shadow: lightShadow("#15202b"),
    },
    dark: {
      paper: "#0f141b",
      surface: "#171e27",
      sunk: "#121820",
      ink: "#e8edf3",
      body: "#b9c3cf",
      muted: "#7f8c9b",
      hair: "#2a3441",
      accent: "#6b93ff",
      accentSoft: "#1a2745",
      ok: "#3fb950",
      okSoft: "#12301b",
      signal: "#ff6b5b",
      signalSoft: "#3a1e1c",
      shadow: darkShadow,
    },
  },

  /** The character sheet: deep navy, parchment ink, gold accents, HP green; a parchment light variant. */
  rpg: {
    mode: "dark",
    font: "sans",
    dark: {
      paper: "#0f0b1e",
      surface: "#1b1533",
      sunk: "#140f28",
      ink: "#f3ecd6",
      body: "#cfc6b2",
      muted: "#8f8770",
      hair: "#3a3160",
      accent: "#f2c14e",
      accentSoft: "#3a2f14",
      ok: "#7ed957",
      okSoft: "#1e3418",
      signal: "#ff5a5a",
      signalSoft: "#3f1c1c",
      shadow: darkShadow,
    },
    light: {
      paper: "#f1e6cc",
      surface: "#fbf4e2",
      sunk: "#e8dcbd",
      ink: "#2b2113",
      body: "#4d3f2b",
      muted: "#7d6d52",
      hair: "#c9b891",
      accent: "#9a6b00",
      accentSoft: "#f0dfae",
      ok: "#2f7a2a",
      okSoft: "#d9ead2",
      signal: "#b3261e",
      signalSoft: "#f3d6d0",
      shadow: lightShadow("#2b2113"),
    },
  },
};

export const theme = themes[site.theme];
/** The palette a first-time visitor sees; icons, share cards and the PDF use it too. */
export const palette = theme[theme.mode];

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
  return `[data-theme="dark"]{color-scheme:dark;${vars(dark)}}[data-theme="light"]{color-scheme:light;${vars(light)}}`;
}
