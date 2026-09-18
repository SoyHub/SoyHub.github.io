import { profile } from "@/content/profile";
import { healthJson } from "@/lib/serializers/endpoint-json";
import { KeyValue } from "@/components/ui/KeyValue";
import { LED } from "@/components/ui/LED";

export function HealthBoard() {
  const h = healthJson(profile);
  return (
    <div>
      <h1 className="text-ink text-[15px] font-semibold">Health</h1>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        <li className="border-hair bg-sunk rounded-sm border p-3">
          <LED state="ok" label="backend · java / spring boot" />
        </li>
        <li className="border-hair bg-sunk rounded-sm border p-3">
          <LED state="ok" label="frontend · react / react native" />
        </li>
        <li className="border-hair bg-sunk rounded-sm border p-3">
          <LED state="ok" label="platform · kubernetes / azure devops" />
        </li>
        <li className="border-hair bg-sunk rounded-sm border p-3">
          <LED state="busy" label="ai engineering · in progress" />
        </li>
      </ul>
      <div className="mt-4">
        <KeyValue
          rows={[
            { k: "status", v: h.status },
            { k: "uptime", v: `${h.uptime} (since ${h.since})` },
            { k: "current_role", v: `${h.current_role.title} · ${h.current_role.for}` },
            { k: "learning", v: h.learning.join(", ") },
            { k: "cv_version", v: h.cv_version },
          ]}
        />
      </div>
    </div>
  );
}
