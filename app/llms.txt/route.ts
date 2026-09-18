import { profile } from "@/content/profile";
import { endpoints } from "@/content/endpoints";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/site";
import { llmsTxt } from "@/lib/serializers/llms-txt";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(profile, endpoints, SITE_URL, site.defaultLocale), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
