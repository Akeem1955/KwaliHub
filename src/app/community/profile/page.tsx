"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCommunity } from "../CommunityContext";

export default function CommunityProfilePage() {
  const { isDark, scoutName, scoutWard, scoutXp, logout } = useCommunity();
  const [badgeFilter, setBadgeFilter] = useState<"all" | "earned" | "locked">("all");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/community?ward=${scoutWard}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.reports) {
          setReports(data.reports);
        }
      })
      .catch((err) => console.error("Failed to load scout reports:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [scoutWard]);

  const badges = [
    {
      id: "first_drop",
      icon: "💧",
      name: "First Drop",
      desc: "Completed your first verified borehole telemetry audit in Kwali Area Council.",
      earned: scoutXp >= 50,
      progress: `${scoutXp}/50 XP`,
      category: "WATER",
    },
    {
      id: "ward_sentry",
      icon: "🛡️",
      name: "Ward Sentry",
      desc: "Maintained active ward water point vigilance and uptime tracking in Kwali.",
      earned: scoutXp >= 150,
      progress: `${scoutXp}/150 XP`,
      category: "WATER",
    },
    {
      id: "clean_ward",
      icon: "🧹",
      name: "Clean Ward",
      desc: "Mobilized community action to clear illegal refuse heaps and blocked gutters.",
      earned: scoutXp >= 300,
      progress: `${scoutXp}/300 XP`,
      category: "SANITATION",
    },
    {
      id: "rapid_responder",
      icon: "⚡",
      name: "Rapid Responder",
      desc: "Reported an active borehole pump stoppage or critical overflow.",
      earned: scoutXp >= 500,
      progress: `${scoutXp}/500 XP`,
      category: "WATER",
    },
    {
      id: "master_guardian",
      icon: "🏆",
      name: "Master Guardian",
      desc: "Rank among the top verified WASH and waste guardians in FCT Abuja.",
      earned: scoutXp >= 750,
      progress: `${scoutXp}/750 XP`,
      category: "ALL",
    },
  ];

  const targetXp = 750;
  const progressPercent = Math.min(100, Math.round((scoutXp / targetXp) * 100));

  const filteredBadges = badges.filter((b) => {
    if (badgeFilter === "earned") return b.earned;
    if (badgeFilter === "locked") return !b.earned;
    return true;
  });

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* 1. Mobile-First Scout Identity Header Card */}
      <section className="relative">
        <div
          className={`rounded-3xl border p-5 sm:p-8 transition-colors ${
            isDark
              ? "bg-[#071528]/85 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              : "bg-white border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
          }`}
        >
          {/* Top Row: Avatar + Identity Info + Log Out */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-display text-2xl sm:text-3xl font-bold flex-shrink-0 shadow-lg ${
                  isDark
                    ? "bg-gradient-to-br from-[#1fcfab] to-[#0d8a73] text-[#030810]"
                    : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                }`}
              >
                {(scoutName || "S").charAt(0)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                      isDark
                        ? "bg-[#1fcfab]/15 text-[#1fcfab] border-[#1fcfab]/30"
                        : "bg-purple-50 text-purple-800 border-purple-200"
                    }`}
                  >
                    Active Scout
                  </span>
                  <span className={`text-xs ${isDark ? "text-white/50" : "text-slate-500 font-medium"}`}>
                    {scoutWard.charAt(0).toUpperCase() + scoutWard.slice(1).replace("-", " ")} Ward
                  </span>
                </div>

                <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  {scoutName || "Community Water Scout"}
                </h1>

                <p className={`text-xs mt-0.5 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                  Kwali Area Council Guardian Network
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/community/settings"
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                }`}
              >
                ⚙️ Settings
              </Link>

              <button
                onClick={logout}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🚪</span>
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className={`font-mono font-bold ${isDark ? "text-white/70" : "text-slate-600"}`}>
                Guardian Progress: {scoutXp} XP
              </span>
              <span className={`font-mono ${isDark ? "text-[#1fcfab]" : "text-purple-600"}`}>
                {progressPercent}% to Master Guardian
              </span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-slate-200"}`}>
              <div
                className={`h-full transition-all duration-500 ${isDark ? "bg-[#1fcfab]" : "bg-purple-600"}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Guardian Badges & Achievements */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isDark ? "text-[#1fcfab]" : "text-purple-700"}`}>
              Achievements
            </p>
            <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Guardian Badges
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {(["all", "earned", "locked"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setBadgeFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  badgeFilter === filter
                    ? isDark
                      ? "bg-[#1fcfab] text-[#030810]"
                      : "bg-purple-600 text-white"
                    : isDark
                    ? "bg-white/5 text-white/50 hover:text-white"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredBadges.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                b.earned
                  ? isDark
                    ? "bg-[#071528]/90 border-white/12"
                    : "bg-white border-slate-200/90 shadow-xs"
                  : isDark
                  ? "bg-white/2 border-white/6 opacity-40 grayscale"
                  : "bg-slate-50 border-slate-200/60 opacity-60 grayscale"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                    b.earned
                      ? isDark
                        ? "bg-[#1fcfab]/15 border-[#1fcfab]/30 text-[#1fcfab]"
                        : "bg-purple-50 border-purple-200 text-purple-700"
                      : isDark
                      ? "bg-white/5 border-white/10 text-white/40"
                      : "bg-slate-200 border-slate-300 text-slate-400"
                  }`}
                >
                  {b.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                      {b.name}
                    </h3>
                    {b.earned && (
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        isDark ? "bg-[#1fcfab]/20 text-[#1fcfab]" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-white/65" : "text-slate-600"}`}>
                    {b.desc}
                  </p>
                  {!b.earned && (
                    <p className={`text-[10px] font-mono mt-2 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                      {b.progress}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Live Scout Contribution Activity Feed (From Database) */}
      <section>
        <div className="mb-4">
          <p className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isDark ? "text-[#1fcfab]" : "text-purple-700"}`}>
            Live Database Feed
          </p>
          <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Scout Action History in {scoutWard.charAt(0).toUpperCase() + scoutWard.slice(1)}
          </h2>
        </div>

        <div
          className={`rounded-3xl border overflow-hidden divide-y ${
            isDark
              ? "bg-[#071528]/85 border-white/10 divide-white/8"
              : "bg-white border-slate-200/90 divide-slate-100 shadow-xs"
          }`}
        >
          {loading ? (
            <div className="p-8 text-center text-xs text-white/40">Loading verified field records...</div>
          ) : reports.length > 0 ? (
            reports.map((rep: any) => (
              <div
                key={rep.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isDark ? "hover:bg-white/3" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <span className="text-xl sm:text-2xl mt-0.5 flex-shrink-0">
                    {rep.category.includes("SANITATION") || rep.category.includes("REFUSE")
                      ? "🗑️"
                      : "💧"}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {rep.category.replace(/_/g, " ")}
                      </h3>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                          rep.status === "RESOLVED"
                            ? isDark
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                              : "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : rep.status === "VERIFIED"
                            ? isDark
                              ? "bg-[#7c9ef8]/15 border-[#7c9ef8]/30 text-[#7c9ef8]"
                              : "bg-blue-50 border-blue-200 text-blue-800"
                            : isDark
                            ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                            : "bg-amber-50 border-amber-200 text-amber-800"
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>

                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-white/65" : "text-slate-600"}`}>
                      {rep.description}
                    </p>
                    <p className={`text-[10px] mt-1 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                      Reporter: {rep.reporter_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0">
                  <span className={`text-[11px] font-mono ${isDark ? "text-white/45" : "text-slate-500 font-medium"}`}>
                    {new Date(rep.reported_at).toLocaleDateString()}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full border ${
                      isDark
                        ? "bg-[#1fcfab]/15 border-[#1fcfab]/30 text-[#1fcfab]"
                        : "bg-emerald-50 border-emerald-200 text-emerald-800"
                    }`}
                  >
                    {rep.urgency} Priority
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-white/50">
              No reports filed yet in this ward. Use the Report button on the dashboard to log the first incident.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
