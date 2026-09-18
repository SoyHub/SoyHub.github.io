import { profile } from "@/content/profile";
import { Timeline } from "@/components/ui/Timeline";

export function ExperienceTimeline() {
  return (
    <div>
      <h1 className="text-ink mb-4 text-[15px] font-semibold">Experience</h1>
      <Timeline roles={profile.experience} />
    </div>
  );
}
