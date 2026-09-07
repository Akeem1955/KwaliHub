"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CommunityContextType {
  isDark: boolean;
  theme: "dark" | "light";
  toggleTheme: () => void;
  isAuthenticated: boolean;
  scoutName: string;
  scoutWard: string;
  scoutXp: number;
  setScoutName: (name: string) => void;
  setScoutWard: (ward: string) => void;
  addScoutXp: (amount: number) => void;
  logout: () => void;
}

const CommunityContext = createContext<CommunityContextType>({
  isDark: true,
  theme: "dark",
  toggleTheme: () => {},
  isAuthenticated: false,
  scoutName: "",
  scoutWard: "kilankwa",
  scoutXp: 0,
  setScoutName: () => {},
  setScoutWard: () => {},
  addScoutXp: () => {},
  logout: () => {},
});

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scoutName, setScoutNameState] = useState("");
  const [scoutWard, setScoutWardState] = useState("kilankwa");
  const [scoutXp, setScoutXpState] = useState(0);

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

      const hasSession = sessionStorage.getItem("aquawatch-community-session") === "active";

      if (hasSession) {
        setIsAuthenticated(true);
        const savedName = localStorage.getItem("aquawatch-scout-name");
        if (savedName) setScoutNameState(savedName);

        const savedWard = localStorage.getItem("aquawatch-scout-ward");
        if (savedWard) setScoutWardState(savedWard);

        const savedXp = localStorage.getItem("aquawatch-scout-xp");
        if (savedXp) setScoutXpState(parseInt(savedXp, 10));
      } else {
        setIsAuthenticated(false);
      }
    } catch (_) {}
  }, []);

  const logout = () => {
    try {
      sessionStorage.removeItem("aquawatch-community-session");
      localStorage.removeItem("aquawatch-auth-role");
      localStorage.removeItem("aquawatch-scout-name");
      localStorage.removeItem("aquawatch-scout-ward");
      localStorage.removeItem("aquawatch-scout-xp");
    } catch (_) {}
    setIsAuthenticated(false);
    setScoutNameState("");
    setScoutXpState(0);
    router.replace("/signin?role=community");
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

  const setScoutName = (name: string) => {
    setScoutNameState(name);
    try {
      localStorage.setItem("aquawatch-scout-name", name);
    } catch (_) {}
  };

  const setScoutWard = (ward: string) => {
    setScoutWardState(ward);
    try {
      localStorage.setItem("aquawatch-scout-ward", ward);
    } catch (_) {}
  };

  const addScoutXp = (amount: number) => {
    setScoutXpState((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem("aquawatch-scout-xp", next.toString());
      } catch (_) {}
      return next;
    });
  };

  return (
    <CommunityContext.Provider
      value={{
        isDark,
        theme: isDark ? "dark" : "light",
        toggleTheme,
        isAuthenticated,
        scoutName: scoutName || "Community Scout",
        scoutWard,
        scoutXp,
        setScoutName,
        setScoutWard,
        addScoutXp,
        logout,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  return useContext(CommunityContext);
}
