"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { InstitutionalProvider, useInstitutional } from "./InstitutionalContext";

const KWALI_WARDS = [
  { id: "all", name: "All 10 Wards (Regional Console)" },
  { id: "kilankwa", name: "Kilankwa (Ward 04)" },
  { id: "kwali-central", name: "Kwali Central (Ward 01)" },
  { id: "ashara", name: "Ashara (Ward 03)" },
  { id: "yangoji", name: "Yangoji (Ward 02)" },
  { id: "pai", name: "Pai (Ward 05)" },
  { id: "sheda", name: "Sheda (Ward 06)" },
  { id: "dafa", name: "Dafa (Ward 07)" },
  { id: "gumbo", name: "Gumbo (Ward 08)" },
  { id: "kundu", name: "Kundu (Ward 10)" },
  { id: "wako", name: "Wako (Ward 09)" },
  { id: "yebu", name: "Yebu (Ward 08)" },
];

function InstitutionalLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const {
    isDark,
    toggleTheme,
    selectedWard,
    setSelectedWard,
    isAuthenticated,
    officerName,
    officerOrg,
    logout,
    toastMessage,
    clearToast,
  } = useInstitutional();

  // OWASP Rule: Verify session immediately upon entering protected Institutional area
  useEffect(() => {
    const hasSession =
      typeof window !== "undefined" &&
      sessionStorage.getItem("aquawatch-institutional-session") === "active";

    if (!hasSession) {
      // User is not authenticated: log out and redirect to signin
      logout();
    } else {
      setCheckingAuth(false);
    }
  }, [logout]);

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#030810] text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#1fcfab] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-white/60">
            Verifying Institutional Security Clearance...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Overview", href: "/institutional", icon: "🌍", count: null },
    { label: "Digital Twin", href: "/institutional/simulation", icon: "⚗️", count: null },
    { label: "Profile & Ledger", href: "/institutional/profile", icon: "🛡️", count: null },
  ];

  return (
    <div
      className={`h-screen flex overflow-hidden font-sans transition-colors duration-300 ${
        isDark
          ? "bg-[#030810] text-white selection:bg-[#1fcfab] selection:text-[#030810]"
          : "bg-[#f4f7f9] text-slate-900 selection:bg-purple-600 selection:text-white"
      }`}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col w-64 flex-shrink-0 border-r transition-colors duration-300 z-20 ${
          isDark
            ? "bg-[#071528]/80 border-white/5 backdrop-blur-xl"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                isDark ? "bg-[#1fcfab] text-[#030810]" : "bg-purple-600 text-white"
              }`}
            >
              AQ
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight leading-none">
                AquaWatch
              </h1>
              <span
                className={`text-[10px] uppercase font-bold tracking-widest ${
                  isDark ? "text-[#1fcfab]/70" : "text-purple-600/70"
                }`}
              >
                Command
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/institutional"
                ? pathname === "/institutional"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all group ${
                  isActive
                    ? isDark
                      ? "bg-white/10 text-white shadow-sm"
                      : "bg-purple-50 text-purple-700 shadow-sm font-semibold"
                    : isDark
                    ? "text-white/60 hover:text-white hover:bg-white/5"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? "" : "opacity-80"}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-white/5">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                isDark ? "text-white/50 hover:text-white bg-white/5" : "text-slate-600 hover:text-slate-900 bg-slate-100"
              }`}
            >
              <span>📡</span>
              <span>IoT Telemetry Simulator</span>
            </Link>
          </div>
        </div>

        {/* Officer Card & Logout Action */}
        <div className="p-4 border-t border-dashed border-white/5 dark:border-white/10 space-y-2">
          <Link
            href="/institutional/profile"
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all group ${
              isDark ? "bg-white/5 hover:bg-white/10" : "bg-slate-50 hover:bg-slate-100"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                isDark ? "bg-[#1fcfab]/20 text-[#1fcfab]" : "bg-purple-100 text-purple-700"
              }`}
            >
              {(officerName || "O").charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                {officerName || "Institutional Officer"}
              </span>
              <span className={`text-[10px] truncate ${isDark ? "text-white/50" : "text-slate-500"}`}>
                {officerOrg || "FCT RUWASSA"}
              </span>
            </div>
          </Link>

          {/* OWASP Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
          >
            <span>🚪</span>
            <span>Log Out of Console</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="flex-shrink-0 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3">
            <div
              className={`md:hidden w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                isDark ? "bg-[#1fcfab] text-[#030810]" : "bg-purple-600 text-white"
              }`}
            >
              AQ
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-semibold px-2 py-1 rounded-md ${
                  isDark ? "bg-white/10 text-[#1fcfab]" : "bg-slate-200 text-purple-700"
                }`}
              >
                RUWASSA
              </span>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className={`text-sm font-semibold bg-transparent border-none focus:ring-0 cursor-pointer appearance-none ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {KWALI_WARDS.map((w) => (
                  <option key={w.id} value={w.id} className={isDark ? "bg-[#071528] text-white" : "bg-white text-slate-900"}>
                    {w.name} ▾
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            <Link
              href="/community"
              className={`hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                isDark
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Scout Portal ↗
            </Link>

            {/* Mobile Logout Button */}
            <button
              onClick={logout}
              className="md:hidden px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-xl ${
              isDark
                ? "bg-[#071528]/90 border-[#1fcfab]/40 text-white shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
                : "bg-white/95 border-purple-200 text-slate-900 shadow-[0_10px_30px_rgba(124,58,237,0.15)]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                isDark ? "bg-[#1fcfab]/20 text-[#1fcfab]" : "bg-purple-100 text-purple-700"
              }`}
            >
              ✓
            </div>
            <div className="flex-1 text-xs">
              <p className="font-semibold">{toastMessage}</p>
              <p className={`mt-0.5 text-[10px] ${isDark ? "text-white/50" : "text-slate-500"}`}>
                RUWASSA Regional Ledger synced
              </p>
            </div>
            <button
              onClick={clearToast}
              className={`text-sm opacity-60 hover:opacity-100 p-1 cursor-pointer ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InstitutionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <InstitutionalProvider>
      <InstitutionalLayoutInner>{children}</InstitutionalLayoutInner>
    </InstitutionalProvider>
  );
}
