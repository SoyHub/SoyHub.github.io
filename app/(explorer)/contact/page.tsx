import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { endpointMetadata } from "@/lib/seo";
import { ContactCard } from "@/components/views/ContactCard";

export const metadata: Metadata = endpointMetadata("/contact");

export default function Page() {
  return (
    <EndpointResponse href="/contact">
      <ContactCard />
    </EndpointResponse>
  );
}
