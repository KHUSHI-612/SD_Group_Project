import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import HomeRolePill from "./HomeRolePill";

export default function HomeHeader() {
  const { user } = useAuth();

  const firstName = user?.firstName || "User";
  const lastName = user?.lastName || "";

  const initials = (
    (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")
  ).toUpperCase();

  return (
    <div className="mb-5 flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white 2xl:text-4xl">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            {firstName}
          </span>
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Monitor your EV ecosystem, plan routes, and find the fastest nearby
          stations.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            placeholder="Search stations, routes..."
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10">
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-300 font-semibold text-slate-950">
            {initials}
          </div>

          <p className="text-sm font-semibold text-white whitespace-nowrap">
            {firstName} {lastName}
          </p>

          <HomeRolePill />
        </div>
      </div>
    </div>
  );
}