import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import { jsonResume } from "@/lib/serializers/json-resume";

export const dynamic = "force-static";

export function GET() {
  return Response.json(jsonResume(profile, SITE_URL), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
