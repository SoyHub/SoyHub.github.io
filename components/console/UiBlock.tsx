"use client";

import type { UiTool } from "@/lib/chat/events";
import { ChatTimeline } from "./blocks/Timeline";
import { ChatSkillMatrix } from "./blocks/SkillMatrix";
import { ProjectCard } from "./blocks/ProjectCard";
import { ContactCard } from "./blocks/ContactCard";
import { StatusCard } from "./blocks/StatusCard";
import { MemeCard } from "./blocks/MemeCard";
import { CitationChips } from "./blocks/CitationChips";

/* eslint-disable @typescript-eslint/no-explicit-any -- tool inputs are validated server-side against strict schemas */
export function UiBlock({ tool, input }: { tool: UiTool; input: unknown }) {
  const i = input as any;
  switch (tool) {
    case "show_timeline":
      return <ChatTimeline entries={i.entries} />;
    case "show_skill_matrix":
      return <ChatSkillMatrix groups={i.groups} />;
    case "show_project":
      return <ProjectCard {...i} />;
    case "show_contact":
      return <ContactCard reason={i.reason} note={i.note} />;
    case "show_status":
      return <StatusCard code={i.code} reason={i.reason} message={i.message} hint={i.hint} />;
    case "show_meme":
      return <MemeCard template={i.template} top={i.top} bottom={i.bottom} />;
    case "cite":
      return <CitationChips ids={i.chunk_ids} />;
    default:
      return null;
  }
}
