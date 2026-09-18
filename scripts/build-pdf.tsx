// Renders content/profile.ts to public/cv.pdf so the download never drifts from the site.
// Runs in `prebuild`; `pnpm build-pdf` to run it alone.
import { writeFile, mkdir } from "node:fs/promises";
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
import { profile } from "../content/profile";
import { SITE_HOST, SITE_URL } from "../lib/site";

const root = join(import.meta.dirname, "..");
Font.register({
  family: "Serif",
  src: join(root, "assets/fonts/IBMPlexSerif-SemiBold.ttf"),
  fontWeight: 600,
});
Font.register({ family: "Mono", src: join(root, "assets/fonts/IBMPlexMono-Medium.ttf") });
// Hyphenation off: bullets are hand-written sentences, split them only at spaces.
Font.registerHyphenationCallback((word) => [word]);

const ink = "#0b171d";
const muted = "#5b6d75";
const brass = "#9a7420";
const hair = "#c9d3d7";

const s = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 44,
    paddingHorizontal: 46,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: ink,
    lineHeight: 1.35,
  },
  name: { fontFamily: "Serif", fontSize: 22, lineHeight: 1, color: ink },
  title: { fontSize: 10, color: muted, marginTop: 8 },
  contact: { fontFamily: "Mono", fontSize: 8, color: muted, marginTop: 6 },
  link: { color: muted, textDecoration: "none" },
  h2: {
    fontFamily: "Mono",
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
  roleTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  dates: { fontFamily: "Mono", fontSize: 8, color: muted },
  sub: { fontFamily: "Helvetica-Oblique", color: muted, marginTop: 1 },
  blockTitle: { fontFamily: "Helvetica-Oblique", marginTop: 4 },
  bullet: { flexDirection: "row", marginTop: 2, paddingLeft: 6 },
  dot: { width: 10, color: brass },
  bulletText: { flex: 1 },
  skillRow: { flexDirection: "row", marginTop: 2 },
  skillLabel: { width: 96, fontFamily: "Helvetica-Bold" },
  skillItems: { flex: 1 },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 46,
    right: 46,
    fontFamily: "Mono",
    fontSize: 7,
    color: muted,
  },
});

const Bullets = ({ items }: { items: string[] }) => (
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

function Cv() {
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

        <Text style={s.h2}>PROFILE</Text>
        <Text>{profile.summary}</Text>

        <Text style={s.h2}>EXPERIENCE</Text>
        {profile.experience.map((job) => (
          <View key={`${job.company}-${job.dates}`} style={{ marginTop: 6 }}>
            <View style={s.row} wrap={false}>
              <Text style={s.roleTitle}>
                {job.role} · {job.company}, {job.place}
              </Text>
              <Text style={s.dates}>{job.dates}</Text>
            </View>
            {job.subtitle && <Text style={s.sub}>{job.subtitle}</Text>}
            {job.blocks.map((b, i) => (
              <View key={i}>
                {b.title && (
                  <View style={s.row} wrap={false}>
                    <Text style={s.blockTitle}>{b.title}</Text>
                    {b.dates && <Text style={s.dates}>{b.dates}</Text>}
                  </View>
                )}
                <Bullets items={b.bullets} />
              </View>
            ))}
          </View>
        ))}

        <Text style={s.h2}>PROJECTS</Text>
        <Bullets
          items={profile.projects.map(
            (p) =>
              `${p.title} — ${p.summary} (${p.status === "shipped" ? "shipped" : "in progress"})`,
          )}
        />

        <Text style={s.h2}>SKILLS</Text>
        {profile.skills.map((g) => (
          <View key={g.id} style={s.skillRow} wrap={false}>
            <Text style={s.skillLabel}>{g.label}</Text>
            <Text style={s.skillItems}>{g.items.join(", ")}</Text>
          </View>
        ))}

        <Text style={s.h2}>EDUCATION</Text>
        {profile.education.map((e) => (
          <View key={e.what} style={s.row} wrap={false}>
            <Text>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{e.what}</Text> · {e.where}
            </Text>
            {e.when && <Text style={s.dates}>{e.when}</Text>}
          </View>
        ))}

        <Text style={s.h2}>LANGUAGES</Text>
        <Text>{profile.languages.map((l) => `${l.name} (${l.level})`).join("  ·  ")}</Text>

        <Text style={s.footer} fixed>
          {SITE_HOST}/cv.pdf · v{profile.meta.cvVersion}
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

async function main() {
  await mkdir(join(root, "public"), { recursive: true });
  await writeFile(join(root, "public/cv.pdf"), await renderToBuffer(<Cv />));
  console.log("wrote public/cv.pdf");
}
void main();
