import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { HealthBoard } from "@/components/views/HealthBoard";

export const metadata: Metadata = {
  title: "Health",
  description: "Status board: uptime since 2020, current role, what is being learned now.",
  alternates: { canonical: "/health" },
};

export default function Page() {
  return (
    <EndpointResponse href="/health">
      <HealthBoard />
    </EndpointResponse>
  );
}
