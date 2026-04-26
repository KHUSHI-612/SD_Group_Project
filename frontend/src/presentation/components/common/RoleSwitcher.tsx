import { useRoleView, type ActiveRole } from "../../context/RoleViewContext";

const roles: ActiveRole[] = ["CUSTOMER", "OWNER", "MANAGER", "SUPERADMIN"];

export default function RoleSwitcher() {
  const { activeRole, setActiveRole } = useRoleView();

  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-2">
      <p className="mb-2 px-2 text-xs uppercase tracking-wide text-slate-500">
        Active View
      </p>

      <div className="grid gap-2">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setActiveRole(role)}
            className={`rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
              activeRole === role
                ? "bg-gradient-to-r from-cyan-400 to-emerald-300 text-slate-950"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}