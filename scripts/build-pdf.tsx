// Renders content/<locale>/profile.json to public/<locale>/cv.pdf so the download never drifts from the site.
// Runs in `prebuild`; `pnpm build-pdf` to run it alone.
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { getProfile } from "../content";
import { site } from "../content/site";
import { pdfFonts, pdfLocale } from "../i18n/routing";
import { SITE_HOST, SITE_URL } from "../lib/site";
import { theme } from "../lib/themes";

const root = join(import.meta.dirname, "..");
Font.register({
  family: "Serif",
  src: join(root, "assets/fonts/IBMPlexSerif-SemiBold.ttf"),
  fontWeight: 600,
});
Font.register({ family: "Mono", src: join(root, "assets/fonts/IBMPlexMono-Medium.ttf") });
Font.register({
  family: "Sans",
  fonts: [
    { src: join(root, "assets/fonts/IBMPlexSans-Regular.ttf") },
    { src: join(root, "assets/fonts/IBMPlexSans-Bold.ttf"), fontWeight: 700 },
    { src: join(root, "assets/fonts/IBMPlexSans-Italic.ttf"), fontStyle: "italic" },
  ],
});
// Hyphenation off: bullets are hand-written sentences, split them only at spaces.
Font.registerHyphenationCallback((word) => [word]);

const { ink, muted, accent: brass, hair } = theme.light;

// Plex faces for Latin/Cyrillic; scripts Plex lacks get a single Noto face for everything but the name.
const styles = (family: string) => {
  const sans = family === "Sans" ? "Sans" : family;
  const mono = family === "Sans" ? "Mono" : family;
  return StyleSheet.create({
    page: {
      paddingTop: 40,
      paddingBottom: 44,
      paddingHorizontal: 46,
      fontFamily: sans,
      fontSize: 9.5,
      color: ink,
      lineHeight: 1.35,
    },
    name: { fontFamily: "Serif", fontSize: 22, lineHeight: 1, color: ink },
    title: { fontSize: 10, color: muted, marginTop: 8 },
    contact: { fontFamily: mono, fontSize: 8, color: muted, marginTop: 6 },
    link: { color: muted, textDecoration: "none" },
    h2: {
      fontFamily: mono,
      fontSize: 8,
      color: brass,
      letterSpacing: 1.2,
      marginTop: 14,
      marginBottom: 5,
      paddingBottom: 3,
      borderBottomWidth: 0.6,
      borderBottomColor: hair,
    },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    roleTitle: { fontFamily: sans, fontWeight: 700, fontSize: 10 },
    dates: { fontFamily: mono, fontSize: 8, color: muted },
    sub: { fontFamily: sans, fontStyle: "italic", color: muted, marginTop: 1 },
    blockTitle: { fontFamily: sans, fontStyle: "italic", marginTop: 4 },
    bullet: { flexDirection: "row", marginTop: 2, paddingLeft: 6 },
    dot: { width: 10, color: brass },
    bulletText: { flex: 1 },
    skillRow: { flexDirection: "row", marginTop: 2 },
    skillLabel: { width: 96, fontFamily: sans, fontWeight: 700 },
    skillLabelText: { fontFamily: sans, fontWeight: 700 },
    skillItems: { flex: 1 },
    footer: {
      position: "absolute",
      bottom: 22,
      left: 46,
      right: 46,
      fontFamily: mono,
      fontSize: 7,
      color: muted,
    },
  });
};

type Styles = ReturnType<typeof styles>;

