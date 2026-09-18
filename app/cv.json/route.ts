import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/site";
import { jsonResume } from "@/lib/serializers/json-resume";

export const dynamic = "force-static";

export function GET() {
  return Response.json(jsonResume(profile, SITE_URL, site.defaultLocale), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
