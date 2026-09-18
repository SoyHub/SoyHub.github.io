// Copies the photo and the PUBLIC CV build from ../cv into this repo. Run after `PUBLIC=1 node build-cv.mjs`.
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const cv = join(root, "..", "cv");
copyFileSync(join(cv, "photo.png"), join(root, "public/photo.png"));
const pdf = join(cv, "Sohayb-Hassan-CV-PUBLIC.pdf");
if (existsSync(pdf)) copyFileSync(pdf, join(root, "public/cv.pdf"));
else console.warn("no PUBLIC pdf at", pdf, "— run PUBLIC=1 node build-cv.mjs in ../cv/build first");
console.log("assets synced");
