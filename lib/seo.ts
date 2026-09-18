import type { Metadata } from "next";
import { findEndpoint } from "@/content/endpoints";

/** Page metadata from the endpoint's content entry: title, description, canonical (or noindex). */
export function endpointMetadata(href: string): Metadata {
  const e = findEndpoint(href);
  if (!e) throw new Error(`unknown endpoint ${href}`);
  return {
    title: e.title,
    description: e.seo?.description,
    ...(e.indexable
      ? { alternates: { canonical: href } }
      : { robots: { index: false, follow: true } }),
  };
}
