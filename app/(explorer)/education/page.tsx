import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { endpointMetadata } from "@/lib/seo";
import { EducationList } from "@/components/views/EducationList";

export const metadata: Metadata = endpointMetadata("/education");

export default function Page() {
  return (
    <EndpointResponse href="/education">
      <EducationList />
    </EndpointResponse>
  );
}
