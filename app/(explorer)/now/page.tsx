import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { endpointMetadata } from "@/lib/seo";
import { NowPanel } from "@/components/views/NowPanel";

export const metadata: Metadata = endpointMetadata("/now");

export default function Page() {
  return (
    <EndpointResponse href="/now">
      <NowPanel />
    </EndpointResponse>
  );
}
