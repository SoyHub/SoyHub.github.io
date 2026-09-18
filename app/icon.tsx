import { renderIcon } from "@/lib/icon";

export const dynamic = "force-static";
export const contentType = "image/png";

const sizes = [16, 32, 48];

export function generateImageMetadata() {
  return sizes.map((s) => ({ id: String(s), size: { width: s, height: s }, contentType }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  return renderIcon(Number(await id));
}
