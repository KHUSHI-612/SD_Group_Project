import { useEffect, useMemo, useState } from "react";
import { Home, LocateFixed, Map, Plus } from "lucide-react";
import {
  StationService,
  type Station,
} from "../../../application/services/StationService";
import {
  getCurrentLocation,
  getDistanceKm,
  openGoogleMapsRoute,
  type Coordinates,
} from "../../../utils/location";
import type { PlannedTrip } from "./homeTypes";

const stationService = new StationService();

type StationWithDistance = Station & {
  distanceKm: number;
};

type TripPlannerCardProps = {
  onTripPlanned: (trip: PlannedTrip) => void;
};

export default function TripPlannerCard({
  onTripPlanned,
}: TripPlannerCardProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [selectedStation, setSelectedStation] =
    useState<StationWithDistance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await stationService.getStations();
        setStations(data);
      } catch {
        setError("Unable to load stations.");
      }
    };

    void fetchStations();
  }, []);

  const validStations = useMemo(() => {
    return stations.filter(
      (station) =>
        typeof station.latitude === "number" &&
        typeof station.longitude === "number",
    );
  }, [stations]);

  const handleGetDirection = async () => {
    setLoading(true);
    setError("");

    try {
      const currentLocation = await getCurrentLocation();
      setUserLocation(currentLocation);

      if (validStations.length === 0) {
        setError("No station with valid coordinates found.");
        return;
      }

      const nearestStation = validStations
        .map((station) => ({
          ...station,
          distanceKm: getDistanceKm(currentLocation, {
            latitude: station.latitude as number,
            longitude: station.longitude as number,
          }),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)[0];

      const stationName =
        nearestStation.name || nearestStation.stationName || "Nearest Station";

      setSelectedStation(nearestStation);

      onTripPlanned({
        stationName,
        distanceKm: nearestStation.distanceKm,
        estimatedDurationMinutes: Math.max(
          1,
          Math.round((nearestStation.distanceKm / 35) * 60),
        ),
      });

      openGoogleMapsRoute(currentLocation, {
        latitude: nearestStation.latitude as number,
        longitude: nearestStation.longitude as number,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to get current location.",
      );
    } finally {
      setLoading(false);
    }
  };

  const destinationName =
    selectedStation?.name || selectedStation?.stationName || "Nearest Station";

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <div className="p-5">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Plan a Trip</h2>
            <p className="text-sm text-slate-400">
              Open a route from your current location to the nearest station.
            </p>
          </div>

          <button className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
            <p className="mb-2 text-xs text-slate-500">From</p>

            <div className="flex items-center gap-2 text-sm text-white">
              <Home className="h-4 w-4 text-cyan-300" />
              {userLocation ? "Current Location" : "Detect on click"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
            <p className="mb-2 text-xs text-slate-500">To</p>

            <div className="flex items-center gap-2 text-sm text-white">
              <LocateFixed className="h-4 w-4 text-cyan-300" />
              {selectedStation ? destinationName : "Nearest Station"}
            </div>
          </div>
        </div>

        {selectedStation && (
          <div className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
            Nearest station: {destinationName} ·{" "}
            {selectedStation.distanceKm.toFixed(2)} km away
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          onClick={handleGetDirection}
          disabled={loading}
          className="mt-4 h-11 w-full rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex items-center justify-center">
            <Map className="mr-2 h-4 w-4" />
            {loading ? "Finding Route..." : "Get Direction"}
          </span>
        </button>
      </div>
    </div>
  );
}