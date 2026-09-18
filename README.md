# sohayb — profile as an API

A portfolio built as an API explorer: every section is an endpoint (`GET /experience`,
`GET /skills?filter=backend`, `POST /hire`…) rendered as real server-side HTML with a JSON tab,
plus `POST /ask` — a retrieval-grounded console that answers only about the profile.

```
curl https://soyhub.github.io/cv.txt      # 80-column ANSI CV
curl https://soyhub.github.io/cv.json     # JSON Resume
curl https://soyhub.github.io/llms.txt    # for crawlers that read
```

## Stack

Next.js 16 (App Router, RSC, TypeScript) · Tailwind 4 · `@anthropic-ai/sdk` (claude-opus-5, streaming,
strict tools for generative UI) · Voyage AI `voyage-4` embeddings + hand-rolled BM25, fused with RRF ·
Upstash Redis for rate limits and the daily spend cap.

## Deploy

Static export (`output: "export"`) published to GitHub Pages by `.github/workflows/deploy.yml` on
every push to `main`. The host serves files only, so `POST /ask` answers 503 there; the handler
lives in `lib/chat/handler.ts` and is mounted as `app/api/chat/route.ts` on a Node host.

## Run

```
pnpm install
cp .env.example .env.local        # fill ANTHROPIC_API_KEY, VOYAGE_API_KEY (optional), KV_* (optional)
pnpm build-index                  # content/knowledge/*.md → data/index.json (BM25-only without a Voyage key)
pnpm dev
```

`pnpm lint && pnpm typecheck && pnpm test && pnpm build` before shipping. `pnpm evals` runs
retrieval recall@5 (offline) and the scope test (needs the model key, ~40 calls).

## Content

Every fact renders from `content/profile.ts`; the chat corpus is `content/knowledge/*.md`.
Sync rules and the publishing checklist: `content/README.md`. The public PDF for `/cv.pdf` is built
with `PUBLIC=1 node build-cv.mjs` in the CV repo and copied by `pnpm sync:assets`.

## Chat guardrails

Scope is enforced by the system prompt and measured by `evals/scope.jsonl`; independent of the
model, tool inputs and answers are scanned for phone numbers and a denylist of confidential names
(`CHAT_DENYLIST`). Per-IP sliding window (10 / 10 min), daily message and USD caps, 500-character
questions, 12 turns per conversation, `CHAT_DISABLED=1` as a kill switch.
