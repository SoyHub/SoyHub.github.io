import { profile } from "@/content/profile";
import { SkillMatrix } from "@/components/ui/SkillMatrix";

export function SkillMatrixView() {
  return (
    <div>
      <h1 className="text-ink mb-3 text-[15px] font-semibold">Skills</h1>
      <SkillMatrix groups={profile.skills} />
    </div>
  );
}
