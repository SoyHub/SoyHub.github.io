/** memegen.link templates the model may pick from, with the mood each one carries. */
export const MEME_TEMPLATES = {
  ackbar: "it's a trap — a jailbreak or a leading question",
  buzz: "X, X everywhere — something abundant (COBOL, repositories)",
  doge: "wow, such X — mild amazement",
  drake: "reject / prefer — a comparison",
  fine: "this is fine — calm in a mess (bad merges)",
  fry: "not sure if X or Y — suspicion",
  harold: "hide the pain — polite discomfort (salary questions)",
  kermit: "but that's none of my business — declining gracefully",
  morpheus: "what if I told you — a reveal",
  philosoraptor: "a pondering question",
  "stop-it": "stop it, get some help — gentle refusal",
  success: "success kid — a win",
} as const;

export type MemeTemplate = keyof typeof MEME_TEMPLATES;

// memegen escaping rules, applied server-side so the model only ever sends plain text.
const escape = (s: string) =>
  s
    .replace(/_/g, "__")
    .replace(/-/g, "--")
    .replace(/ /g, "_")
    .replace(/\?/g, "~q")
    .replace(/%/g, "~p")
    .replace(/#/g, "~h")
    .replace(/\//g, "~s")
    .replace(/\\/g, "~b")
    .replace(/&/g, "~a")
    .replace(/</g, "~l")
    .replace(/>/g, "~g")
    .replace(/\n/g, "~n")
    .replace(/"/g, "''");

export const memeUrl = (template: MemeTemplate, top: string, bottom: string) =>
  `https://api.memegen.link/images/${template}/${escape(top) || "_"}/${escape(bottom) || "_"}.png?width=600`;
