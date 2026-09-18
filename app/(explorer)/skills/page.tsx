import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { endpointMetadata } from "@/lib/seo";
import { SkillMatrixView } from "@/components/views/SkillMatrixView";

export const metadata: Metadata = endpointMetadata("/skills");

export default function Page() {
  return (
    <EndpointResponse href="/skills">
      <SkillMatrixView />
    </EndpointResponse>
  );
}
