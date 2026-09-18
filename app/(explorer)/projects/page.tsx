import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { endpointMetadata } from "@/lib/seo";
import { ProjectCards } from "@/components/views/ProjectCards";

export const metadata: Metadata = endpointMetadata("/projects");

export default function Page() {
  return (
    <EndpointResponse href="/projects">
      <ProjectCards />
    </EndpointResponse>
  );
}
