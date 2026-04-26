import { useState } from "react";
import ChargeTrendCard from "../ChargeTrendCard";
import TripPlannerCard from "../TripPlannerCard";
import TripSummaryCard from "../TripSummaryCard";
import VehicleOverviewCard from "../VehicleOverviewCard";
import CommuteChartCard from "../CommuteChartCard";
import NearbyStationsSection from "../NearbyStationsSection";
import type { PlannedTrip } from "../homeTypes";

export default function CustomerDashboard() {
  const [plannedTrip, setPlannedTrip] = useState<PlannedTrip | null>(null);

  return (
    <>
      <div className="grid gap-5 2xl:grid-cols-[1.2fr_0.8fr_0.9fr]">
        <ChargeTrendCard />

        <div className="space-y-5">
          <TripPlannerCard onTripPlanned={setPlannedTrip} />
          <TripSummaryCard plannedTrip={plannedTrip} />
        </div>

        <div className="space-y-5">
          <VehicleOverviewCard />
          <CommuteChartCard />
        </div>
      </div>

      <NearbyStationsSection />
    </>
  );
}