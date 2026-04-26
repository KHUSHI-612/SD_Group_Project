import { useRoleView, type ActiveRole } from "../../context/RoleViewContext";

const roles: ActiveRole[] = ["CUSTOMER", "OWNER", "MANAGER", "SUPERADMIN"];

export default function HomeRolePill() {
  const { activeRole, setActiveRole } = useRoleView();

  return (
    <select
      value={activeRole}
      onChange={(event) => setActiveRole(event.target.value as ActiveRole)}
      className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200 outline-none transition hover:bg-cyan-400/15"
    >
      {roles.map((role) => (
        <option key={role} value={role} className="bg-slate-950 text-white">
          {role}
        </option>
      ))}
    </select>
  );
}