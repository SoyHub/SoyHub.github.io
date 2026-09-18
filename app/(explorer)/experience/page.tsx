import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { endpointMetadata } from "@/lib/seo";
import { ExperienceTimeline } from "@/components/views/ExperienceTimeline";

export const metadata: Metadata = endpointMetadata("/experience");

export default function Page() {
  return (
    <EndpointResponse href="/experience">
      <ExperienceTimeline />
    </EndpointResponse>
  );
}
