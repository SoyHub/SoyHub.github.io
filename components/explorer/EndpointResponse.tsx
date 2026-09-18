import type { ReactNode } from "react";
import { profile } from "@/content/profile";
import { findEndpoint } from "@/content/endpoints";
import { SITE_URL } from "@/lib/site";
import { endpointJson } from "@/lib/serializers/endpoint-json";
import { RequestBar } from "./RequestBar";
import { ResponseFrame } from "./ResponseFrame";

export function EndpointResponse({
  href,
  status = 200,
  statusText = "OK",
  children,
}: {
  href: string;
  status?: number;
  statusText?: string;
  children: ReactNode;
}) {
  const endpoint = findEndpoint(href);
  if (!endpoint) throw new Error(`unknown endpoint ${href}`);
  return (
    <>
      <RequestBar endpoint={endpoint} />
      <ResponseFrame
        status={status}
        statusText={statusText}
        headers={[
          ["content-type", "text/html; charset=utf-8"],
          ["x-source", "content/profile.json"],
          ["x-cv-version", profile.meta.cvVersion],
        ]}
        json={endpointJson(href, profile, SITE_URL)}
      >
        {children}
      </ResponseFrame>
    </>
  );
}
