import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { CvDownloads } from "@/components/views/CvDownloads";

export const metadata: Metadata = {
  title: "CV",
  description: "Download the CV as PDF, JSON Resume or plain text — or curl /cv.txt.",
  alternates: { canonical: "/cv" },
};

export default function Page() {
  return (
    <EndpointResponse href="/cv">
      <CvDownloads />
    </EndpointResponse>
  );
}
