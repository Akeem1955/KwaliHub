"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInstitutional } from "../InstitutionalContext";

const INSTITUTION_OPTIONS = [
  "FCT RUWASSA (Rural Water Supply & Sanitation Agency)",
  "Kwali Area Council Water Resources Dept",
  "Federal Ministry of Water Resources & Sanitation",
  "UNICEF WASH Nigeria Mission",
  "WaterAid Nigeria Country Programme",
  "Action Against Hunger / INGO WASH Consortium",
];

export default function InstitutionalProfilePage() {
  const {
    isDark,
    officerName,
    officerTitle,
    officerOrg,
    officerClearance,
    officerId,
    setOfficerName,
    setOfficerTitle,
    setOfficerOrg,
    recentApprovals,
    logout,
  } = useInstitutional();

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(officerName);
  const [tempTitle, setTempTitle] = useState(officerTitle);
  const [tempOrg, setTempOrg] = useState(officerOrg);
  const [dbKpis, setDbKpis] = useState({
    totalSchemes: 0,
    uptimePct: 100,
    cavitationAlerts: 0,
    openHazards: 0,
  });

  useEffect(() => {
    setTempName(officerName);
    setTempTitle(officerTitle);
    setTempOrg(officerOrg);

    fetch("/api/institutional?ward=all")
      .then((res) => res.json())
      .then((data) => {
        if (data.kpis) {
          setDbKpis({
            totalSchemes: data.kpis.totalSchemes || 0,
            uptimePct: data.kpis.regionalUptimePct || 100,
            cavitationAlerts: data.kpis.cavitationAlerts || 0,
            openHazards: data.kpis.wasteHazardsOpen || 0,
          });
        }
      })
      .catch((err) => console.error("Failed to load profile metrics:", err));
  }, [officerName, officerTitle, officerOrg]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) setOfficerName(tempName.trim());
    if (tempTitle.trim()) setOfficerTitle(tempTitle.trim());
    if (tempOrg.trim()) setOfficerOrg(tempOrg.trim());
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Top Breadcrumb & Title */}
      <div
        className={`p-6 rounded-[2rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all ${
          isDark
            ? "bg-[#071528]/85 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            : "bg-white border-none shadow-sm"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                  isDark
                    ? "bg-[#1fcfab]/10 border-[#1fcfab]/30 text-[#1fcfab]"
                    : "bg-purple-50 border-purple-200 text-purple-700"
                }`}
              >
                Authenticated Officer Credentials
              </span>
              <span className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>•</span>
              <span className={`text-xs font-mono ${isDark ? "text-white/60" : "text-slate-600"}`}>
                ID: {officerId || "RUW-OFFICER"}
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Institutional Officer Profile & Regional Authority
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-white/60" : "text-slate-600"}`}>
              Active security session, regional authority scope, and live PostgreSQL audit telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
              }`}
            >
              ✎ Edit Officer Details
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🚪</span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg p-6 rounded-[2rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-2xl transition-all ${
              isDark ? "bg-[#071528] border-white/15 text-white" : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold">Edit Institutional Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Full Officer Name:</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isDark
                      ? "bg-white/5 border-white/15 text-white focus:border-[#1fcfab]"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-600"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Official Position / Title:</label>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isDark
                      ? "bg-white/5 border-white/15 text-white focus:border-[#1fcfab]"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-600"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Organization / Agency:</label>
                <select
                  value={tempOrg}
                  onChange={(e) => setTempOrg(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isDark
                      ? "bg-[#0c1e36] border-white/15 text-white focus:border-[#1fcfab]"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-600"
                  }`}
                >
                  {INSTITUTION_OPTIONS.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                    isDark ? "border-white/10 text-white/70" : "border-slate-300 text-slate-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isDark ? "bg-[#1fcfab] text-[#030810]" : "bg-purple-600 text-white"
                  }`}
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Row: Officer Credentials Card + Real Database State */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Officer Card & Gated Authority */}
        <div
          className={`lg:col-span-2 p-6 sm:p-8 rounded-3xl border transition-all ${
            isDark ? "bg-[#071528]/85 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-white/10">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0 shadow-lg ${
                isDark
                  ? "bg-gradient-to-br from-[#1fcfab] to-[#0d8a73] text-[#030810]"
                  : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
              }`}
            >
              {(officerName || "O").charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                    isDark
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}
                >
                  {officerClearance}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">● Active Session</span>
              </div>
              <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {officerName || "Institutional Officer"}
              </h2>
              <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                {officerTitle || "WASH Operations Officer"} • <span className="font-semibold">{officerOrg || "FCT RUWASSA"}</span>
              </p>
            </div>
          </div>

          {/* Credentials Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-xs">
            <div
              className={`p-4 rounded-2xl border ${
                isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span className={`text-[10px] font-mono uppercase font-bold block mb-1 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Regional Authority Scope:
              </span>
              <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Kwali Area Council (All 10 Geopolitical Wards)
              </p>
              <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                Ashara, Dafa, Gumbo, Kilankwa, Kundu, Kwali Central, Pai, Wako, Yangoji, Yebu
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span className={`text-[10px] font-mono uppercase font-bold block mb-1 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Officer Identifier:
              </span>
              <p className="font-mono font-bold text-sm text-sky-400">{officerId || "RUW-KW-ACTIVE"}</p>
              <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                Gated institutional role authenticated via session
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span className={`text-[10px] font-mono uppercase font-bold block mb-1 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Security Standard:
              </span>
              <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                OWASP Top 10 Access Control & Session Verification
              </p>
              <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                No unauthenticated guest access to regional controls
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span className={`text-[10px] font-mono uppercase font-bold block mb-1 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Domain Responsibilities:
              </span>
              <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                WASH Telemetry Oversight + Generative Digital Twin
              </p>
              <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                Evaluates Gemini 3.8 Flash interventions before field commitment
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Regional Metrics from Database */}
        <div
          className={`p-6 rounded-[2rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm flex flex-col justify-between transition-all ${
            isDark ? "bg-[#071528]/85 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          <div className="space-y-4">
            <div>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                  isDark
                    ? "bg-[#1fcfab]/10 border-[#1fcfab]/30 text-[#1fcfab]"
                    : "bg-purple-50 border-purple-200 text-purple-700"
                }`}
              >
                Live PostgreSQL Telemetry
              </span>
              <h3 className={`text-base font-bold mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Regional System State
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-dashed border-white/10">
                <span className={isDark ? "text-white/60" : "text-slate-500"}>Monitored Schemes:</span>
                <span className="font-bold text-sky-400">{dbKpis.totalSchemes} Water Points</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-dashed border-white/10">
                <span className={isDark ? "text-white/60" : "text-slate-500"}>Regional Uptime:</span>
                <span className="font-bold text-emerald-400">{dbKpis.uptimePct}%</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-dashed border-white/10">
                <span className={isDark ? "text-white/60" : "text-slate-500"}>Active Cavitation Alerts:</span>
                <span className={`font-bold ${dbKpis.cavitationAlerts > 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {dbKpis.cavitationAlerts}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-dashed border-white/10">
                <span className={isDark ? "text-white/60" : "text-slate-500"}>Open Waste Hazards:</span>
                <span className="font-bold text-amber-400">{dbKpis.openHazards}</span>
              </div>
            </div>

            {/* Approved Commitments Count */}
            <div
              className={`p-3 rounded-xl border text-[10px] font-mono space-y-1 ${
                isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"
              }`}
            >
              <div className="text-slate-400 uppercase font-bold">Session Simulation Approvals:</div>
              <div className="text-emerald-400 font-bold">
                {recentApprovals.length} Strategy Commitments Recorded
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10">
            <button
              onClick={logout}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
            >
              Terminate Session & Log Out
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
