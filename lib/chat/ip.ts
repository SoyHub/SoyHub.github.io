import { createHash } from "node:crypto";

/** Salted hash of the client IP — enough for rate limiting, never stored in the clear. */
export const clientIp = (req: Request) => {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return createHash("sha256")
    .update(`${ip}${process.env.CHAT_IP_SALT ?? ""}`)
    .digest("hex")
    .slice(0, 32);
};
