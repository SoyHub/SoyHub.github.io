"use client";

import { useState } from "react";
import { isMemeTemplate } from "@/lib/chat/tools";
import { memeUrl } from "@/lib/chat/memes";

export function MemeCard({
  template,
  top,
  bottom,
}: {
  template: string;
  top: string;
  bottom: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!isMemeTemplate(template)) return null;
  const alt = `${template} meme: ${top} / ${bottom}`;
  return (
    <figure className="border-hair bg-surface inline-block max-w-full rounded-sm border p-2">
      {failed ? (
        <div className="border-hair text-ink min-w-56 rounded-sm border border-dashed p-3 text-center font-mono text-[12px] uppercase">
          <div>{top}</div>
          <div className="lbl my-2">[ {template} ]</div>
          <div>{bottom}</div>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- external, unoptimised on purpose
        <img
          src={memeUrl(template, top, bottom)}
          alt={alt}
          width={600}
          height={600}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-auto max-h-80 w-auto max-w-full rounded-sm"
        />
      )}
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}
