import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { cvLabels } from "@/lib/cv-labels";
import { SITE_URL } from "@/lib/site";
import { plainTextCv } from "@/lib/serializers/plain-text";

// Default language; /<locale>/cv.txt has the others.
export const dynamic = "force-static";

export function GET() {
  return new Response(
    plainTextCv(profile, SITE_URL, { ansi: true, labels: cvLabels(site.defaultLocale) }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
