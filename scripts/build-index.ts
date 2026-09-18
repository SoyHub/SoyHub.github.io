// Chunks content/knowledge/*.md → data/index.json (embeddings + BM25 stats).
// Skips owner_todo chunks and anything with an unfilled [[placeholder]]. Voyage is only called
// when the corpus hash changed, so `pnpm build` without VOYAGE_API_KEY still succeeds on an up-to-date index.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { tokenize } from "../lib/rag/tokenize";
import { bm25Stats } from "../lib/rag/bm25";
import { normalize } from "../lib/rag/vector";
import { embed, VOYAGE_MODEL } from "../lib/rag/voyage";
import type { Chunk, IndexFile } from "../lib/rag/types";

const root = join(__dirname, "..");
const src = join(root, "content/knowledge");
const out = join(root, "data/index.json");

type Raw = Omit<Chunk, "vector" | "tokens"> & { keywords: string };

const raws: Raw[] = [];
for (const f of readdirSync(src)
  .filter((f) => f.endsWith(".md"))
  .sort()) {
  const { data, content } = matter(readFileSync(join(src, f), "utf8"));
  const text = content.trim();
  if (data.owner_todo) {
    console.warn(`skip ${f}: owner_todo`);
    continue;
  }
  if (/\[\[[a-z]/i.test(text)) {
    console.warn(`skip ${f}: unfilled placeholder`);
    continue;
  }
  for (const k of ["id", "section", "title", "url"])
    if (!data[k]) throw new Error(`${f}: missing ${k}`);
  raws.push({
    id: data.id,
    section: data.section,
    title: data.title,
    url: data.url,
    text,
    keywords: String(data.keywords ?? ""),
  });
}
const dup = raws.map((r) => r.id).find((id, i, a) => a.indexOf(id) !== i);
if (dup) throw new Error(`duplicate chunk id ${dup}`);

const contentHash = createHash("sha256")
  .update(JSON.stringify(raws) + VOYAGE_MODEL)
  .digest("hex")
  .slice(0, 16);
const previous: IndexFile | null = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : null;

async function main() {
  const docs = raws.map((r) => tokenize(`${r.title}\n${r.text}\n${r.keywords}`));
  const { df, avgdl } = bm25Stats(docs);

  let vectors: number[][];
  if (
    !process.env.VOYAGE_API_KEY &&
    !(previous && previous.contentHash === contentHash && previous.dims > 0)
  ) {
    // No key (e.g. first local build): BM25-only index. The hash is left unset so the next keyed build embeds.
    console.warn(
      "VOYAGE_API_KEY not set — writing a BM25-only index (retrieval runs in bm25-only mode)",
    );
    vectors = raws.map(() => []);
  } else if (previous && previous.contentHash === contentHash) {
    console.log(`index up to date (${contentHash}), ${previous.chunks.length} chunks`);
    vectors = previous.chunks.map((c) => c.vector);
  } else {
    console.log(`embedding ${raws.length} chunks with ${VOYAGE_MODEL}…`);
    vectors = (
      await embed(
        raws.map((r) => `${r.title}\n${r.text}`),
        "document",
      )
    ).map(normalize);
  }

  const index: IndexFile = {
    model: VOYAGE_MODEL,
    dims: vectors[0]?.length ?? 0,
    contentHash: vectors[0]?.length ? contentHash : "",
    builtAt: new Date().toISOString(),
    avgdl,
    df,
    chunks: raws.map((r, i) => ({
      id: r.id,
      section: r.section,
      title: r.title,
      url: r.url,
      text: r.text,
      tokens: docs[i],
      vector: vectors[i],
    })),
  };
  writeFileSync(out, JSON.stringify(index));
  console.log(`wrote data/index.json: ${index.chunks.length} chunks, ${index.dims} dims`);
}

main().catch((err) => {
  if (previous) {
    // Keep serving the previous index rather than failing the deploy on a Voyage hiccup.
    console.warn(
      `build-index failed (${(err as Error).message}); keeping previous index ${previous.contentHash}`,
    );
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
