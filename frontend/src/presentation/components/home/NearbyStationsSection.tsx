import { useEffect, useMemo, useState } from "react";
import { ChevronRight, LocateFixed, MapPinned, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  StationService,
  type Station,
} from "../../../application/services/StationService";

import {
  getCurrentLocation,
  openGoogleMapsRoute,
} from "../../../utils/location";

const stationService = new StationService();

type StationWithDistance = Station & {
  distanceKm?: number;
};

type UserLocation = {
  latitude: number;
  longitude: number;
};

function getDistanceKm(
  userLat: number,
  userLng: number,
  stationLat: number,
  stationLng: number
) {
  const earthRadiusKm = 6371;

  const toRadians = (degree: number) => (degree * Math.PI) / 180;

  const latDiff = toRadians(stationLat - userLat);
  const lngDiff = toRadians(stationLng - userLng);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(toRadians(userLat)) *
      Math.cos(toRadians(stationLat)) *
      Math.sin(lngDiff / 2) *
      Math.sin(lngDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function StationCard({ station }: { station: StationWithDistance }) {
  const navigate = useNavigate();
  const [startingTrip, setStartingTrip] = useState(false);

  const stationId = station.station_id || station.id || "";
  const stationName = station.name || station.stationName || "Unnamed Station";
  const status = station.status || "UNKNOWN";

  const handleStartTrip = async () => {
    if (
      typeof station.latitude !== "number" ||
      typeof station.longitude !== "number"
    ) {
      alert("Station coordinates are not available.");
      return;
    }

    try {
      setStartingTrip(true);

      const currentLocation = await getCurrentLocation();

      openGoogleMapsRoute(currentLocation, {
        latitude: station.latitude,
        longitude: station.longitude,
      });
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Unable to start trip. Please allow location access."
      );
    } finally {
      setStartingTrip(false);
    }
  };

  return (
    <div className="rounded-[26px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all hover:border-cyan-400/25 hover:bg-white/[0.07]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex h-24 w-full items-center justify-center rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(139,226,138,0.16),_transparent_60%)] xl:w-32">
          <div className="relative h-16 w-9 rounded-xl border border-white/15 bg-slate-900">
            <div className="absolute left-1/2 top-2 h-2 w-6 -translate-x-1/2 rounded-full bg-emerald-300/80" />
            <div className="absolute inset-x-2 top-6 h-7 rounded-md bg-slate-800" />
            <div className="absolute -right-3 top-7 h-8 w-3 rounded-r-full border border-white/10 bg-slate-900" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-col gap-2 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {stationName}
              </h3>

              <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                <MapPinned className="h-4 w-4 text-cyan-300" />
                {station.address || "No address available"}
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300">
              <Zap className="h-3.5 w-3.5" />
              {status}
            </div>
          </div>

          <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-5">
            <InfoBox label="Status" value={status} />

            <InfoBox
              label="Distance"
              value={
                station.distanceKm !== undefined
                  ? `${station.distanceKm.toFixed(2)} km`
                  : "Location needed"
              }
            />

            <InfoBox
              label="Coordinates"
              value={`${station.latitude ?? "N/A"}, ${
                station.longitude ?? "N/A"
              }`}
            />

            <button
              onClick={handleStartTrip}
              disabled={startingTrip}
              className="h-11 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 font-semibold text-cyan-200 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {startingTrip ? "Starting..." : "Start Trip"}
            </button>

            <button
              onClick={() => navigate(`/stations/${stationId}/book`)}
              disabled={!stationId}
              className="h-11 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-4 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center justify-center">
                <Zap className="mr-2 h-4 w-4" />
                Book now
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}

export default function NearbyStationsSection() {
  const navigate = useNavigate();

  const [stations, setStations] = useState<Station[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loadingStations, setLoadingStations] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [locationMessage, setLocationMessage] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await stationService.getStations();
        setStations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stations");
      } finally {
        setLoadingStations(false);
      }
    };

    void fetchStations();
  }, []);

  const nearbyStations = useMemo(() => {
    const validStations = stations.filter(
      (station) =>
        typeof station.latitude === "number" &&
        typeof station.longitude === "number"
    );

    if (!userLocation) {
      return validStations.slice(0, 3);
    }

    return validStations
      .map((station) => ({
        ...station,
        distanceKm: getDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          station.latitude as number,
          station.longitude as number
        ),
      }))
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
      .slice(0, 3);
  }, [stations, userLocation]);

  const handleFindNearby = () => {
    setError("");
    setLocationMessage("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationMessage("Location detected. Showing nearest stations.");
        setLocating(false);
      },
      () => {
        setError("Location permission denied. Showing available stations instead.");
        setLocating(false);
      }
    );
  };

  return (
    <div className="mt-5 rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Stations Nearby
          </h2>

          <p className="text-sm text-slate-400">
            Find approved charging hubs closest to your current location.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleFindNearby}
            disabled={locating}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LocateFixed className="h-4 w-4" />
            {locating ? "Locating..." : "Find Nearby"}
          </button>

          <button
            onClick={() => navigate("/stations")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-white/10"
          >
            See all
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {locationMessage && (
        <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          {locationMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loadingStations ? (
        <div className="rounded-2xl border border-white/10 bg-black/10 p-5 text-sm text-slate-400">
          Loading stations...
        </div>
      ) : nearbyStations.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/10 p-5 text-sm text-slate-400">
          No approved stations available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {nearbyStations.map((station) => (
            <StationCard
              key={station.station_id || station.id || station.name}
              station={station}
            />
          ))}
        </div>
      )}
    </div>
  );
}