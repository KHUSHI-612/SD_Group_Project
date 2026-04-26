import { useState } from "react";
import HomeSidebar from "../components/home/HomeSidebar";
import HomeHeader from "../components/home/HomeHeader";
import ChargeTrendCard from "../components/home/ChargeTrendCard";
import TripPlannerCard from "../components/home/TripPlannerCard";
import TripSummaryCard from "../components/home/TripSummaryCard";
import VehicleOverviewCard from "../components/home/VehicleOverviewCard";
import CommuteChartCard from "../components/home/CommuteChartCard";
import NearbyStationsSection from "../components/home/NearbyStationsSection";
import type { PlannedTrip } from "../components/home/homeTypes";

export default function HomePage() {
  const [plannedTrip, setPlannedTrip] = useState<PlannedTrip | null>(null);

  return (
    <div className="min-h-screen bg-[#050B16] text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,199,255,0.16),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(139,226,138,0.12),_transparent_22%),linear-gradient(180deg,#071120_0%,#050B16_35%,#06101B_100%)]" />

        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:90px_90px]" />

        <div className="relative mx-auto flex min-h-screen max-w-[1700px] gap-5 p-4">
          <HomeSidebar />

          <main className="min-w-0 flex-1">
            <HomeHeader />

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
          </main>
        </div>
      </div>
    </div>
  );
}