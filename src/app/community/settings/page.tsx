"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCommunity } from "../CommunityContext";

const WARDS = [
  { id: "kwali-central", name: "Kwali Central (Ward 01)" },
  { id: "yangoji", name: "Yangoji (Ward 02)" },
  { id: "ashara", name: "Ashara (Ward 03)" },
  { id: "kilankwa", name: "Kilankwa (Ward 04)" },
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

export default function CommunitySettingsPage() {
  const router = useRouter();
  const { isDark, toggleTheme, scoutName, scoutWard, setScoutName, setScoutWard, logout } = useCommunity();

  // Profile fields
  const [fullName, setFullName] = useState(scoutName);
  const [phone, setPhone] = useState("");
  const [ward, setWard] = useState(scoutWard);
  const [village, setVillage] = useState("");

  // Connectivity & Low-data
  const [offlineCache, setOfflineCache] = useState(true);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [smsGateway, setSmsGateway] = useState(true);

  // Notifications
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [outagePush, setOutagePush] = useState(true);
  const [sanitationDrives, setSanitationDrives] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setFullName(scoutName);
    setWard(scoutWard);
  }, [scoutName, scoutWard]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setScoutName(fullName);
    setScoutWard(ward);
    setToastMessage("Settings successfully saved and synchronized.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1fcfab] text-[#030810] font-medium shadow-2xl shadow-[#1fcfab]/30">
          <span className="text-xl">✅</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <p className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isDark ? "text-[#1fcfab]" : "text-purple-700"}`}>
          Preferences & Controls
        </p>
        <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
          Scout Settings & Offline Protocols
        </h1>
        <p className={`text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed ${isDark ? "text-white/60" : "text-slate-600"}`}>
          Configure your guardian credentials, data optimization for rural 2G/3G networks, and Water Board dispatch notification channels.
        </p>
      </div>

      {/* Section 1: Profile & Ward Details */}
      <form
        onSubmit={handleSaveProfile}
        className={`rounded-3xl border p-5 sm:p-8 space-y-6 transition-colors ${
          isDark
            ? "bg-[#071528]/85 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
            : "bg-white border-slate-200/90 shadow-xs"
        }`}
      >
        <div className={`border-b pb-4 ${isDark ? "border-white/10" : "border-slate-100"}`}>
          <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Identity & Ward Assignment
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Used by Water Board engineers to confirm verification credentials when dispatching repair crews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
              Full Legal Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-white focus:border-[#1fcfab]"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600 focus:bg-white"
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
              WhatsApp / SMS Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-white focus:border-[#1fcfab]"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600 focus:bg-white"
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
              Primary Ward
            </label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none cursor-pointer transition-colors ${
                isDark
                  ? "bg-[#071528] border-white/10 text-white focus:border-[#1fcfab]"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600 focus:bg-white"
              }`}
            >
              {WARDS.map((w) => (
                <option key={w.id} value={w.id} className={isDark ? "bg-[#071528] text-white" : "bg-white text-slate-900"}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
              Village / Settlement
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-white focus:border-[#1fcfab]"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600 focus:bg-white"
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className={`w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isDark
                ? "bg-[#1fcfab] text-[#030810] hover:bg-[#19b595] shadow-md shadow-[#1fcfab]/20"
                : "bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-600/20"
            }`}
          >
            Save Profile Updates
          </button>
        </div>
      </form>

      {/* Section 2: Rural Field Connectivity & Low-Bandwidth */}
      <div
        className={`rounded-3xl border p-5 sm:p-8 space-y-6 transition-colors ${
          isDark
            ? "bg-[#071528]/85 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
            : "bg-white border-slate-200/90 shadow-xs"
        }`}
      >
        <div className={`border-b pb-4 ${isDark ? "border-white/10" : "border-slate-100"}`}>
          <div className="flex items-center gap-2">
            <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Rural Field Connectivity
            </h2>
            <span
              className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase border ${
                isDark
                  ? "bg-[#1fcfab]/15 text-[#1fcfab] border-[#1fcfab]/30"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              Edge Resilient
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Optimize data usage and maintain reporting capabilities when mobile signal is poor in outlying farms.
          </p>
        </div>

        <div className="space-y-3.5">
          {/* Offline Caching */}
          <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
            isDark ? "bg-white/3 border-white/8" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="pr-4">
              <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Offline Telemetry & Cache Storage
              </h4>
              <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-600"}`}>
                Automatically cache ward water points and recent reports for access without cellular reception.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOfflineCache((p) => !p)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                offlineCache
                  ? isDark ? "bg-[#1fcfab]" : "bg-purple-600"
                  : isDark ? "bg-white/15" : "bg-slate-300"
              }`}
              aria-label="Toggle offline caching"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  offlineCache ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Low Bandwidth Mode */}
          <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
            isDark ? "bg-white/3 border-white/8" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="pr-4">
              <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Low-Bandwidth Mode (2G / 3G)
              </h4>
              <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-600"}`}>
                Compress photo uploads and disable complex web animations to conserve mobile data packages.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLowBandwidth((p) => !p)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                lowBandwidth
                  ? isDark ? "bg-[#1fcfab]" : "bg-purple-600"
                  : isDark ? "bg-white/15" : "bg-slate-300"
              }`}
              aria-label="Toggle low bandwidth mode"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  lowBandwidth ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* SMS Gateway Fallback */}
          <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
            isDark ? "bg-white/3 border-white/8" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="pr-4">
              <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                SMS Dispatch Code Generator
              </h4>
              <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-600"}`}>
                When offline, allow generating 1-tap SMS codes sent to the Kwali Water Board gateway shortcode.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSmsGateway((p) => !p)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                smsGateway
                  ? isDark ? "bg-[#1fcfab]" : "bg-purple-600"
                  : isDark ? "bg-white/15" : "bg-slate-300"
              }`}
              aria-label="Toggle SMS gateway"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  smsGateway ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Notification Alerts */}
      <div
        className={`rounded-3xl border p-5 sm:p-8 space-y-6 transition-colors ${
          isDark
            ? "bg-[#071528]/85 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
            : "bg-white border-slate-200/90 shadow-xs"
        }`}
      >
        <div className={`border-b pb-4 ${isDark ? "border-white/10" : "border-slate-100"}`}>
          <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Alerts & Dispatch Channels
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Choose what notices are forwarded to your phone via WhatsApp bot or SMS.
          </p>
        </div>

        <div className="space-y-3.5">
          <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
            isDark ? "bg-white/3 border-white/8" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="pr-4">
              <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                WhatsApp Water Board Dispatch Notifications
              </h4>
              <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-600"}`}>
                Instant message when a government or donor repair crew is assigned to your logged incident.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWhatsappAlerts((p) => !p)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                whatsappAlerts
                  ? isDark ? "bg-[#1fcfab]" : "bg-purple-600"
                  : isDark ? "bg-white/15" : "bg-slate-300"
              }`}
              aria-label="Toggle WhatsApp alerts"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  whatsappAlerts ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
            isDark ? "bg-white/3 border-white/8" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="pr-4">
              <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Predictive Cavitation & Pump Alerts
              </h4>
              <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-600"}`}>
                Early acoustic warnings before your ward borehole suffers an impeller breakdown.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOutagePush((p) => !p)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                outagePush
                  ? isDark ? "bg-[#1fcfab]" : "bg-purple-600"
                  : isDark ? "bg-white/15" : "bg-slate-300"
              }`}
              aria-label="Toggle pump outage push"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  outagePush ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
            isDark ? "bg-white/3 border-white/8" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="pr-4">
              <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Community Clean-Up Day Reminders
              </h4>
              <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-600"}`}>
                Notifications for monthly environmental sanitation exercise and refuse collection in Kwali.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSanitationDrives((p) => !p)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                sanitationDrives
                  ? isDark ? "bg-[#1fcfab]" : "bg-purple-600"
                  : isDark ? "bg-white/15" : "bg-slate-300"
              }`}
              aria-label="Toggle sanitation drive reminders"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  sanitationDrives ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Interface & Session */}
      <div
        className={`rounded-3xl border p-5 sm:p-8 space-y-6 transition-colors ${
          isDark
            ? "bg-[#071528]/85 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
            : "bg-white border-slate-200/90 shadow-xs"
        }`}
      >
        <div className={`border-b pb-4 ${isDark ? "border-white/10" : "border-slate-100"}`}>
          <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Display & Security
          </h2>
        </div>

        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border ${
          isDark ? "bg-white/3 border-white/8" : "bg-slate-50 border-slate-200"
        }`}>
          <div>
            <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Theme Mode
            </h4>
            <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-600"}`}>
              Toggle between Obsidian Dark Mode and High-Contrast Light Mode.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              isDark
                ? "bg-white/5 border-white/15 text-white hover:bg-white/10"
                : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100 shadow-xs"
            }`}
          >
            {isDark ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
          </button>
        </div>

        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border ${
          isDark ? "bg-rose-500/5 border-rose-500/15" : "bg-rose-50 border-rose-200"
        }`}>
          <div>
            <h4 className={`text-xs font-bold ${isDark ? "text-rose-400" : "text-rose-700"}`}>
              Sign Out of Scout Terminal
            </h4>
            <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-600"}`}>
              Clears your active guardian session from this device.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
