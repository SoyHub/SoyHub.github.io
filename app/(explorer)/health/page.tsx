import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { endpointMetadata } from "@/lib/seo";
import { HealthBoard } from "@/components/views/HealthBoard";

export const metadata: Metadata = endpointMetadata("/health");

export default function Page() {
  return (
    <EndpointResponse href="/health">
      <HealthBoard />
    </EndpointResponse>
  );
}
