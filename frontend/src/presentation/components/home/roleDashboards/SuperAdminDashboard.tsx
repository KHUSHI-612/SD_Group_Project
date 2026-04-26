import { ShieldCheck, ClipboardList, MapPinned, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-cyan-300">
          SuperAdmin Control
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          Platform Approval Center
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Review station applications and supervise the Electrify network.
          Switch roles to access customer or owner workflows.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminCard
          icon={ClipboardList}
          title="Station Requests"
          description="Approve or reject station owner applications."
          onClick={() => navigate("/admin/station-requests")}
        />

        <AdminCard
          icon={MapPinned}
          title="Network Stations"
          description="View approved charging stations."
          onClick={() => navigate("/stations")}
        />

        <AdminCard
          icon={Users}
          title="Role Control"
          description="Switch active view from the role pill."
          onClick={() => undefined}
        />

        <AdminCard
          icon={ShieldCheck}
          title="SuperAdmin Mode"
          description="Administrative actions only in this view."
          onClick={() => undefined}
        />
      </div>
    </div>
  );
}

function AdminCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-left backdrop-blur-xl transition hover:border-cyan-400/25 hover:bg-white/[0.07]"
    >
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </button>
  );
}