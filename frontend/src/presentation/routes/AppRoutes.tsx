import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import ApplyStationPage from "../pages/ApplyStationPage";
import MyStationRequestsPage from "../pages/MyStationRequestsPage";
import SuperAdminRequestsPage from "../pages/SuperAdminRequestsPage";
import StationListPage from "../pages/StationListPage";
import StationDetailsPage from "../pages/StationDetailsPage";
import BookingPage from "../pages/BookingPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stations"
          element={
            <ProtectedRoute>
              <RoleRoute
                allowedRoles={["CUSTOMER", "OWNER", "MANAGER", "SUPERADMIN"]}
              >
                <StationListPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stations/:stationId"
          element={
            <ProtectedRoute>
              <RoleRoute
                allowedRoles={["CUSTOMER", "OWNER", "MANAGER", "SUPERADMIN"]}
              >
                <StationDetailsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stations/:stationId/book"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["CUSTOMER", "OWNER", "MANAGER"]}>
                <BookingPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["CUSTOMER", "OWNER", "MANAGER"]}>
                <MyBookingsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply-station"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["OWNER"]}>
                <ApplyStationPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-station-requests"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["OWNER"]}>
                <MyStationRequestsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/station-requests"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["SUPERADMIN"]}>
                <SuperAdminRequestsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}