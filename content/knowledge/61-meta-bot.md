---
id: meta-bot
section: meta
title: How this console works
url: /ask
keywords: how does the bot work chatbot RAG retrieval embeddings BM25 Claude model architecture trace citations tools how are you built
---

This console is a retrieval-augmented chat built by Sohayb. The knowledge base is a set of Markdown chunks written from his CV, embedded at build time with Voyage AI (voyage-4) into a small JSON index — no database. Each question is embedded, matched by cosine similarity and by BM25 keyword search, the two rankings are fused (reciprocal rank fusion) and the top five chunks are handed to Claude (claude-opus-5, streamed) with a system prompt that limits answers to those chunks. The model answers with UI blocks — timeline, skill matrix, project cards, status cards — through tool calls rendered by the page, and cites the chunks it used; the retrieval trace is visible under each answer. Guardrails: per-visitor rate limit, a daily spend cap, input length limits, and an evaluation set for retrieval recall and scope deflection. Off-topic questions get an HTTP-style status card, not an answer.
