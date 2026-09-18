/** A stable hex "commit hash" for an endpoint, so refs look real and never change between builds. */
export const sha = (s: string, len = 7) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  let out = "";
  while (out.length < len) {
    h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0;
    out += h.toString(16).padStart(8, "0");
  }
  return out.slice(0, len);
};

export const ref = (href: string) => (href === "/" ? "HEAD" : href.slice(1));
