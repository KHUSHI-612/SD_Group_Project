import React from "react";
import {
  CalendarClock,
  Home,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Plus,
  Settings,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRoleView, type ActiveRole } from "../../context/RoleViewContext";
import RoleSwitcher from "./RoleSwitcher";

type AppLayoutProps = {
  children: React.ReactNode;
};

type SideNavItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
};

type NavItem = {
  label: string;
  icon: React.ElementType;
  path: string;
  roles: ActiveRole[];
};

const navItems: NavItem[] = [
  {
    label: "Home",
    icon: Home,
    path: "/home",
    roles: ["CUSTOMER", "OWNER", "MANAGER", "SUPERADMIN"],
  },
  {
    label: "Stations",
    icon: MapPinned,
    path: "/stations",
    roles: ["CUSTOMER", "OWNER", "MANAGER", "SUPERADMIN"],
  },
  {
    label: "Apply Station",
    icon: Plus,
    path: "/apply-station",
    roles: ["OWNER"],
  },
  {
    label: "My Requests",
    icon: LayoutDashboard,
    path: "/my-station-requests",
    roles: ["OWNER"],
  },
  {
    label: "My Bookings",
    icon: CalendarClock,
    path: "/my-bookings",
    roles: ["CUSTOMER", "OWNER", "MANAGER"],
  },
  {
    label: "Admin Requests",
    icon: Settings,
    path: "/admin/station-requests",
    roles: ["SUPERADMIN"],
  },
  {
    label: "Profile",
    icon: Settings,
    path: "/profile",
    roles: ["CUSTOMER", "OWNER", "MANAGER", "SUPERADMIN"],
  },
];

function ElectrifyLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ringGradLayout" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#8BE28A" />
          <stop offset="100%" stopColor="#22C7FF" />
        </linearGradient>
        <linearGradient id="boltGradLayout" x1="20" y1="20" x2="80" y2="90">
          <stop offset="0%" stopColor="#7FE5A0" />
          <stop offset="100%" stopColor="#18C8FF" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="41" stroke="url(#ringGradLayout)" strokeWidth="6" />

      <path
        d="M55 16L25 55H46L39 83L73 42H56L55 16Z"
        fill="url(#boltGradLayout)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SideNavItem({ icon: Icon, label, active = false }: SideNavItemProps) {
  return (
    <div
      className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
        active
          ? "bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-xl border ${
          active
            ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
            : "border-white/10 bg-white/5 text-slate-400 group-hover:text-white"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <span>{label}</span>
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { activeRole } = useRoleView();

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(activeRole),
  );

  return (
    <div className="min-h-screen bg-[#050B16] text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,199,255,0.18),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(139,226,138,0.14),_transparent_22%),linear-gradient(180deg,#071120_0%,#050B16_35%,#06101B_100%)]" />

        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:90px_90px]" />

        <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-6 p-4 lg:p-6">
          <aside className="hidden w-[280px] shrink-0 rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl lg:flex lg:flex-col">
            <div className="mb-5 flex items-center gap-3 px-2">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-400/20 bg-white/5 shadow-[0_0_30px_rgba(34,199,255,0.12)]">
                <ElectrifyLogo className="h-8 w-8" />
              </div>

              <div>
                <p className="text-lg font-semibold tracking-wide text-white">
                  Electrify
                </p>
                <p className="text-xs text-slate-400">
                  Smart EV Command Center
                </p>
              </div>
            </div>

            <div className="mb-4">
              <RoleSwitcher />
            </div>

            <div className="space-y-2">
              {visibleNavItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="w-full"
                >
                  <SideNavItem
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname === item.path}
                  />
                </button>
              ))}

              <button
                type="button"
                className="w-full"
                onClick={async () => {
                  await logout();
                  navigate("/login", { replace: true });
                }}
              >
                <SideNavItem icon={LogOut} label="Logout" />
              </button>
            </div>
          </aside>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}