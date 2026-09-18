import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { SkillMatrixView } from "@/components/views/SkillMatrixView";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Java 17/21, Spring Boot 3, React and React Native, Kubernetes, Azure DevOps, PostgreSQL and more — six groups, filterable.",
  alternates: { canonical: "/skills" },
};

export default function Page() {
  return (
    <EndpointResponse href="/skills">
      <SkillMatrixView />
    </EndpointResponse>
  );
}
