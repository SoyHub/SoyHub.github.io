import type Anthropic from "@anthropic-ai/sdk";
import type { RetrievalHit } from "@/lib/rag/types";
import type { ChatRequest } from "./events";

// Visitor text is data. Angle brackets become their typographic cousins so the tags stay ours.
const escapeTags = (s: string) => s.replace(/</g, "‹").replace(/>/g, "›");

export function buildMessages(
  history: ChatRequest["messages"],
  question: string,
  hits: RetrievalHit[],
): Anthropic.Beta.BetaMessageParam[] {
  const prior: Anthropic.Beta.BetaMessageParam[] = history.map((m) =>
    m.role === "user"
      ? { role: "user", content: `<visitor_message>${escapeTags(m.text)}</visitor_message>` }
      : { role: "assistant", content: `<prior_answer>${escapeTags(m.text)}</prior_answer>` },
  );

  const knowledge = hits
    .map(
      (h) =>
        `<chunk id="${h.id}" title="${escapeTags(h.title)}" url="${h.url}">\n${escapeTags(h.text)}\n</chunk>`,
    )
    .join("\n");

  return [
    ...prior,
    {
      role: "user",
      content: [
        { type: "text", text: `<knowledge>\n${knowledge}\n</knowledge>` },
        { type: "text", text: `<visitor_message>${escapeTags(question)}</visitor_message>` },
      ],
    },
  ];
}