const Bullets = ({ items, s }: { items: string[]; s: Styles }) => (
  <>
    {items.map((t) => (
      <View key={t} style={s.bullet} wrap={false}>
        <Text style={s.dot}>•</Text>
        <Text style={s.bulletText}>{t}</Text>
      </View>
    ))}
  </>
);

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Cv({ locale, family }: { locale: string; family: string }) {
  const s = styles(family);
  const profile = getProfile(locale);
  const L = labels(locale);
  const h = profile.header;
  return (
    <Document title={`${h.name} — CV`} author={h.name} subject={h.title} creator={SITE_HOST}>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{h.name}</Text>
        <Text style={s.title}>{h.title}</Text>
        <Text style={s.contact}>
          {h.location} ·{" "}
          <Link style={s.link} src={`mailto:${h.email}`}>
            {h.email}
          </Link>
        </Text>
        <Text style={s.contact}>
          <Link style={s.link} src={h.linkedin}>
            {strip(h.linkedin)}
          </Link>{" "}
          ·{" "}
          <Link style={s.link} src={h.github}>
            {strip(h.github)}
          </Link>{" "}
          ·{" "}
          <Link style={s.link} src={SITE_URL}>
            {SITE_HOST}
          </Link>
        </Text>

        <Text style={s.h2}>{L.profile}</Text>
        <Text>{profile.summary}</Text>

        <Text style={s.h2}>{L.experience}</Text>
        {profile.experience.map((job) => (
          <View key={`${job.company}-${job.dates}`} style={{ marginTop: 6 }}>
            <View style={s.row} wrap={false}>
              <Text style={s.roleTitle}>
                {job.role} · {job.company}, {job.place}
              </Text>
              <Text style={s.dates}>{job.dates.replace(/present/i, L.present)}</Text>
            </View>
            {job.subtitle && <Text style={s.sub}>{job.subtitle}</Text>}
            {job.blocks.map((b, i) => (
              <View key={i}>
                {b.title && (
                  <View style={s.row} wrap={false}>
                    <Text style={s.blockTitle}>{b.title}</Text>
                    {b.dates && (
                      <Text style={s.dates}>{b.dates.replace(/present/i, L.present)}</Text>
                    )}
                  </View>
                )}
                <Bullets items={b.bullets} s={s} />
              </View>
            ))}
          </View>
        ))}

        <Text style={s.h2}>{L.projects}</Text>
        <Bullets
          s={s}
          items={profile.projects.map(
            (p) =>
              `${p.title} — ${p.summary} (${p.status === "shipped" ? L.shipped : L.inProgress})`,
          )}
        />

        <Text style={s.h2}>{L.skills}</Text>
        {profile.skills.map((g) => (
          <View key={g.id} style={s.skillRow} wrap={false}>
            <Text style={s.skillLabel}>{g.label}</Text>
            <Text style={s.skillItems}>{g.items.join(", ")}</Text>
          </View>
        ))}

        <Text style={s.h2}>{L.education}</Text>
        {profile.education.map((e) => (
          <View key={e.what} style={s.row} wrap={false}>
            <Text>
              <Text style={s.skillLabelText}>{e.what}</Text> · {e.where}
            </Text>
            {e.when && <Text style={s.dates}>{e.when}</Text>}
          </View>
        ))}

        <Text style={s.h2}>{L.languages}</Text>
        <Text>{profile.languages.map((l) => `${l.name} (${l.level})`).join("  ·  ")}</Text>

        <Text style={s.footer} fixed>
          {SITE_HOST}/{locale}/cv.pdf · v{profile.meta.cvVersion}
        </Text>
        <Text
          style={[s.footer, { left: undefined }]}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}

// Section headings come from messages/<locale>.json → ui.pdf; the CV facts from content/<locale>/.
function labels(locale: string) {
  const m = JSON.parse(readFileSync(join(root, "messages", `${locale}.json`), "utf8")) as {
    ui: {
      pdf: Record<
        "profile" | "experience" | "projects" | "skills" | "education" | "languages",
        string
      >;
      inProgress: string;
      shipped: string;
      present: string;
    };
  };
  return { ...m.ui.pdf, inProgress: m.ui.inProgress, shipped: m.ui.shipped, present: m.ui.present };
}

// Noto faces for scripts Plex does not cover, downloaded once into a gitignored cache.
async function scriptFamily(locale: string) {
  const font = pdfFonts[locale];
  if (!font) return "Sans";
  const dir = join(root, "assets/fonts/.cache");
  const path = join(dir, font.file);
  if (!existsSync(path)) {
    await mkdir(dir, { recursive: true });
    const res = await fetch(font.url);
    if (!res.ok) throw new Error(`could not fetch ${font.url}: ${res.status}`);
    await writeFile(path, Buffer.from(await res.arrayBuffer()));
  }
  // one face for every weight and style: the variable font has no italic and bold is not needed for legibility
  Font.register({
    family: font.file,
    fonts: [{ src: path }, { src: path, fontWeight: 700 }, { src: path, fontStyle: "italic" }],
  });
  return font.file;
}

async function main() {
  for (const locale of site.locales) {
    const dir = join(root, "public", locale);
    await mkdir(dir, { recursive: true });
    const l = pdfLocale(locale);
    const pdf = await renderToBuffer(<Cv locale={l} family={await scriptFamily(l)} />);
    await writeFile(join(dir, "cv.pdf"), pdf);
    if (locale === site.defaultLocale) await writeFile(join(root, "public/cv.pdf"), pdf);
  }
  console.log(`wrote public/cv.pdf and public/<locale>/cv.pdf for ${site.locales.join(", ")}`);
}
void main();
