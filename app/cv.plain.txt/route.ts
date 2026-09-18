import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import { plainTextCv } from "@/lib/serializers/plain-text";

export const dynamic = "force-static";

export function GET() {
  return new Response(plainTextCv(profile, SITE_URL, { ansi: false }), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
