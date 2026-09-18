import type { Metadata } from "next";
import { EndpointResponse } from "@/components/explorer/EndpointResponse";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Ask",
  description:
    "A retrieval-grounded console that answers questions about Sohayb Hassan's profile — and deflects everything else.",
  robots: { index: false, follow: true },
};

// The console needs a server (see lib/chat/handler.ts); this deployment is static.
export default function Page() {
  return (
    <EndpointResponse href="/ask" status={503} statusText="Service Unavailable">
      <div>
        <h1 className="text-ink text-[15px] font-semibold">Ask — coming soon</h1>
        <p className="text-muted mt-1 text-[13px]">
          This endpoint will be a chat console that answers questions about the profile, grounded in
          the same content as the other endpoints: Claude with retrieval over the CV, answering in
          scope only and showing which sources it used. The console is built; it is waiting for a
          server to run on, which this static host does not provide.
        </p>
        <p className="text-muted mt-2 text-[13px]">
          Until then, the fastest way to ask something is email — a reply usually comes within a day.
        </p>
        <pre className="border-hair bg-sunk text-ink mt-4 overflow-x-auto rounded-sm border p-3 font-mono text-[12px]">
          {`{ "status": "coming_soon", "meanwhile": ["GET /experience", "GET /cv", "mailto:${profile.header.email}"] }`}
        </pre>
      </div>
    </EndpointResponse>
  );
}
