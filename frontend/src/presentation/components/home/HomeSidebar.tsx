import type React from "react";
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
import ElectrifyLogo from "./ElectrifyLogo";
import VehicleMiniCard, { type VehicleItem } from "./VehicleMiniCard";

const vehicles: VehicleItem[] = [
  { name: "Jupiter", model: "Sedan EV-X", battery: 73, range: 251, capacity: 129 },
  { name: "Polar", model: "Cybertruck XIV", battery: 95, range: 350, capacity: 149 },
  { name: "BMW", model: "Sedan X Series", battery: 69, range: 289, capacity: 149 },
];

type SideNavItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
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
    label: "Settings",
    icon: Settings,
    path: "/profile",
    roles: ["CUSTOMER", "OWNER", "MANAGER", "SUPERADMIN"],
  },
];

function SideNavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: SideNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-xl border ${
          active
            ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
            : "border-white/10 bg-white/5 text-slate-400 group-hover:text-white"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <span>{label}</span>
    </button>
  );
}

export default function HomeSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { activeRole } = useRoleView();

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(activeRole)
  );

  return (
    <aside className="hidden w-[255px] shrink-0 rounded-[30px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl xl:flex xl:flex-col">
      <div className="mb-7 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-400/20 bg-white/5">
          <ElectrifyLogo className="h-7 w-7" />
        </div>

        <div>
          <p className="text-lg font-semibold tracking-wide text-white">
            Electrify
          </p>
          <p className="text-xs text-slate-400">Smart EV Command Center</p>
        </div>
      </div>

      <div className="space-y-2">
        {visibleNavItems.map((item) => (
          <SideNavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}

        <SideNavItem
          icon={LogOut}
          label="Logout"
          onClick={async () => {
            await logout();
            navigate("/login", { replace: true });
          }}
        />
      </div>

      <div className="mt-7 flex items-center justify-between px-2">
        <h3 className="text-lg font-semibold text-white">My Vehicles</h3>

        <button className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {vehicles.map((item, index) => (
          <VehicleMiniCard key={item.name} item={item} index={index} />
        ))}
      </div>
    </aside>
  );
}