import { getLocale, getTranslations } from "next-intl/server";
import { getProfile } from "@/content";
import { healthJson } from "@/lib/serializers/endpoint-json";
import { KeyValue } from "@/components/ui/KeyValue";
import { LED } from "@/components/ui/LED";

export async function HealthBoard() {
  const locale = await getLocale();
  const t = await getTranslations();
  const h = healthJson(getProfile(locale));
  const leds = t.raw("ui.health.leds") as string[];
  return (
    <div>
      <h1 className="text-ink text-[15px] font-semibold">{t("endpoints./health.title")}</h1>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {leds.map((label, i) => (
          <li key={label} className="border-hair bg-sunk rounded-sm border p-3">
            <LED state={i === leds.length - 1 ? "busy" : "ok"} label={label} />
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <KeyValue
          rows={[
            { k: t("ui.health.status"), v: h.status },
            { k: t("ui.health.uptime"), v: `${h.uptime} (${t("ui.health.since")} ${h.since})` },
            { k: t("ui.health.currentRole"), v: `${h.current_role.title} · ${h.current_role.for}` },
            { k: t("ui.health.learning"), v: h.learning.join(", ") },
            { k: t("ui.health.cvVersion"), v: h.cv_version },
          ]}
        />
      </div>
    </div>
  );
}
