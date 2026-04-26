import { useEffect, useState } from "react";
import { StationRequestService } from "../../application/services/StationRequestService";
import AppLayout from "../components/common/AppLayout";

const stationRequestService = new StationRequestService();

type StationRequest = {
  request_id?: string;
  id?: string;
  station_name?: string;
  address?: string;
  status?: string;
  createdAt?: string;
};

export default function MyStationRequestsPage() {
  const [requests, setRequests] = useState<StationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      const data = await stationRequestService.getMyRequests();
      setRequests(data as StationRequest[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRequests();
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-cyan-300">
            Electrify Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            My Station Requests
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Track all your submitted charging station applications in one place.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-slate-400 backdrop-blur-xl">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-slate-400 backdrop-blur-xl">
            No station requests submitted yet.
          </div>
        ) : (
          <div className="grid gap-5">
            {requests.map((request) => {
              const status = request.status || "PENDING";

              return (
                <div
                  key={request.request_id || request.id}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-cyan-400/25 hover:bg-white/[0.07]"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">
                        {request.station_name || "Unnamed Station"}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        {request.address || "No address provided"}
                      </p>

                      <p className="mt-3 text-xs text-slate-500">
                        Submitted:{" "}
                        {request.createdAt
                          ? new Date(request.createdAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>

                    <span className={getStatusClass(status)}>{status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function getStatusClass(status: string) {
  const base =
    "w-fit rounded-full px-4 py-2 text-sm font-semibold border";

  if (status === "APPROVED") {
    return `${base} border-emerald-400/20 bg-emerald-400/10 text-emerald-300`;
  }

  if (status === "REJECTED") {
    return `${base} border-red-400/20 bg-red-400/10 text-red-300`;
  }

  return `${base} border-cyan-400/20 bg-cyan-400/10 text-cyan-300`;
}