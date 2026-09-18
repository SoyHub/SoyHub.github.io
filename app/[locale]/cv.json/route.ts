import { getProfile } from "@/content";
import { SITE_URL } from "@/lib/site";
import { jsonResume } from "@/lib/serializers/json-resume";

export { generateStaticParams } from "@/i18n/static";
export const dynamic = "force-static";

export async function GET(_: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return Response.json(jsonResume(getProfile(locale), SITE_URL, locale), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
