import type { ReactNode } from "react";
import { getLocale } from "next-intl/server";
import { getNow, getProfile } from "@/content";
import { findEndpoint } from "@/content/endpoints";
import { SITE_URL } from "@/lib/site";
import { endpointJson } from "@/lib/serializers/endpoint-json";
import { chrome } from "@/lib/chrome";

export async function EndpointResponse({
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
  const locale = await getLocale();
  const profile = getProfile(locale);
  return (
    <>
      <chrome.Request endpoint={endpoint} />
      <chrome.Frame
        href={href}
        status={status}
        statusText={statusText}
        headers={[
          ["content-type", "text/html; charset=utf-8"],
          ["x-source", `content/${locale}/profile.json`],
          ["x-cv-version", profile.meta.cvVersion],
        ]}
        json={endpointJson(href, profile, SITE_URL, getNow(locale))}
      >
        {children}
      </chrome.Frame>
    </>
  );
}
