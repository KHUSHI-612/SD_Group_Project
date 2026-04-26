import { Navigate } from "react-router-dom";
import { useRoleView, type ActiveRole } from "../context/RoleViewContext";

type RoleRouteProps = {
  allowedRoles: ActiveRole[];
  children: React.ReactNode;
};

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { activeRole } = useRoleView();

  if (!allowedRoles.includes(activeRole)) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}