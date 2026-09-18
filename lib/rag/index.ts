import indexJson from "@/data/index.json";
import type { IndexFile } from "./types";

// Bundled at build time; one parse per lambda instance.
export const loadIndex = (): IndexFile => indexJson as IndexFile;
