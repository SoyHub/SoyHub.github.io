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
        <h1 className="text-ink text-[15px] font-semibold">Ask</h1>
        <p className="text-muted mt-1 text-[13px]">
          The console is a retrieval-grounded chat over this profile (claude-opus-5, hand-rolled
          BM25 + Voyage embeddings, strict tools rendered as UI blocks). It needs a server, and this
          host serves static files only — so for now this endpoint answers 503.
        </p>
        <pre className="border-hair bg-sunk text-ink mt-4 overflow-x-auto rounded-sm border p-3 font-mono text-[12px]">
          {`{ "error": "console_offline", "try": ["GET /experience", "GET /cv", "mailto:${profile.header.email}"] }`}
        </pre>
      </div>
    </EndpointResponse>
  );
}
