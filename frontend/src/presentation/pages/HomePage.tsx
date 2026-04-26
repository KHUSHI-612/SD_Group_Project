import HomeSidebar from "../components/home/HomeSidebar";
import HomeHeader from "../components/home/HomeHeader";
import CustomerDashboard from "../components/home/roleDashboards/CustomerDashboard";
import OwnerDashboard from "../components/home/roleDashboards/OwnerDashboard";
import ManagerDashboard from "../components/home/roleDashboards/ManagerDashboard";
import SuperAdminDashboard from "../components/home/roleDashboards/SuperAdminDashboard";
import { useRoleView } from "../context/RoleViewContext";

export default function HomePage() {
  const { activeRole } = useRoleView();

  const renderDashboard = () => {
    if (activeRole === "OWNER") return <OwnerDashboard />;
    if (activeRole === "MANAGER") return <ManagerDashboard />;
    if (activeRole === "SUPERADMIN") return <SuperAdminDashboard />;

    return <CustomerDashboard />;
  };

  return (
    <div className="min-h-screen bg-[#050B16] text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,199,255,0.16),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(139,226,138,0.12),_transparent_22%),linear-gradient(180deg,#071120_0%,#050B16_35%,#06101B_100%)]" />

        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:90px_90px]" />

        <div className="relative mx-auto flex min-h-screen max-w-[1700px] gap-5 p-4">
          <HomeSidebar />

          <main className="min-w-0 flex-1">
            <HomeHeader />
            {renderDashboard()}
          </main>
        </div>
      </div>
    </div>
  );
}