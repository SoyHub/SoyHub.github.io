import type { Metadata } from "next";
import { LocaleRedirect } from "@/components/LocaleRedirect";
import { shareMetadata } from "@/lib/share";

export const metadata: Metadata = shareMetadata();

export default function Root() {
  return <LocaleRedirect />;
}
