"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useChatStream } from "./useChatStream";
import { Transcript } from "./Transcript";
import { LED } from "@/components/ui/LED";
import { cx } from "@/lib/cx";
import { useTranslations } from "next-intl";

export function Console() {
  const { messages, busy, send, stop, reset } = useChatStream();
  const suggestions = useTranslations("site").raw("consoleSuggestions") as string[];
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (busy) {
      stop();
      return;
    }
    const q = value;
    setValue("");
    void send(q);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-ink text-[15px] font-semibold">Ask</h1>
        <div className="flex items-center gap-3">
          <LED state={busy ? "busy" : "ok"} label={busy ? "streaming" : "idle"} />
          <span className="lbl hidden sm:inline">claude-opus-5 · rag · 5 chunks</span>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="lbl border-hair hover:border-brass hover:text-ink rounded-sm border px-2 py-1"
            >
              clear
            </button>
          )}
        </div>
      </div>
      <p className="text-muted mt-1 text-[13px]">
        Retrieval-grounded, in scope only. Answers come as blocks; the trace under each one shows
        which chunks were used.
      </p>

      {messages.length === 0 ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => {
                  inputRef.current?.focus();
                  void send(s);
                }}
                className="border-hair bg-sunk text-ink hover:border-brass rounded-sm border px-2 py-1 font-mono text-[12px]"
                dir="auto"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 max-h-[60vh] overflow-y-auto pe-1">
          <Transcript messages={messages} busy={busy} />
          <div ref={endRef} />
        </div>
      )}

      <form onSubmit={submit} className="mt-4 flex items-stretch gap-2">
        <label className="border-hair bg-sunk focus-within:border-brass flex min-w-0 flex-1 items-center gap-2 rounded-sm border px-3">
          <span className="text-brass font-mono text-[12px]" aria-hidden>
            ›
          </span>
          <span className="sr-only">Question</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={500}
            placeholder="ask about the profile…"
            autoComplete="off"
            dir="auto"
            className="text-ink placeholder:text-muted min-w-0 flex-1 bg-transparent py-2.5 font-mono text-[13px] outline-none"
          />
          <span className="text-muted font-mono text-[10px]">{value.length}/500</span>
        </label>
        <button
          type="submit"
          className={cx(
            "rounded-sm border px-3 font-mono text-[12px] font-medium tracking-wider",
            busy
              ? "border-signal bg-signal-soft text-signal"
              : "border-brass bg-brass-soft text-brass hover:bg-brass hover:text-paper",
          )}
        >
          {busy ? "Stop ■" : "Send ▶"}
        </button>
      </form>
    </div>
  );
}
