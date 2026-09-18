import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Panel({
  label,
  actions,
  children,
  className,
  as: Tag = "section",
}: {
  label?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "aside";
}) {
  return (
    <Tag className={cx("border-hair bg-surface shadow-panel rounded-sm border", className)}>
      {(label || actions) && (
        <div className="border-hair flex items-center justify-between gap-3 border-b px-3 py-1.5">
          <div className="lbl">{label}</div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      )}
      <div className="p-3 sm:p-4">{children}</div>
    </Tag>
  );
}
