// The POST /api/chat handler. Not mounted on the static GitHub Pages build — copy to
// app/api/chat/route.ts on a Node host (Vercel) to switch the console on.
import Anthropic from "@anthropic-ai/sdk";
import { ChatRequestSchema } from "@/lib/chat/validate";
import { checkLimits, recordSpend } from "@/lib/chat/limits";
import { clientIp } from "@/lib/chat/ip";
import { mapError, runChat } from "@/lib/chat/run";
import type { ChatEvent } from "@/lib/chat/events";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const errorJson = (status: number, e: Omit<ChatEvent & { type: "error" }, "type">) =>
  Response.json({ type: "error", ...e }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  if (process.env.CHAT_DISABLED === "1") {
    return errorJson(503, {
      status: 503,
      reason: "DISABLED",
      message: "The console is switched off for now. Email works.",
    });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return errorJson(503, {
      status: 503,
      reason: "DISABLED",
      message: "No model key configured on this deployment.",
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorJson(400, {
      status: 400,
      reason: "INVALID_REQUEST",
      message: "Body must be JSON.",
    });
  }
  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorJson(400, {
      status: 400,
      reason: "INVALID_REQUEST",
      message: parsed.error.issues[0]?.message ?? "Invalid request.",
    });
  }

  const gate = await checkLimits(clientIp(req));
  if (!gate.ok)
    return errorJson(gate.status, {
      status: gate.status,
      reason: gate.reason,
      message: gate.message,
      retryAfter: gate.retryAfter,
    });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (e: ChatEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(e)}\n`));
      try {
        const usage = await runChat(parsed.data, emit, req.signal);
        await recordSpend(usage.usd);
      } catch (err) {
        if (!(err instanceof Anthropic.APIUserAbortError) && !req.signal.aborted)
          emit(mapError(err));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
