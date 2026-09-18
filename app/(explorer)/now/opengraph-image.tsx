import { endpointOg, ogSize } from "@/lib/og";

const og = endpointOg("/now");
export const alt = og.alt;
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return og.render();
}
