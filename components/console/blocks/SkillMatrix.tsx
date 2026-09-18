import { cx } from "@/lib/cx";

type Group = {
  name: string;
  skills: { name: string; level: "primary" | "working" | "learning" }[];
};

const tone = {
  primary: "border-verdant/50 text-ink",
  working: "border-hair text-body",
  learning: "border-dashed border-brass/60 text-brass",
};

export function ChatSkillMatrix({ groups }: { groups: Group[] }) {
  return (
    <div className="space-y-2">
      {groups.map((g) => (
        <div key={g.name} className="grid grid-cols-1 gap-1 sm:grid-cols-[130px_1fr]">
          <span className="lbl pt-1">{g.name}</span>
          <ul className="flex flex-wrap gap-1.5">
            {g.skills.map((s) => (
              <li
                key={s.name}
                title={s.level}
                className={cx(
                  "bg-sunk rounded-sm border px-1.5 py-0.5 font-mono text-[12px]",
                  tone[s.level] ?? tone.working,
                )}
              >
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="lbl">solid = daily · plain = delivered · dashed = learning</p>
    </div>
  );
}
