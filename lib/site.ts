const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || "https://soyhub.github.io";

export const SITE_URL = fromEnv.replace(/\/$/, "");
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
export const absolute = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
