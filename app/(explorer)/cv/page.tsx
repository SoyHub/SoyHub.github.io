import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { endpointMetadata } from "@/lib/seo";
import { CvDownloads } from "@/components/views/CvDownloads";

export const metadata: Metadata = endpointMetadata("/cv");

export default function Page() {
  return (
    <EndpointResponse href="/cv">
      <CvDownloads />
    </EndpointResponse>
  );
}
