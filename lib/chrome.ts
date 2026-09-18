import type { ReactNode } from "react";
import type { Endpoint } from "@/content/profile.types";
import { site } from "@/content/site";
import { chrome as console } from "@/themes/console";
import { chrome as terminal } from "@/themes/terminal";
import { chrome as openapi } from "@/themes/openapi";
import { chrome as git } from "@/themes/git";
import { chrome as status } from "@/themes/status";
import { chrome as rpg } from "@/themes/rpg";

/** What every theme provides. Pages and views never import a theme directly. */
export type Chrome = {
  TopBar: () => Promise<ReactNode> | ReactNode;
  Nav: () => Promise<ReactNode> | ReactNode;
  Request: (p: { endpoint: Endpoint }) => Promise<ReactNode> | ReactNode;
  Frame: (p: {
    href: string;
    status: number;
    statusText: string;
    headers: [string, string][];
    json: unknown;
    children: ReactNode;
  }) => Promise<ReactNode> | ReactNode;
  Hero: () => Promise<ReactNode> | ReactNode;
  Footer: (p: { locale: string }) => Promise<ReactNode> | ReactNode;
  Shell: (p: { nav: ReactNode; children: ReactNode }) => ReactNode;
};

const themes: Record<string, Chrome> = { console, terminal, openapi, git, status, rpg };

export const chrome: Chrome = themes[site.theme] ?? console;
