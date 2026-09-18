import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { NowPanel } from "@/components/views/NowPanel";

export const metadata: Metadata = {
  title: "Now",
  description: "What Sohayb Hassan is working on this month.",
  alternates: { canonical: "/now" },
};

export default function Page() {
  return (
    <EndpointResponse href="/now">
      <NowPanel />
    </EndpointResponse>
  );
}
