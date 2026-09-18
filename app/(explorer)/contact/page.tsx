import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { ContactCard } from "@/components/views/ContactCard";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, LinkedIn and GitHub for Sohayb Hassan.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <EndpointResponse href="/contact">
      <ContactCard />
    </EndpointResponse>
  );
}
