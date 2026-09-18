/** "08/2023" → "2023-08"; "present" → undefined */
export const toIso = (mmyyyy: string): string | undefined => {
  const m = /^(\d{2})\/(\d{4})$/.exec(mmyyyy.trim());
  return m ? `${m[2]}-${m[1]}` : undefined;
};

/** "08/2023 – present" → { start: "2023-08", end: undefined } */
export const splitRange = (range: string) => {
  const [a, b = ""] = range.split(/\s[–-]\s/);
  return { start: toIso(a) ?? a, end: toIso(b), present: /present/i.test(b) };
};

export const monthsBetween = (isoStart: string, to = new Date()) => {
  const [y, m] = isoStart.split("-").map(Number);
  return (to.getFullYear() - y) * 12 + (to.getMonth() + 1 - m);
};

export const humanDuration = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y}y`, m && `${m}m`].filter(Boolean).join(" ") || "0m";
};
