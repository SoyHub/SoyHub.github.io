export function CitationChips({ ids }: { ids: string[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label="Sources">
      <li className="lbl">cite</li>
      {ids.map((id) => (
        <li
          key={id}
          className="border-hair bg-surface text-muted rounded-sm border px-1.5 py-0.5 font-mono text-[11px]"
        >
          {id}
        </li>
      ))}
    </ul>
  );
}
