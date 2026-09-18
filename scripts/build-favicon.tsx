// Packs the 16/32/48 icons into app/favicon.ico for browsers and crawlers that only ask for /favicon.ico.
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { renderIcon } from "../lib/icon";

const sizes = [16, 32, 48];

// ICO container with PNG-encoded entries (supported everywhere since Windows Vista).
function ico(pngs: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach(({ size, data }, i) => {
    const o = i * 16;
    dir[o] = size === 256 ? 0 : size;
    dir[o + 1] = size === 256 ? 0 : size;
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...pngs.map((p) => p.data)]);
}

async function main() {
  const pngs = [];
  for (const size of sizes)
    pngs.push({ size, data: Buffer.from(await (await renderIcon(size)).arrayBuffer()) });
  await writeFile(join(import.meta.dirname, "..", "app/favicon.ico"), ico(pngs));
  console.log("wrote app/favicon.ico");
}
void main();
