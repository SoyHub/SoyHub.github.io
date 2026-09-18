export function Kbd({ children }: { children: string }) {
  return (
    <kbd className="border-hair bg-sunk text-muted inline-block min-w-5 rounded-sm border px-1 text-center font-mono text-[10px]">
      {children}
    </kbd>
  );
}
