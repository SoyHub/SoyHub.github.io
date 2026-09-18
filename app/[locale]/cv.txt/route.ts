import { getProfile } from "@/content";
import { cvLabels } from "@/lib/cv-labels";
import { SITE_URL } from "@/lib/site";
import { plainTextCv } from "@/lib/serializers/plain-text";

export { generateStaticParams } from "@/i18n/static";
export const dynamic = "force-static";

export async function GET(_: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return new Response(
    plainTextCv(getProfile(locale), SITE_URL, { ansi: true, labels: cvLabels(locale) }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
