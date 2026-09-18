import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { ProjectCards } from "@/components/views/ProjectCards";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "LLM-assisted legacy modernisation with differential-execution verification, and engineering-workflow automation for a banking programme.",
  alternates: { canonical: "/projects" },
};

export default function Page() {
  return (
    <EndpointResponse href="/projects">
      <ProjectCards />
    </EndpointResponse>
  );
}
