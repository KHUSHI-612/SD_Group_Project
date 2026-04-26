import { Plus, LayoutDashboard, MapPinned, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <div className="mb-8">
        <p className="text-sm font-medium text-cyan-300">Owner Workspace</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          Manage Your Station Network
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Apply for stations, track approvals, and monitor station visibility.
          Switch to Customer mode to book charging slots.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <OwnerActionCard
          icon={Plus}
          title="Apply Station"
          description="Submit a new station for SuperAdmin approval."
          onClick={() => navigate("/apply-station")}
        />

        <OwnerActionCard
          icon={LayoutDashboard}
          title="My Requests"
          description="Track your submitted station applications."
          onClick={() => navigate("/my-station-requests")}
        />

        <OwnerActionCard
          icon={MapPinned}
          title="View Stations"
          description="View approved public charging stations."
          onClick={() => navigate("/stations")}
        />

        <OwnerActionCard
          icon={Zap}
          title="Customer Mode"
          description="Switch role to Customer to book charging slots."
          onClick={() => undefined}
        />
      </div>
    </div>
  );
}

function OwnerActionCard({
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