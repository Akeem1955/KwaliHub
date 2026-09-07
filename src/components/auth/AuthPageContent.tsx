"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

type AuthMode = "signin" | "signup";
type AuthRole = "community" | "institutional";

const KWALI_WARDS = [
  { id: "kilankwa", name: "Kilankwa (Ward 04)", hub: "12 Monitored Boreholes" },
  { id: "kwali_central", name: "Kwali Central (Ward 01)", hub: "8 Monitored Boreholes" },
  { id: "ashara", name: "Ashara (Ward 03)", hub: "6 Monitored Boreholes" },
  { id: "yangoji", name: "Yangoji (Ward 02)", hub: "5 Monitored Boreholes" },
  { id: "pai", name: "Pai (Ward 05)", hub: "4 Monitored Boreholes" },
  { id: "dabi", name: "Dabi (Ward 06)", hub: "3 Monitored Boreholes" },
  { id: "gumbo", name: "Gumbo (Ward 07)", hub: "2 Monitored Boreholes" },
  { id: "wako", name: "Wako (Ward 08)", hub: "2 Monitored Boreholes" },
  { id: "yebu", name: "Yebu (Ward 09)", hub: "2 Monitored Boreholes" },
  { id: "kundu", name: "Kundu (Ward 10)", hub: "2 Monitored Boreholes" },
];

const INSTITUTION_TYPES = [
  "FCT RUWASSA (Rural Water Supply & Sanitation Agency)",
  "Kwali Area Council Water Resources Dept",
  "Federal Ministry of Water Resources",
  "UNICEF WASH Nigeria Mission",
  "WaterAid Nigeria Programme",
  "Action Against Hunger / International NGO",
  "Local Community Development Foundation",
  "Independent WASH Donor / Research Fellow",
];

