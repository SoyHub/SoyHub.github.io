import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { EducationList } from "@/components/views/EducationList";

export const metadata: Metadata = {
  title: "Education",
  description:
    "BSc Computer Science in progress at University of the People, Powercoders bootcamp, four languages.",
  alternates: { canonical: "/education" },
};

export default function Page() {
  return (
    <EndpointResponse href="/education">
      <EducationList />
    </EndpointResponse>
  );
}
