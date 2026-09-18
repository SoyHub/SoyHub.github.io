import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { ExperienceTimeline } from "@/components/views/ExperienceTimeline";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Four roles from 2020 to today: mobile banking microservices and BFF, a digital HR platform, media and oil & gas clients, and a COBOL to Spring Boot migration.",
  alternates: { canonical: "/experience" },
};

export default function Page() {
  return (
    <EndpointResponse href="/experience">
      <ExperienceTimeline />
    </EndpointResponse>
  );
}