export default function AuthPageContent({ initialMode }: { initialMode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<AuthRole>(
    roleParam === "institutional" ? "institutional" : "community"
  );
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields - Community
  const [communityName, setCommunityName] = useState("");
  const [communityEmail, setCommunityEmail] = useState("");
  const [communityPassword, setCommunityPassword] = useState("");
  const [communityWard, setCommunityWard] = useState("kilankwa");
  const [communityVillage, setCommunityVillage] = useState("");

  // Form Fields - Institutional
  const [instName, setInstName] = useState("");
  const [instTitle, setInstTitle] = useState("");
  const [instEmail, setInstEmail] = useState("");
  const [instOrg, setInstOrg] = useState(INSTITUTION_TYPES[0]);
  const [instPassword, setInstPassword] = useState("");
  const [instScope, setInstScope] = useState("Kwali Area Council FCT (All 10 Wards)");

  // Sync theme with localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aquawatch-theme");
      if (saved === "light") {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      } else {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }
    } catch (_) {}
  }, []);

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

  // Ambient mouse glow
  const mouseGlow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      cx = lerp(cx, tx, 0.06);
      cy = lerp(cy, ty, 0.06);
      if (mouseGlow.current) {
        mouseGlow.current.style.transform = `translate(${cx - 250}px, ${cy - 250}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "signin") {
        if (role === "community") {
          try {
            sessionStorage.setItem("aquawatch-community-session", "active");
            localStorage.setItem("aquawatch-auth-role", "community");
            if (communityEmail) {
              // Now that communityEmail is actually the Name from the form, just save it directly
              localStorage.setItem("aquawatch-scout-name", communityEmail);
            }
          } catch (_) {}
          setSuccessMessage(
            "Welcome back, Water Guardian! Redirecting to Kwali Community Portal..."
          );
          setTimeout(() => {
            router.push("/community");
          }, 900);
        } else {
          try {
            sessionStorage.setItem("aquawatch-institutional-session", "active");
            localStorage.setItem("aquawatch-auth-role", "institutional");
            if (instEmail) {
              const nameFromEmail = instEmail.split("@")[0].replace(/[._-]/g, " ");
              const capitalized = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
              localStorage.setItem("aquawatch-officer-name", `Engr. ${capitalized}`);
              localStorage.setItem("aquawatch-officer-title", "WASH Operations Officer");
              localStorage.setItem("aquawatch-officer-id", `RUW-KW-${Date.now().toString().slice(-4)}`);
            }
            if (instOrg) {
              localStorage.setItem("aquawatch-officer-org", instOrg);
            }
          } catch (_) {}
          setSuccessMessage(
            "Terminal authentication granted. Welcome to FCT RUWASSA Operations Console. Redirecting..."
          );
          setTimeout(() => {
            router.push("/institutional");
          }, 900);
        }
      } else {
        if (role === "community") {
          try {
            sessionStorage.setItem("aquawatch-community-session", "active");
            localStorage.setItem("aquawatch-auth-role", "community");
            if (communityName) localStorage.setItem("aquawatch-scout-name", communityName);
            if (communityWard) localStorage.setItem("aquawatch-scout-ward", communityWard);
          } catch (_) {}
          setSuccessMessage(
            "Congratulations! Welcome to AquaWatchAI Kwali. Your First Drop badge and +100 XP have been credited."
          );
          setTimeout(() => {
            router.push("/community");
          }, 900);
        } else {
          try {
            sessionStorage.setItem("aquawatch-institutional-session", "active");
            localStorage.setItem("aquawatch-auth-role", "institutional");
            if (instName) localStorage.setItem("aquawatch-officer-name", instName);
            if (instTitle) localStorage.setItem("aquawatch-officer-title", instTitle);
            if (instOrg) localStorage.setItem("aquawatch-officer-org", instOrg);
            localStorage.setItem("aquawatch-officer-id", `RUW-KW-${Date.now().toString().slice(-4)}`);
          } catch (_) {}
          setSuccessMessage(
            "Institutional pilot registration verified. Initializing FCT RUWASSA Command Console..."
          );
          setTimeout(() => {
            router.push("/institutional");
          }, 900);
        }
      }
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col justify-between transition-colors duration-500 overflow-x-hidden ${
        isDark
          ? "bg-[#030810] text-white selection:bg-[#1fcfab] selection:text-[#030810]"
          : "bg-slate-50 text-slate-900 selection:bg-purple-600 selection:text-white"
      }`}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          ref={mouseGlow}
          className="absolute w-[500px] h-[500px] rounded-full will-change-transform"
          style={{
            background: isDark
              ? role === "community"
                ? "radial-gradient(circle, rgba(31,207,171,0.08) 0%, transparent 65%)"
                : "radial-gradient(circle, rgba(124,158,248,0.08) 0%, transparent 65%)"
              : "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 65%)",
            top: 0,
            left: 0,
          }}
        />
        <div
          className="orb-1 absolute top-[-10vh] right-[-10vw] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(31,207,171,0.05) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="orb-2 absolute bottom-[-10vh] left-[-10vw] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(124,158,248,0.05) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(79,70,229,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Top Header */}
      <header className="relative z-20 max-w-6xl mx-auto w-full px-6 pt-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-md ${
              isDark
                ? "bg-gradient-to-br from-[#1fcfab] to-[#0d8a73]"
                : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
            }`}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <circle cx="8" cy="8" r="3" fill="white" />
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="white"
                strokeWidth="0.8"
                strokeDasharray="2 1.5"
                opacity="0.75"
              />
            </svg>
          </div>
          <span
            className={`font-display font-bold text-base tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            AquaWatch
            <span className={isDark ? "text-[#1fcfab]" : "text-purple-600"}>AI</span>
            <span
              className={`ml-1.5 text-[9px] font-mono-label font-normal px-1.5 py-0.5 rounded border ${
                isDark
                  ? "text-[#1fcfab] bg-[#1fcfab]/10 border-[#1fcfab]/30"
                  : "text-purple-700 bg-purple-50 border-purple-200"
              }`}
            >
              Kwali FCT
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
              isDark
                ? "bg-white/5 border-white/15 text-amber-300 hover:bg-white/10 hover:text-amber-200"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs"
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <Link
            href="/"
            className={`flex items-center gap-1.5 font-mono-label text-[11px] tracking-wider uppercase px-3 py-1.5 rounded-xl border transition-all ${
              isDark
                ? "border-white/10 text-white/60 hover:text-white hover:border-white/20"
                : "border-slate-200 text-slate-600 hover:text-slate-900 bg-white"
            }`}
          >
            <span>←</span> Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-xl mx-auto w-full px-6 py-10 flex-1 flex flex-col justify-center">
        {/* Track Selector (Community vs Institutional) */}
        <div
          className={`p-1.5 rounded-2xl flex items-center mb-8 border backdrop-blur-xl transition-all ${
            isDark
              ? "bg-white/4 border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              : "bg-white border-purple-100 shadow-sm"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setRole("community");
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 font-mono-label text-[11px] uppercase tracking-wider font-bold cursor-pointer ${
              role === "community"
                ? isDark
                  ? "bg-[#1fcfab]/15 text-[#1fcfab] border border-[#1fcfab]/35 shadow-[0_0_20px_rgba(31,207,171,0.2)]"
                  : "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : isDark
                ? "text-white/45 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>🏡</span>
            <span>Community Scout</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("institutional");
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 font-mono-label text-[11px] uppercase tracking-wider font-bold cursor-pointer ${
              role === "institutional"
                ? isDark
                  ? "bg-[#7c9ef8]/15 text-[#7c9ef8] border border-[#7c9ef8]/35 shadow-[0_0_20px_rgba(124,158,248,0.2)]"
                  : "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : isDark
                ? "text-white/45 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>🏢</span>
            <span>RUWASSA / NGO</span>
          </button>
        </div>

        {/* Auth Box */}
        <div
          className={`relative rounded-3xl p-8 md:p-10 border backdrop-blur-2xl transition-all duration-500 ${
            isDark
              ? "bg-[#0c1e36]/90 border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "bg-white border-purple-200/80 shadow-[0_20px_60px_rgba(124,58,237,0.08)]"
          }`}
        >
          {/* Card Header & Mode Switcher */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`font-mono-label text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                    role === "community"
                      ? isDark
                        ? "bg-[#1fcfab]/10 text-[#1fcfab] border-[#1fcfab]/30"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : isDark
                      ? "bg-[#7c9ef8]/10 text-[#7c9ef8] border-[#7c9ef8]/30"
                      : "bg-indigo-50 text-indigo-800 border-indigo-200"
                  }`}
                >
                  {role === "community" ? "Community Water Scout Portal" : "Institutional Command Console"}
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-light tracking-tight">
                <span className={isDark ? "text-white font-light" : "text-slate-900 font-bold"}>
                  {mode === "signin"
                    ? role === "community"
                      ? "Welcome Back, Scout"
                      : "Institutional Sign In"
                    : role === "community"
                    ? "Join as Community Scout"
                    : "Request Console Pilot"}
                </span>
              </h1>
              <p className={`text-xs mt-1.5 ${isDark ? "text-white/45" : "text-slate-600"}`}>
                {mode === "signin"
                  ? role === "community"
                    ? "Log in to track clean water status and earn Guardian XP."
                    : "Access the digital twin, predictive alerts, and work order dispatches."
                  : role === "community"
                  ? "Report borehole breakdowns in Kwali and protect your village."
                  : "Deploy 14-day continuous digital twin across FCT wards."}
              </p>
            </div>

            {/* Mode Switch Pills */}
            <div
              className={`p-1 rounded-xl flex border shrink-0 text-[10px] font-mono-label font-bold uppercase tracking-wider ${
                isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setSuccessMessage(null);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  mode === "signin"
                    ? isDark
                      ? "bg-white/15 text-white shadow-xs"
                      : "bg-white text-slate-900 shadow-xs"
                    : isDark
                    ? "text-white/40 hover:text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setSuccessMessage(null);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  mode === "signup"
                    ? isDark
                      ? "bg-white/15 text-white shadow-xs"
                      : "bg-white text-slate-900 shadow-xs"
                    : isDark
                    ? "text-white/40 hover:text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Success Feedback Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
              <span className="text-base">✅</span>
              <div>
                <p className="font-bold font-mono-label text-[10px] tracking-wider uppercase mb-0.5 text-emerald-400">
                  Authentication Update
                </p>
                <p className="text-white/85 leading-relaxed">{successMessage}</p>
                <Link
                  href="/"
                  className="inline-block mt-2 underline font-mono-label text-[10px] text-emerald-400 hover:text-emerald-300"
                >
                  Return to AquaWatchAI Kwali Home →
                </Link>
              </div>
            </div>
          )}

          {/* Form */}
          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ================= COMMUNITY SCOUT SIGN IN ================= */}
              {role === "community" && mode === "signin" && (
                <>
                  <div>
                    <label
                      className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                        isDark ? "text-white/70" : "text-slate-700"
                      }`}
                    >
                      Scout Username / Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amina Bello"
                      value={communityEmail}
                      onChange={(e) => setCommunityEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none font-mono-label ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-[#1fcfab] focus:ring-2 focus:ring-[#1fcfab]/20"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        className={`font-mono-label text-[10px] uppercase tracking-wider font-semibold ${
                          isDark ? "text-white/70" : "text-slate-700"
                        }`}
                      >
                        Password
                      </label>
                      <a
                        href="#forgot"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("A password reset link has been dispatched to your email address.");
                        }}
                        className={`text-[10px] font-mono-label uppercase tracking-wider hover:underline ${
                          isDark ? "text-[#1fcfab]" : "text-purple-600"
                        }`}
                      >
                        Forgot?
                      </a>
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={communityPassword}
                      onChange={(e) => setCommunityPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-[#1fcfab] focus:ring-2 focus:ring-[#1fcfab]/20"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                      }`}
                    />
                  </div>
                </>
              )}

              {/* ================= COMMUNITY SCOUT SIGN UP ================= */}
              {role === "community" && mode === "signup" && (
                <>
                  <div>
                    <label
                      className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                        isDark ? "text-white/70" : "text-slate-700"
                      }`}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amina Bello or Danladi Ibrahim"
                      value={communityName}
                      onChange={(e) => setCommunityName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-[#1fcfab] focus:ring-2 focus:ring-[#1fcfab]/20"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                        isDark ? "text-white/70" : "text-slate-700"
                      }`}
                    >
                      Scout Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. amina.bello@gmail.com"
                      value={communityEmail}
                      onChange={(e) => setCommunityEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none font-mono-label ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-[#1fcfab] focus:ring-2 focus:ring-[#1fcfab]/20"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label
                        className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                          isDark ? "text-white/70" : "text-slate-700"
                        }`}
                      >
                        Kwali Area Council Ward
                      </label>
                      <select
                        value={communityWard}
                        onChange={(e) => setCommunityWard(e.target.value)}
                        className={`w-full px-3 py-3 rounded-xl border text-xs transition-all outline-none font-mono-label ${
                          isDark
                            ? "bg-[#0c1e36] border-white/15 text-white focus:border-[#1fcfab]"
                            : "bg-white border-slate-200 text-slate-900 focus:border-purple-600"
                        }`}
                      >
                        {KWALI_WARDS.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                          isDark ? "text-white/70" : "text-slate-700"
                        }`}
                      >
                        Village / Neighborhood
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kilankwa II or Central"
                        value={communityVillage}
                        onChange={(e) => setCommunityVillage(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-[#1fcfab]"
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                        isDark ? "text-white/70" : "text-slate-700"
                      }`}
                    >
                      Create Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={communityPassword}
                      onChange={(e) => setCommunityPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-[#1fcfab] focus:ring-2 focus:ring-[#1fcfab]/20"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                      }`}
                    />
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${
                      isDark
                        ? "bg-gradient-to-r from-[#1fcfab]/10 to-transparent border-[#1fcfab]/25"
                        : "bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🏅</span>
                      <div>
                        <p className={`font-bold text-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                          First Drop Badge Unlocked
                        </p>
                        <p className={`text-[10px] ${isDark ? "text-white/50" : "text-slate-600"}`}>
                          You will earn 100 XP upon your first verified borehole report.
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-label text-[10px] font-bold text-emerald-500">
                      +100 XP
                    </span>
                  </div>
                </>
              )}

              {/* ================= INSTITUTIONAL SIGN IN ================= */}
              {role === "institutional" && mode === "signin" && (
                <>
                  <div>
                    <label
                      className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                        isDark ? "text-white/70" : "text-slate-700"
                      }`}
                    >
                      Official Institutional Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. babatunde.lawal@ruwassa.fct.gov.ng"
                      value={instEmail}
                      onChange={(e) => setInstEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none font-mono-label ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-[#7c9ef8] focus:ring-2 focus:ring-[#7c9ef8]/20"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        className={`font-mono-label text-[10px] uppercase tracking-wider font-semibold ${
                          isDark ? "text-white/70" : "text-slate-700"
                        }`}
                      >
                        Terminal Password
                      </label>
                      <a
                        href="#forgot"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Password reset instructions dispatched to your official agency administrator.");
                        }}
                        className={`text-[10px] font-mono-label uppercase tracking-wider hover:underline ${
                          isDark ? "text-[#7c9ef8]" : "text-indigo-600"
                        }`}
                      >
                        Forgot?
                      </a>
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={instPassword}
                      onChange={(e) => setInstPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-[#7c9ef8]"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                      }`}
                    />
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2.5 ${
                      isDark
                        ? "bg-[#7c9ef8]/5 border-[#7c9ef8]/20 text-white/70"
                        : "bg-indigo-50 border-indigo-200 text-indigo-900"
                    }`}
                  >
                    <span className="text-base">🛡️</span>
                    <p>
                      Authorized for RUWASSA FCT, Kwali Area Council Water Board, and vetted SDG 6 development donors only.
                    </p>
                  </div>
                </>
              )}

              {/* ================= INSTITUTIONAL SIGN UP ================= */}
              {role === "institutional" && mode === "signup" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label
                        className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                          isDark ? "text-white/70" : "text-slate-700"
                        }`}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Engr. Babatunde Lawal"
                        value={instName}
                        onChange={(e) => setInstName(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-[#7c9ef8]"
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                          isDark ? "text-white/70" : "text-slate-700"
                        }`}
                      >
                        Official Designation
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chief WASH Engineer"
                        value={instTitle}
                        onChange={(e) => setInstTitle(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-[#7c9ef8]"
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                        isDark ? "text-white/70" : "text-slate-700"
                      }`}
                    >
                      Institutional Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. b.lawal@ruwassa.fct.gov.ng"
                      value={instEmail}
                      onChange={(e) => setInstEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none font-mono-label ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-[#7c9ef8]"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                        isDark ? "text-white/70" : "text-slate-700"
                      }`}
                    >
                      Organization / Agency
                    </label>
                    <select
                      value={instOrg}
                      onChange={(e) => setInstOrg(e.target.value)}
                      className={`w-full px-3 py-3 rounded-xl border text-xs transition-all outline-none font-mono-label ${
                        isDark
                          ? "bg-[#0c1e36] border-white/15 text-white focus:border-[#7c9ef8]"
                          : "bg-white border-slate-200 text-slate-900 focus:border-indigo-600"
                      }`}
                    >
                      {INSTITUTION_TYPES.map((org) => (
                        <option key={org} value={org}>
                          {org}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                        isDark ? "text-white/70" : "text-slate-700"
                      }`}
                    >
                      Target Monitoring Scope
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kwali Area Council (42 Monitored Hubs)"
                      value={instScope}
                      onChange={(e) => setInstScope(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-[#7c9ef8]"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block font-mono-label text-[10px] uppercase tracking-wider mb-1.5 font-semibold ${
                        isDark ? "text-white/70" : "text-slate-700"
                      }`}
                    >
                      Set Terminal Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 8 characters"
                      value={instPassword}
                      onChange={(e) => setInstPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-[#7c9ef8]"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                      }`}
                    />
                  </div>
                </>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 py-4 rounded-xl font-mono-label text-xs tracking-widest uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  role === "community"
                    ? isDark
                      ? "bg-[#1fcfab] text-[#030810] hover:shadow-[0_0_30px_rgba(31,207,171,0.5)] hover:scale-[1.01]"
                      : "bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-600/30"
                    : isDark
                    ? "bg-[#7c9ef8] text-[#030810] hover:shadow-[0_0_30px_rgba(124,158,248,0.5)] hover:scale-[1.01]"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/30"
                } ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === "signin"
                        ? role === "community"
                          ? "Enter Scout Portal →"
                          : "Sign In to Command Console →"
                        : role === "community"
                        ? "Register as Community Scout →"
                        : "Submit Institutional Pilot Request →"}
                    </span>
                  </>
                )}
              </button>

              {/* Toggle Mode Link */}
              <div className="text-center pt-4">
                <p className={`text-xs ${isDark ? "text-white/40" : "text-slate-500"}`}>
                  {mode === "signin" ? "Need a new account?" : "Already registered?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "signin" ? "signup" : "signin");
                      setSuccessMessage(null);
                    }}
                    className={`font-semibold underline cursor-pointer ml-1 ${
                      role === "community"
                        ? isDark
                          ? "text-[#1fcfab]"
                          : "text-purple-600"
                        : isDark
                        ? "text-[#7c9ef8]"
                        : "text-indigo-600"
                    }`}
                  >
                    {mode === "signin"
                      ? role === "community"
                        ? "Sign up as Scout"
                        : "Request Pilot"
                      : "Sign in to account"}
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 max-w-6xl mx-auto w-full px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-2 border-t border-white/5">
        <p className={`font-mono-label text-[10px] ${isDark ? "text-white/30" : "text-slate-400"}`}>
          © 2026 AquaWatchAI · Kwali Area Council FCT, Nigeria · UN SDG 6
        </p>
        <div className="flex items-center gap-4">
          <span className={`font-mono-label text-[9px] ${isDark ? "text-white/20" : "text-slate-400"}`}>
            NDPR Compliant · 256-Bit Encrypted Ground Truth Mesh
          </span>
        </div>
      </footer>
    </div>
  );
}
