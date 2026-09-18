// Set by the deploy workflow from the Pages URL; locally, canonical links point at the dev server.
const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const SITE_URL = fromEnv.replace(/\/$/, "");
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
export const absolute = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
