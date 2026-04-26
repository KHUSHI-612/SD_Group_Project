import { CalendarClock, MapPinned, Route, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManagerDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-cyan-300">Manager Workspace</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          Station Operations
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Manage station operations once machine and booking APIs are available.
          For now, booking visibility remains available.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ManagerCard
          icon={CalendarClock}
          title="Bookings"
          description="View booking flow and upcoming sessions."
          onClick={() => navigate("/my-bookings")}
        />

        <ManagerCard
          icon={MapPinned}
          title="Stations"
          description="View public station network."
          onClick={() => navigate("/stations")}
        />

        <ManagerCard
          icon={Zap}
          title="Charger Status"
          description="Coming after machine APIs."
          onClick={() => undefined}
        />

        <ManagerCard
          icon={Route}
          title="Queue Control"
          description="Coming after booking APIs."
          onClick={() => undefined}
        />
      </div>
    </div>
  );
}

function ManagerCard({
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