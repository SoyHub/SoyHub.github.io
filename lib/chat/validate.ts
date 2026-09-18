import { z } from "zod";

const text = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((s) => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(s), "control characters");

export const ChatRequestSchema = z
  .object({
    messages: z.array(z.object({ role: z.enum(["user", "assistant"]), text: text(1500) })).max(24),
    question: text(500),
  })
  .refine(
    (r) => r.messages.every((m, i) => m.role === (i % 2 === 0 ? "user" : "assistant")),
    "roles must alternate starting with user",
  )
  .refine((r) => r.messages.length % 2 === 0, "history must end with an assistant turn");

export type ValidChatRequest = z.infer<typeof ChatRequestSchema>;
