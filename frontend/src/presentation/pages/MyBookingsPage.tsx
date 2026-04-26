import { CalendarClock, MapPinned, Route, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/common/AppLayout";

const demoBookings: never[] = [];

export default function MyBookingsPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-cyan-300">
            Electrify Bookings
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            My Bookings
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Track your upcoming, active, and completed charging sessions.
          </p>
        </div>

        {demoBookings.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <CalendarClock className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-white">
              No bookings yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
              Once booking APIs are available, your charging reservations will
              appear here. For now, find a station and prepare your slot flow.
            </p>

            <button
              onClick={() => navigate("/stations")}
              className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-6 py-3 font-semibold text-slate-950 transition hover:opacity-90"
            >
              Find Charging Station
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {/* Future booking cards will render here */}
          </div>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <InfoCard
            icon={Zap}
            title="Upcoming"
            value="0"
            description="Reserved charging sessions"
          />

          <InfoCard
            icon={Route}
            title="Active"
            value="0"
            description="Currently running sessions"
          />

          <InfoCard
            icon={MapPinned}
            title="Completed"
            value="0"
            description="Finished charging history"
          />
        </div>
      </div>
    </AppLayout>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}