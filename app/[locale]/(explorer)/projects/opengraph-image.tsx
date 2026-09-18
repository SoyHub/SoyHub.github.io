import { endpointOg, ogSize } from "@/lib/og";

export { generateStaticParams } from "@/i18n/static";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  return endpointOg("/projects", (await params).locale);
}
