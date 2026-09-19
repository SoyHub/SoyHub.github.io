import type { Metadata } from "next";
import { site } from "@/content/site";
import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import messages from "@/messages/en.json";

// The language-less URLs only redirect, but they are the ones people paste into chats and posts:
// give them the home page's card so the preview is not blank.
export const shareMetadata = (path = "/"): Metadata => ({
  metadataBase: new URL(SITE_URL),
  title: messages.site.title,
  description: messages.site.description,
  robots: { index: false, follow: true },
  verification: {
    google: site.verification?.google,
    other: site.verification?.bing ? { "msvalidate.01": site.verification.bing } : undefined,
  },
  alternates: { canonical: `/${site.defaultLocale}${path}` },
  openGraph: {
    type: "profile",
    siteName: profile.header.name,
    title: messages.site.title,
    description: messages.site.description,
    images: [{ url: `/${site.defaultLocale}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
});
