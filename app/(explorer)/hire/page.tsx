import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { endpointMetadata } from "@/lib/seo";
import { HireForm } from "@/components/views/HireForm";

export const metadata: Metadata = endpointMetadata("/hire");

export default function Page() {
  return (
    <EndpointResponse href="/hire" status={200} statusText="OK">
      <HireForm />
    </EndpointResponse>
  );
}
