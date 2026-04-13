import { useNavigate } from "react-router-dom";
import logo from "../../assets/electrify-logo.png";
import authBg from "../../assets/auth-bg.png";
import { useAuth } from "../context/AuthContext";
import { AuthService } from "../../application/services/AuthService";

const authService = new AuthService();

export default function HomePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore for now
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authBg})` }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.82)_0%,rgba(2,6,23,0.7)_35%,rgba(2,6,23,0.9)_100%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <img
            src={logo}
            alt="Electrify"
            className="w-52 object-contain sm:w-64 lg:w-72"
          />

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-xl sm:block">
              {user?.firstName ? `Hi, ${user.firstName}` : "Welcome"}
            </div>

            <button
              onClick={handleLogout}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 px-5 pb-6 sm:px-8 lg:px-10">
          <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_22px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/90">
                Customer Dashboard
              </p>

              <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ""}.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Your Electrify dashboard is ready. As backend APIs come in, this
                page can show nearby stations, live slot availability, booking
                history, payments, and personalized charging insights.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:opacity-90">
                  Explore Stations
                </button>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">
                  View Bookings
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_22px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/90">
                Profile Snapshot
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Name
                  </p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {user?.firstName || "User"} {user?.lastName || ""}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Email
                  </p>
                  <p className="mt-1 text-base text-slate-200">
                    {user?.email || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Phone
                  </p>
                  <p className="mt-1 text-base text-slate-200">
                    {user?.phoneNumber || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Address
                  </p>
                  <p className="mt-1 text-base text-slate-200">
                    {user?.address || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="text-sm text-slate-400">Nearby Stations</p>
              <h3 className="mt-3 text-3xl font-bold text-white">--</h3>
              <p className="mt-2 text-sm text-slate-300">
                Will show count from location API.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="text-sm text-slate-400">Active Bookings</p>
              <h3 className="mt-3 text-3xl font-bold text-white">--</h3>
              <p className="mt-2 text-sm text-slate-300">
                Upcoming and in-progress sessions.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="text-sm text-slate-400">Completed Charges</p>
              <h3 className="mt-3 text-3xl font-bold text-white">--</h3>
              <p className="mt-2 text-sm text-slate-300">
                Historical charging sessions summary.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="text-sm text-slate-400">Payments</p>
              <h3 className="mt-3 text-3xl font-bold text-white">--</h3>
              <p className="mt-2 text-sm text-slate-300">
                Payment stats will appear here.
              </p>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/90">
                    Next Integrations
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Features Coming Here
                  </h2>
                </div>

                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                  Placeholder
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <h3 className="text-base font-semibold text-white">
                    Station Locator
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Nearby stations, filters, and distance-based results.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <h3 className="text-base font-semibold text-white">
                    Slot Booking
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Pre-book slots and manage charging reservations.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <h3 className="text-base font-semibold text-white">
                    Payment Module
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Online payment, receipts, and transaction status.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <h3 className="text-base font-semibold text-white">
                    Booking History
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Session records and past charging details.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/90">
                Quick Actions
              </p>

              <div className="mt-6 space-y-3">
                <button className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-left text-white transition hover:bg-slate-900">
                  Search Nearby Stations
                </button>

                <button className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-left text-white transition hover:bg-slate-900">
                  My Bookings
                </button>

                <button className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-left text-white transition hover:bg-slate-900">
                  Payments
                </button>

                <button className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-left text-white transition hover:bg-slate-900">
                  Profile Settings
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}