import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { HireForm } from "@/components/views/HireForm";

export const metadata: Metadata = { title: "Hire", robots: { index: false, follow: true } };

export default function Page() {
  return (
    <EndpointResponse href="/hire" status={200} statusText="OK">
      <HireForm />
    </EndpointResponse>
  );
}
