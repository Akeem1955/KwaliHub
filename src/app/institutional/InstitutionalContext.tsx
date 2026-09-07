"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface SimulationApproval {
  id: string;
  strategyKey: string;
  strategyName: string;
  costNgn: number;
  approvedAt: string;
  officerName: string;
  ward: string;
}

interface InstitutionalContextType {
  isDark: boolean;
  theme: "dark" | "light";
  toggleTheme: () => void;
  selectedWard: string;
  setSelectedWard: (ward: string) => void;
  isAuthenticated: boolean;
  officerName: string;
  officerTitle: string;
  officerOrg: string;
  officerClearance: string;
  officerId: string;
  setOfficerName: (name: string) => void;
  setOfficerTitle: (title: string) => void;
  setOfficerOrg: (org: string) => void;
  activeStrategy: string;
  setActiveStrategy: (strat: string) => void;
  recentApprovals: SimulationApproval[];
  approveSimulation: (stratKey: string, cost: number, name: string) => void;
  logout: () => void;
  toastMessage: string | null;
  clearToast: () => void;
}

const InstitutionalContext = createContext<InstitutionalContextType>({
  isDark: true,
  theme: "dark",
  toggleTheme: () => {},
  selectedWard: "all",
  setSelectedWard: () => {},
  isAuthenticated: false,
  officerName: "",
  officerTitle: "",
  officerOrg: "",
  officerClearance: "Authorized Institutional Officer",
  officerId: "",
  setOfficerName: () => {},
  setOfficerTitle: () => {},
  setOfficerOrg: () => {},
  activeStrategy: "A",
  setActiveStrategy: () => {},
  recentApprovals: [],
  approveSimulation: () => {},
  logout: () => {},
  toastMessage: null,
  clearToast: () => {},
});

export function InstitutionalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [selectedWard, setSelectedWard] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [officerName, setOfficerNameState] = useState("");
  const [officerTitle, setOfficerTitleState] = useState("");
  const [officerOrg, setOfficerOrgState] = useState("");
  const [officerClearance] = useState("Authorized Regional Officer");
  const [officerId, setOfficerIdState] = useState("");
  const [activeStrategy, setActiveStrategy] = useState<string>("A");
  const [recentApprovals, setRecentApprovals] = useState<SimulationApproval[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("aquawatch-theme");
      if (savedTheme === "light") {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      } else {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }

      // OWASP Authentication Check
      const hasSession = sessionStorage.getItem("aquawatch-institutional-session") === "active";

      if (hasSession) {
        setIsAuthenticated(true);
        const savedOfficer = localStorage.getItem("aquawatch-officer-name") || "Institutional Officer";
        setOfficerNameState(savedOfficer);

        const savedTitle = localStorage.getItem("aquawatch-officer-title") || "WASH Systems Director";
        setOfficerTitleState(savedTitle);

        const savedOrg = localStorage.getItem("aquawatch-officer-org") || "FCT Water Board";
        setOfficerOrgState(savedOrg);

        const savedId = localStorage.getItem("aquawatch-officer-id") || `RUW-FCT-${Date.now().toString().slice(-4)}`;
        setOfficerIdState(savedId);
      } else {
        setIsAuthenticated(false);
      }

      const savedWard = localStorage.getItem("aquawatch-inst-ward");
      if (savedWard) setSelectedWard(savedWard);
    } catch (_) {}
  }, []);

  const logout = () => {
    try {
      sessionStorage.removeItem("aquawatch-institutional-session");
      localStorage.removeItem("aquawatch-auth-role");
      localStorage.removeItem("aquawatch-officer-name");
      localStorage.removeItem("aquawatch-officer-title");
      localStorage.removeItem("aquawatch-officer-org");
      localStorage.removeItem("aquawatch-officer-id");
    } catch (_) {}
    setIsAuthenticated(false);
    setOfficerNameState("");
    setOfficerTitleState("");
    setOfficerOrgState("");
    setOfficerIdState("");
    router.replace("/signin?role=institutional");
  };

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("aquawatch-theme", next ? "dark" : "light");
      } catch (_) {}
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  const setOfficerName = (name: string) => {
    setOfficerNameState(name);
    try {
      localStorage.setItem("aquawatch-officer-name", name);
    } catch (_) {}
  };

  const setOfficerTitle = (title: string) => {
    setOfficerTitleState(title);
    try {
      localStorage.setItem("aquawatch-officer-title", title);
    } catch (_) {}
  };

  const setOfficerOrg = (org: string) => {
    setOfficerOrgState(org);
    try {
      localStorage.setItem("aquawatch-officer-org", org);
    } catch (_) {}
  };

  const handleSetSelectedWard = (ward: string) => {
    setSelectedWard(ward);
    try {
      localStorage.setItem("aquawatch-inst-ward", ward);
    } catch (_) {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const clearToast = () => setToastMessage(null);

  const approveSimulation = (stratKey: string, cost: number, name: string) => {
    const newApproval: SimulationApproval = {
      id: `APPR-${Date.now().toString().slice(-4)}`,
      strategyKey: stratKey,
      strategyName: name,
      costNgn: cost,
      approvedAt: "Just now",
      officerName: officerName || "Institutional Officer",
      ward: selectedWard === "all" ? "Kwali Regional (All Wards)" : selectedWard,
    };
    setRecentApprovals((prev) => [newApproval, ...prev]);
    showToast(`Budget Allocation Approved: NGN ${cost.toLocaleString()} allocated for ${name}.`);
  };

  return (
    <InstitutionalContext.Provider
      value={{
        isDark,
        theme: isDark ? "dark" : "light",
        toggleTheme,
        selectedWard,
        setSelectedWard: handleSetSelectedWard,
        isAuthenticated,
        officerName,
        officerTitle,
        officerOrg,
        officerClearance,
        officerId,
        setOfficerName,
        setOfficerTitle,
        setOfficerOrg,
        activeStrategy,
        setActiveStrategy,
        recentApprovals,
        approveSimulation,
        logout,
        toastMessage,
        clearToast,
      }}
    >
      {children}
    </InstitutionalContext.Provider>
  );
}

export function useInstitutional() {
  return useContext(InstitutionalContext);
}
