import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./presentation/routes/AppRoutes";
import { AuthProvider } from "./presentation/context/AuthContext";
import { RoleViewProvider } from "./presentation/context/RoleViewContext";
import "./index.css";
import "./presentation/pages/AuthPage.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RoleViewProvider>
        <AppRoutes />
      </RoleViewProvider>
    </AuthProvider>
  </React.StrictMode>
);