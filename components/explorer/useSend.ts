"use client";

import { useRouter } from "@/i18n/navigation";
import { endpoints } from "@/content/endpoints";
import { useExplorer } from "./ExplorerProvider";

/** Navigate to a typed path ("/skills?filter=backend", "experience"…), marking the send for the latency chip. */
export function useSend() {
  const router = useRouter();
  const { markSend } = useExplorer();
  return (raw: string) => {
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    const [pathname, query] = path.split("?");
    const known = endpoints.find((ep) => ep.href === pathname);
    markSend();
    router.push(((known ? known.href : pathname) + (query ? `?${query}` : "")) as never);
  };
}
