import { site } from "./site";

export type { Endpoint, Method } from "./profile.types";

export const endpoints = site.endpoints;
export const findEndpoint = (href: string) => endpoints.find((e) => e.href === href);
