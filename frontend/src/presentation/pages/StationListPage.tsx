import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  StationService,
  type Station,
} from "../../application/services/StationService";
import AppLayout from "../components/common/AppLayout";

const stationService = new StationService();

export default function StationListPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStations = async () => {
    try {
      const data = await stationService.getStations();
      setStations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStations();
  }, []);

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const name = station.name || station.stationName || "";
      const address = station.address || "";
      const status = station.status || "";

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        address.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || status.toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [stations, search, statusFilter]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-300">
              Electrify Network
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
              Charging Stations
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Discover approved EV charging stations near you.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search station or address"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40 md:w-72"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-slate-400 backdrop-blur-xl">
            Loading stations...
          </div>
        ) : filteredStations.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-slate-400 backdrop-blur-xl">
            No stations found.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredStations.map((station) => {
              const stationId = station.station_id || station.id || "";
              const name =
                station.name || station.stationName || "Unnamed Station";
              const status = station.status || "UNKNOWN";

              return (
                <article
                  key={stationId}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-cyan-400/25 hover:bg-white/[0.07]"
                >
                  <div className="mb-5 flex h-36 items-center justify-center rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(139,226,138,0.18),_transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]">
                    <div className="relative h-24 w-12 rounded-xl border border-white/15 bg-slate-950 shadow-[0_0_30px_rgba(34,199,255,0.12)]">
                      <div className="absolute left-1/2 top-2 h-2 w-7 -translate-x-1/2 rounded-full bg-emerald-300/80" />
                      <div className="absolute inset-x-2 top-7 h-10 rounded-md bg-slate-800" />
                      <div className="absolute -right-3 top-9 h-9 w-3 rounded-r-full border border-white/10 bg-slate-950" />
                      <div className="absolute -right-5 top-12 h-9 w-6 rounded-br-[14px] border-b border-r border-white/15" />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {name}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        {station.address || "No address available"}
                      </p>
                    </div>

                    <span className={getStatusClass(status)}>{status}</span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-slate-300">
                    <InfoRow label="Latitude" value={station.latitude} />
                    <InfoRow label="Longitude" value={station.longitude} />
                    <InfoRow label="Price" value={station.price} />
                  </div>

                  <Link
                    to={`/stations/${stationId}`}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
                  >
                    View Details
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-white">{value ?? "N/A"}</p>
    </div>
  );
}

function getStatusClass(status: string) {
  const base = "rounded-full border px-3 py-1 text-xs font-semibold";

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