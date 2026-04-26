import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ActiveRole = "CUSTOMER" | "OWNER" | "MANAGER" | "SUPERADMIN";

type RoleViewContextType = {
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;
};

const RoleViewContext = createContext<RoleViewContextType | undefined>(
  undefined
);

export function RoleViewProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<ActiveRole>(() => {
    const savedRole = localStorage.getItem("activeRole");

    if (
      savedRole === "CUSTOMER" ||
      savedRole === "OWNER" ||
      savedRole === "MANAGER" ||
      savedRole === "SUPERADMIN"
    ) {
      return savedRole;
    }

    return "CUSTOMER";
  });

  const setActiveRole = (role: ActiveRole) => {
    localStorage.setItem("activeRole", role);
    setActiveRoleState(role);
  };

  const value = useMemo(
    () => ({
      activeRole,
      setActiveRole,
    }),
    [activeRole]
  );

  return (
    <RoleViewContext.Provider value={value}>
      {children}
    </RoleViewContext.Provider>
  );
}

export function useRoleView() {
  const context = useContext(RoleViewContext);

  if (!context) {
    throw new Error("useRoleView must be used inside RoleViewProvider");
  }

  return context;
}