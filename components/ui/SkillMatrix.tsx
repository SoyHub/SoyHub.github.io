"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { SkillGroup } from "@/content/profile.types";
import { cx } from "@/lib/cx";

function Matrix({ groups, active }: { groups: SkillGroup[]; active: string | null }) {
  const t = useTranslations("ui");
  return (
    <div>
      <nav aria-label={t("filter")} className="mb-4 flex flex-wrap gap-1.5">
        <Link
          href="/skills"
          scroll={false}
          className={cx(
            "lbl rounded-sm border px-2 py-1",
            !active ? "border-brass text-brass" : "border-hair hover:border-brass",
          )}
        >
          {t("all")}
        </Link>
        {groups.map((g) => (
          <Link
            key={g.id}
            href={{ pathname: "/skills", query: { filter: g.id } }}
            scroll={false}
            className={cx(
              "lbl rounded-sm border px-2 py-1",
              active === g.id ? "border-brass text-brass" : "border-hair hover:border-brass",
            )}
          >
            {g.id}
          </Link>
        ))}
      </nav>
      <div className="space-y-3">
        {groups.map((g) => {
          const dim = active && active !== g.id;
          return (
            <div
              key={g.id}
              className={cx(
                "grid grid-cols-1 gap-1 transition-opacity sm:grid-cols-[150px_1fr]",
                dim && "opacity-30",
              )}
            >
              <h2 className="lbl pt-1.5">{g.label}</h2>
              <ul className="flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <li
                    key={s}
                    className={cx(
                      "border-hair bg-sunk text-ink rounded-sm border px-1.5 py-0.5 font-mono text-[12px]",
                      g.id === "learning" && "border-dashed",
                    )}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilteredMatrix({ groups }: { groups: SkillGroup[] }) {
  const filter = useSearchParams().get("filter");
  return <Matrix groups={groups} active={groups.some((g) => g.id === filter) ? filter : null} />;
}

export function SkillMatrix({ groups }: { groups: SkillGroup[] }) {
  return (
    <Suspense fallback={<Matrix groups={groups} active={null} />}>
      <FilteredMatrix groups={groups} />
    </Suspense>
  );
}
