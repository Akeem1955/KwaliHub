"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommunityProvider, useCommunity } from "./CommunityContext";

const WARDS = [
  { id: "all", name: "All Kwali Communities" },
  { id: "kilankwa", name: "Kilankwa (Ward 04)" },
  { id: "kwali-central", name: "Kwali Central (Ward 01)" },
  { id: "ashara", name: "Ashara (Ward 03)" },
  { id: "yangoji", name: "Yangoji (Ward 02)" },
  { id: "pai", name: "Pai (Ward 05)" },
  { id: "sheda", name: "Sheda (Ward 06)" },
  { id: "dafa", name: "Dafa (Ward 07)" },
  { id: "gumbo", name: "Gumbo (Ward 08)" },
  { id: "wako", name: "Wako (Ward 09)" },
  { id: "kundu", name: "Kundu (Ward 10)" },
  { id: "bako", name: "Bako Settlement" },
  { id: "koroko", name: "Koroko Settlement" },
  { id: "yebu", name: "Yebu Settlement" },
];

function CommunityLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { isDark, toggleTheme, scoutName, scoutWard, scoutXp, setScoutWard, logout } = useCommunity();

  // OWASP Rule: Verify session immediately upon entering protected Community area
  useEffect(() => {
    const hasSession =
      typeof window !== "undefined" &&
      sessionStorage.getItem("aquawatch-community-session") === "active";

    if (!hasSession) {
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
            Verifying Community Scout Security Clearance...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Overview", href: "/community", icon: "🌍" },
    { label: "Impact Gallery", href: "/community/gallery", icon: "🖼️" },
    { label: "Scout Profile", href: "/community/profile", icon: "🛡️" },
    { label: "Settings", href: "/community/settings", icon: "⚙️" },
  ];

  return (
    <div
      className={`h-screen flex overflow-hidden font-sans transition-colors duration-300 ${
        isDark
          ? "bg-[#030810] text-white selection:bg-[#1fcfab] selection:text-[#030810]"
          : "bg-[#f4f7f9] text-slate-900 selection:bg-purple-600 selection:text-white"
      }`}
    >
      {/* Desktop Navigation Sidebar Docked on the LEFT */}
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
                Community Scout
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/community"
                ? pathname === "/community"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all group ${
                  isActive
                    ? isDark
                      ? "bg-white/10 text-white shadow-sm font-semibold"
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
        </div>

        {/* Scout Profile Card & OWASP Logout */}
        <div className="p-4 border-t border-dashed border-white/5 dark:border-white/10 space-y-2">
          <Link
            href="/community/profile"
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all group ${
              isDark ? "bg-white/5 hover:bg-white/10" : "bg-slate-50 hover:bg-slate-100"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                isDark ? "bg-[#1fcfab]/20 text-[#1fcfab]" : "bg-purple-100 text-purple-700"
              }`}
            >
              {(scoutName || "S").charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                {scoutName || "Community Scout"}
              </span>
              <span className={`text-[10px] truncate ${isDark ? "text-[#1fcfab]" : "text-purple-600 font-medium"}`}>
                {scoutXp} XP · {scoutWard.replace("-", " ")}
              </span>
            </div>
          </Link>

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

      {/* Main Content Area on Right */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="flex-shrink-0 px-4 md:px-8 py-4 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile Brand Monogram */}
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
                KWALI SCOUT
              </span>
              <select
                value={scoutWard}
                onChange={(e) => setScoutWard(e.target.value)}
                className={`text-sm font-semibold bg-transparent border-none focus:ring-0 cursor-pointer appearance-none ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
                aria-label="Select Community Ward"
              >
                {WARDS.map((w) => (
                  <option
                    key={w.id}
                    value={w.id}
                    className={isDark ? "bg-[#071528] text-white" : "bg-white text-slate-900"}
                  >
                    {w.name} ▾
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Mobile Logout Button */}
            <button
              onClick={logout}
              className="md:hidden px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav
          className={`md:hidden fixed bottom-0 left-0 right-0 z-30 border-t flex items-center justify-around py-2.5 px-4 backdrop-blur-xl ${
            isDark ? "bg-[#071528]/95 border-white/10 text-white" : "bg-white/95 border-slate-200 text-slate-900"
          }`}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/community"
                ? pathname === "/community"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                  isActive
                    ? isDark
                      ? "text-[#1fcfab] font-bold"
                      : "text-purple-600 font-bold"
                    : isDark
                    ? "text-white/50"
                    : "text-slate-500"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommunityProvider>
      <CommunityLayoutInner>{children}</CommunityLayoutInner>
    </CommunityProvider>
  );
}
