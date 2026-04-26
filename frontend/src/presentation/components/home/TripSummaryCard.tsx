import { Clock3, LocateFixed, Route, Wallet, Zap } from "lucide-react";
import MetricPill from "./MetricPill";
import type { PlannedTrip } from "./homeTypes";

type TripSummaryCardProps = {
  plannedTrip: PlannedTrip | null;
};

export default function TripSummaryCard({
  plannedTrip,
}: TripSummaryCardProps) {
  const distance = plannedTrip
    ? `${plannedTrip.distanceKm.toFixed(2)} km`
    : "Not set";

  const duration = plannedTrip
    ? `${plannedTrip.estimatedDurationMinutes} min`
    : "Not set";

  const station = plannedTrip ? plannedTrip.stationName : "Find route first";

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <div className="p-5">
        <h3 className="mb-4 text-xl font-semibold text-white">
          Trip Summary
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <MetricPill icon={Route} label="Distance" value={distance} />
          <MetricPill icon={Clock3} label="Duration" value={duration} />
          <MetricPill icon={Wallet} label="Est. Cost" value="₹120/hr" />
          <MetricPill icon={Zap} label="Charge Stops" value={plannedTrip ? "1" : "0"} />
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
          <p className="text-xs text-slate-500">Selected Station</p>

          <div className="mt-2 flex items-center gap-2 text-sm font-medium text-white">
            <LocateFixed className="h-4 w-4 text-cyan-300" />
            {station}
          </div>
        </div>
      </div>
    </div>
  );
}