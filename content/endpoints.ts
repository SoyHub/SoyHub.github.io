import { site } from "./site";
import messages from "../messages/en.json";

export type { Endpoint, Method } from "./profile.types";

export const endpoints = site.endpoints;
export const findEndpoint = (href: string) => endpoints.find((e) => e.href === href);

/** Title and one-line description in the default language, for llms.txt and the JSON tab. */
export const endpointText = (href: string) =>
  (messages.endpoints as Record<string, { title: string; description: string }>)[href];
