import { useEffect, useState } from "react";
import { StationRequestService } from "../../application/services/StationRequestService";
import AppLayout from "../components/common/AppLayout";

const stationRequestService = new StationRequestService();

type StationRequest = {
  request_id?: string;
  id?: string;
  station_name?: string;
  address?: string;
  helpline_number?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  createdAt?: string;
};

export default function SuperAdminRequestsPage() {
  const [requests, setRequests] = useState<StationRequest[]>([]);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await stationRequestService.getRequestsByStatus(status);
      setRequests(data as StationRequest[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRequests();
  }, [status]);

  const handleApprove = async (requestId: string) => {
    setActionLoadingId(requestId);
    setError("");

    try {
      await stationRequestService.approveRequest(requestId);
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActionLoadingId(requestId);
    setError("");

    try {
      await stationRequestService.rejectRequest(requestId);
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rejection failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-300">
              Electrify SuperAdmin
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
              Station Approval Requests
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Review, approve, or reject new charging station applications.
            </p>
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
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
            No {status.toLowerCase()} station requests found.
          </div>
        ) : (
          <div className="grid gap-5">
            {requests.map((request) => {
              const requestId = request.request_id || request.id || "";
              const currentStatus = request.status || "PENDING";

              return (
                <div
                  key={requestId}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-cyan-400/25 hover:bg-white/[0.07]"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold text-white">
                          {request.station_name || "Unnamed Station"}
                        </h2>

                        <span className={getStatusClass(currentStatus)}>
                          {currentStatus}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-slate-400">
                        {request.address || "No address provided"}
                      </p>

                      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <InfoBox
                          label="Helpline"
                          value={request.helpline_number || "N/A"}
                        />
                        <InfoBox
                          label="Latitude"
                          value={request.latitude ?? "N/A"}
                        />
                        <InfoBox
                          label="Longitude"
                          value={request.longitude ?? "N/A"}
                        />
                        <InfoBox
                          label="Submitted"
                          value={
                            request.createdAt
                              ? new Date(
                                  request.createdAt,
                                ).toLocaleDateString()
                              : "N/A"
                          }
                        />
                      </div>
                    </div>

                    {status === "PENDING" && (
                      <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                        <button
                          onClick={() => handleApprove(requestId)}
                          disabled={actionLoadingId === requestId}
                          className="rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoadingId === requestId
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          onClick={() => handleReject(requestId)}
                          disabled={actionLoadingId === requestId}
                          className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    )}
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

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>

      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function getStatusClass(status: string) {
  const base = "rounded-full border px-3 py-1 text-xs font-semibold";

  if (status === "APPROVED") {
    return `${base} border-emerald-400/20 bg-emerald-400/10 text-emerald-300`;
  }

  if (status === "REJECTED") {
    return `${base} border-red-400/20 bg-red-400/10 text-red-300`;
  }

  return `${base} border-cyan-400/20 bg-cyan-400/10 text-cyan-300`;
}