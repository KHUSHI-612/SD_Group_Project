import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  StationService,
  type Station,
} from "../../application/services/StationService";
import AppLayout from "../components/common/AppLayout";

import { getCurrentLocation, openGoogleMapsRoute } from "../../utils/location";

const stationService = new StationService();

export default function StationDetailsPage() {
  const { stationId } = useParams<{ stationId: string }>();

  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStation = async () => {
      if (!stationId) {
        setError("Station ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await stationService.getStationById(stationId);
        setStation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch station");
      } finally {
        setLoading(false);
      }
    };

    void fetchStation();
  }, [stationId]);

  return (
    <AppLayout>
      {loading ? (
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-slate-400 backdrop-blur-xl">
          Loading station details...
        </div>
      ) : error || !station ? (
        <div className="rounded-[32px] border border-red-400/20 bg-red-400/10 p-6 text-red-300">
          {error || "Station not found."}
        </div>
      ) : (
        <StationView station={station} stationId={stationId || ""} />
      )}
    </AppLayout>
  );
}

function StationView({
  station,
  stationId,
}: {
  station: Station;
  stationId: string;
}) {
  const stationName = station.name || station.stationName || "Unnamed Station";
  const status = station.status || "UNKNOWN";
  const currentStationId = station.station_id || station.id || stationId;
  
  const handleStartTrip = async () => {
  if (
    typeof station.latitude !== "number" ||
    typeof station.longitude !== "number"
  ) {
    alert("Station coordinates are not available.");
    return;
  }

  try {
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
  }
};

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        to="/stations"
        className="mb-6 inline-flex text-sm text-cyan-300 transition hover:text-cyan-200"
      >
        ← Back to stations
      </Link>

      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-300">
              Electrify Station
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
              {stationName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              {station.address || "No address available"}
            </p>
          </div>

          <span className={getStatusClass(status)}>{status}</span>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <InfoCard label="Station ID" value={currentStationId} />
          <InfoCard label="Latitude" value={station.latitude} />
          <InfoCard label="Longitude" value={station.longitude} />
          <InfoCard label="Price" value={station.price} />
          <InfoCard label="Owner ID" value={station.ownerId} />
          <InfoCard label="Manager ID" value={station.managerId || "N/A"} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold text-white">
              Location Preview
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Google Maps / Leaflet integration can be added here for live route
              planning and charger discovery.
            </p>

            <div className="mt-5 flex h-72 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,199,255,0.14),_transparent_60%),rgba(255,255,255,0.03)] text-sm text-slate-500">
              Interactive Map Placeholder
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold text-white">
              Charging Actions
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Reserve a charging slot or start an instant walk-in session.
            </p>

            <div className="mt-6 space-y-4">
              <Link
                to={`/stations/${currentStationId}/book`}
                className="block w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-5 py-4 text-center font-semibold text-slate-950 transition hover:opacity-90"
              >
                Book Charging Slot
              </Link>

              <button
                type="button"
                onClick={handleStartTrip}
                className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
                >
                Start Trip
                </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Live Availability
              </p>

              <p className="mt-2 text-2xl font-semibold text-emerald-300">
                4 Chargers Free
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Demo placeholder until machine APIs are integrated.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>

      <p className="mt-2 break-words text-lg font-semibold text-white">
        {value ?? "N/A"}
      </p>
    </div>
  );
}

function getStatusClass(status: string) {
  const base = "w-fit rounded-full border px-4 py-2 text-sm font-semibold";

  if (status === "ACTIVE") {
    return `${base} border-emerald-400/20 bg-emerald-400/10 text-emerald-300`;
  }

  if (status === "MAINTENANCE") {
    return `${base} border-yellow-400/20 bg-yellow-400/10 text-yellow-300`;
  }

  if (status === "CLOSED" || status === "INACTIVE") {
    return `${base} border-red-400/20 bg-red-400/10 text-red-300`;
  }

  return `${base} border-cyan-400/20 bg-cyan-400/10 text-cyan-300`;
}