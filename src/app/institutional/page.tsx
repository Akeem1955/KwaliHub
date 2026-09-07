"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInstitutional } from "./InstitutionalContext";
import { WASHTelemetryChart } from "@/components/dashboard/WASHTelemetryChart";
import { WASHClosedLoopWidget } from "@/components/dashboard/WASHClosedLoopWidget";

interface RegionalPoint {
  id: string;
  name: string;
  ward: string;
  wardName: string;
  type: "WATER_POINT" | "SANITATION_HAZARD";
  status: "NORMAL" | "WARNING" | "CRITICAL";
  metric: string;
  detail: string;
  coordinates: { x: number; y: number };
  iotSensors?: string;
  scoutReport?: string;
}

export default function InstitutionalOverviewPage() {
  const {
    isDark,
    selectedWard,
    officerName,
    officerOrg,
    recentApprovals,
  } = useInstitutional();

  const [activeTab, setActiveTab] = useState<"ALL" | "WATER_POINT" | "SANITATION_HAZARD" | "ALERTS">("ALL");
  const [points, setPoints] = useState<RegionalPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<RegionalPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalSchemes: 0,
    regionalUptimePct: 100,
    waterQualityIndex: 90,
    cavitationAlerts: 0,
    wasteHazardsOpen: 0,
    wasteHazardsCleared: 0,
    capitalPreservedNgn: 3520000,
  });
  const [aiSynthesisList, setAiSynthesisList] = useState<any[]>([]);

  // Convert lat/long to map coordinates percentage inside Kwali boundary
  const geoToPercent = (lat: number, lon: number) => {
    const minLon = 6.85;
    const maxLon = 7.15;
    const minLat = 8.65;
    const maxLat = 8.95;
    const clampedLon = Math.max(minLon, Math.min(maxLon, lon || 7.0));
    const clampedLat = Math.max(minLat, Math.min(maxLat, lat || 8.8));
    const x = Math.round(((clampedLon - minLon) / (maxLon - minLon)) * 75 + 12);
    const y = Math.round(((maxLat - clampedLat) / (maxLat - minLat)) * 75 + 12);
    return { x, y };
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/institutional?ward=${selectedWard}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.kpis) setKpis(data.kpis);
        if (data.aiSynthesis) setAiSynthesisList(data.aiSynthesis);

        const mappedPoints: RegionalPoint[] = [];

        // Map live Water Points
        if (Array.isArray(data.waterPoints)) {
          data.waterPoints.forEach((wp: any) => {
            const isCritical = wp.status === "CRITICAL";
            const isDegraded = wp.status === "DEGRADED";
            const flow = Number(wp.flow_rate_lpm) || 0;
            const quality = Number(wp.water_quality_score) || 90;
            const coords = geoToPercent(Number(wp.latitude), Number(wp.longitude));

            mappedPoints.push({
              id: wp.id,
              name: wp.name,
              ward: wp.community_id,
              wardName: wp.community_name ? `${wp.community_name} Ward` : wp.community_id,
              type: "WATER_POINT",
              status: isCritical ? "CRITICAL" : isDegraded ? "WARNING" : "NORMAL",
              metric: isCritical
                ? `${flow.toFixed(1)} LPM Flow (Impeller Failure Alert)`
                : isDegraded
                ? `${flow.toFixed(1)} LPM Flow (Degraded Output)`
                : `${flow.toFixed(1)} LPM Nominal Flow`,
              detail: `pH: ${wp.ph || 7.2}, Turbidity: ${wp.turbidity_ntu || 1.5} NTU, TDS: ${wp.tds_ppm || 140} ppm, Power: ${wp.energy_kwh || 1.2} kWh.`,
              coordinates: coords,
              iotSensors: `Live IoT Array: Flow ${flow} LPM | Turbidity ${wp.turbidity_ntu} NTU | Status: ${wp.status}`,
              scoutReport: `Latest telemetry synchronized from edge sensors. Clean water distribution active.`,
            });
          });
        }

        // Map live Citizen Sanitation Hazards
        if (Array.isArray(data.reports)) {
          data.reports
            .filter((r: any) => r.category === "SANITATION_HAZARD" || r.category === "REFUSE_HEAP")
            .forEach((rep: any) => {
              const coords = geoToPercent(Number(rep.latitude), Number(rep.longitude));
              mappedPoints.push({
                id: rep.id,
                name: `${rep.community_name || rep.community_id} Waste Incursion`,
                ward: rep.community_id,
                wardName: rep.community_name ? `${rep.community_name} Ward` : rep.community_id,
                type: "SANITATION_HAZARD",
                status: rep.urgency === "HIGH" || rep.urgency === "CRITICAL" ? "CRITICAL" : "WARNING",
                metric: `${rep.category.replace("_", " ")} (${rep.status})`,
                detail: rep.description,
                coordinates: coords,
                iotSensors: "No IoT: Sanitation and hygiene is 100% community-scout monitored.",
                scoutReport: `Scout: ${rep.reporter_name} (${rep.phone || "Verified"}). Reported: ${new Date(rep.reported_at).toLocaleDateString()}.`,
              });
            });
        }

        setPoints(mappedPoints);
        if (mappedPoints.length > 0) {
          setSelectedPoint((prev) => prev || mappedPoints[0]);
        }
      })
      .catch((err) => console.error("Failed to load institutional overview:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedWard]);

  // Filter points based on activeTab
  const filteredPoints = points.filter((p) => {
    if (activeTab === "WATER_POINT") return p.type === "WATER_POINT";
    if (activeTab === "SANITATION_HAZARD") return p.type === "SANITATION_HAZARD";
    if (activeTab === "ALERTS") return p.status !== "NORMAL";
    return true;
  });

  const topSynthesis = aiSynthesisList.length > 0 ? aiSynthesisList[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="space-y-6 pt-2"
    >
      {/* Executive Welcome & Regional Status Bar */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className={`p-6 rounded-[2rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all ${
          isDark
            ? "bg-[#071528] border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            : "bg-white border-none shadow-sm"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                  isDark
                    ? "bg-[#1fcfab]/10 border-[#1fcfab]/30 text-[#1fcfab]"
                    : "bg-purple-50 border-purple-200 text-purple-700"
                }`}
              >
                RUWASSA Regional Command
              </span>
              <span className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>•</span>
              <span className={`text-xs font-mono ${isDark ? "text-white/60" : "text-slate-600"}`}>
                Kwali Area Council, FCT Abuja
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {officerName}
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-white/60" : "text-slate-600"}`}>
              {officerOrg} Operations Console: Scope:{" "}
              <span className="font-semibold text-emerald-500">
                {selectedWard === "all" ? "All 10 Kwali Wards" : `${selectedWard.toUpperCase()} Ward`}
              </span>
              . Real-time PostgreSQL database state and community scout grid.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/institutional/simulation"
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                isDark
                  ? "bg-[#1fcfab] text-[#030810] border-[#1fcfab] hover:bg-[#1ab898]"
                  : "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
              }`}
            >
              <span>Digital Twin Sandbox</span>
              <span className="text-xs">→</span>
            </Link>
            <Link
              href="/admin"
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                isDark
                  ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
              }`}
            >
              <span>IoT Simulator</span>
              <span className="text-xs">📡</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 4-Card Regional KPI Strip (Live from Database) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Regional Uptime */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? "bg-[#071528]/90 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-mono text-[11px] uppercase ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Regional Uptime
            </span>
            <span className="text-emerald-500 font-mono text-[10px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Live DB
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-bold font-display ${isDark ? "text-white" : "text-slate-900"}`}>
              {kpis.regionalUptimePct}%
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Target: 95%</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${isDark ? "text-white/45" : "text-slate-500"}`}>
            {kpis.totalSchemes} water schemes monitored in Kwali.
          </p>
        </div>

        {/* Card 2: Water Quality Index */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? "bg-[#071528]/90 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-mono text-[11px] uppercase ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Water Quality Score
            </span>
            <span className="text-sky-500 font-mono text-[10px] font-bold bg-sky-500/10 px-1.5 py-0.5 rounded">
              Telemetry
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-bold font-display ${isDark ? "text-white" : "text-slate-900"}`}>
              {kpis.waterQualityIndex}<span className="text-base text-slate-400 font-normal">/100</span>
            </span>
            <span className="text-xs text-sky-400 font-semibold">Avg across points</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Aggregated pH, Turbidity, and TDS readings.
          </p>
        </div>

        {/* Card 3: Open Waste & Hygiene Hazards */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? "bg-[#071528]/90 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-mono text-[11px] uppercase ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Waste & Drainage Hazards
            </span>
            <span className="text-amber-500 font-mono text-[10px] font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
              Scouts
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-bold font-display ${isDark ? "text-white" : "text-slate-900"}`}>
              {kpis.wasteHazardsOpen} <span className="text-sm font-normal text-amber-500">Open</span>
            </span>
            <span className="text-xs text-emerald-500 font-semibold">{kpis.wasteHazardsCleared} Cleared</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${isDark ? "text-white/45" : "text-slate-500"}`}>
            100% community scout verified in Kwali.
          </p>
        </div>

        {/* Card 4: Capital Preserved */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? "bg-[#071528]/90 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-mono text-[11px] uppercase ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Active Cavitation Alerts
            </span>
            <span className="text-red-400 font-mono text-[10px] font-bold bg-red-500/10 px-1.5 py-0.5 rounded">
              IoT Sensor
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-bold font-display ${isDark ? "text-red-400" : "text-red-600"}`}>
              {kpis.cavitationAlerts}
            </span>
            <span className="text-xs text-amber-400 font-semibold">Requiring Action</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Pumps exhibiting degraded flow or high vibration.
          </p>
        </div>
      </div>

      {/* Interactive Telemetry & Uptime Trends Graph */}
      <WASHTelemetryChart
        isDark={isDark}
        wardName={selectedWard === "all" ? "Kwali Regional (All Wards)" : `${selectedWard.toUpperCase()} Ward`}
        currentFlow={kpis.totalSchemes > 0 ? 19.5 : 0}
        currentQuality={kpis.waterQualityIndex}
      />

      {/* 6-Stage Closed-Loop Feedback Cycle (Directly from Study Abstract) */}
      <WASHClosedLoopWidget isDark={isDark} />

      {/* Gemini 3.8 Flash Diagnostic Synthesis Card (Live from Database) */}
      {topSynthesis && (
        <div
          className={`p-6 rounded-[2rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm relative overflow-hidden transition-all ${
            isDark
              ? "bg-gradient-to-br from-[#0c1f38] to-[#071528] border-[#1fcfab]/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
              : "bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200 shadow-md"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                    isDark
                      ? "bg-[#1fcfab]/20 text-[#1fcfab] border border-[#1fcfab]/40"
                      : "bg-purple-100 text-purple-800 border border-purple-300"
                  }`}
                >
                  <span>Gemini 3.8 Flash Predictive Synthesis</span>
                </span>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded font-semibold border ${
                    topSynthesis.severity === "HIGH"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {topSynthesis.severity} PRIORITY ANOMALY
                </span>
                <span className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>
                  Confidence: {topSynthesis.confidencePct}%
                </span>
              </div>

              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {topSynthesis.waterPoint}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? "bg-white/5 border-white/10" : "bg-white border-purple-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-400 mb-1">
                    <span>IoT Telemetry Cross-Correlation</span>
                  </div>
                  <p className={isDark ? "text-white/70" : "text-slate-700"}>
                    {topSynthesis.sensorData}
                  </p>
                </div>

                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? "bg-white/5 border-white/10" : "bg-white border-purple-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 mb-1">
                    <span>Citizen Scout Evidence</span>
                  </div>
                  <p className={isDark ? "text-white/70" : "text-slate-700"}>
                    {topSynthesis.citizenEvidence}
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  isDark
                    ? "bg-[#030810]/70 border-emerald-500/30 text-emerald-300"
                    : "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                  <span>Synthesized AI Diagnosis & Prescribed Action</span>
                </div>
                <p className="text-xs leading-relaxed">
                  <strong>Diagnosis:</strong> {topSynthesis.diagnosis}
                </p>
                <p className="text-xs leading-relaxed mt-1">
                  <strong>Recommended Action:</strong> {topSynthesis.recommendedAction}
                </p>
              </div>
            </div>

            {/* Quick Action Box */}
            <div
              className={`w-full lg:w-72 p-5 rounded-2xl border flex flex-col justify-between gap-4 ${
                isDark ? "bg-white/5 border-white/10" : "bg-white border-purple-200"
              }`}
            >
              <div>
                <p className={`text-xs font-mono uppercase font-bold ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  Decision Support Action
                </p>
                <p className={`text-xs mt-2 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  {topSynthesis.projectedImpact}
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/institutional/simulation"
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-center block transition-all ${
                    isDark
                      ? "bg-[#1fcfab] text-[#030810] hover:bg-[#1ab898]"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Test in Digital Twin Sandbox →
                </Link>
                <Link
                  href="/admin"
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-center block border transition-all ${
                    isDark
                      ? "bg-white/5 border-white/15 text-white hover:bg-white/10"
                      : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  Simulate Sensor Outage
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive GIS Map & Pinboard + Point Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Regional Map & Pinboard */}
        <div
          className={`lg:col-span-2 p-6 rounded-[2rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all ${
            isDark ? "bg-[#071528]/85 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Kwali Area Council Regional Pinboard
              </h3>
              <p className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>
                Live geospatial plot of water schemes and community waste reports across Kwali.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "ALL", label: "All Points" },
                { id: "WATER_POINT", label: "Water Schemes" },
                { id: "SANITATION_HAZARD", label: "Sanitation & Waste" },
                { id: "ALERTS", label: "Active Alerts" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? isDark
                        ? "bg-[#1fcfab]/20 text-[#1fcfab] border border-[#1fcfab]/40"
                        : "bg-purple-100 text-purple-800 border border-purple-300 font-semibold"
                      : isDark
                      ? "text-white/50 hover:text-white bg-white/5"
                      : "text-slate-600 hover:text-slate-900 bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Surface (Stylized Kwali Schematic Grid) */}
          <div
            className={`relative rounded-2xl border h-72 sm:h-96 overflow-hidden flex items-center justify-center p-4 transition-colors ${
              isDark ? "bg-[#030810] border-white/10" : "bg-slate-100 border-slate-200"
            }`}
          >
            {/* Ambient Grid Lines */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: isDark
                  ? "radial-gradient(#1fcfab 1px, transparent 1px)"
                  : "radial-gradient(#7c3aed 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Kwali Boundary Waterway SVG Illustration */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
            >
              <path
                d="M 5,20 Q 25,45 45,35 T 85,60 T 95,90"
                fill="none"
                stroke={isDark ? "#1fcfab" : "#6366f1"}
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />
              <path
                d="M 15,80 Q 40,65 65,75 T 90,40"
                fill="none"
                stroke={isDark ? "#38bdf8" : "#9333ea"}
                strokeWidth="0.6"
              />
            </svg>

            {/* Geographic Region Labels */}
            <div className="absolute top-4 left-6 text-[10px] font-mono uppercase tracking-widest opacity-40">
              North: Yangoji / Kilankwa
            </div>
            <div className="absolute bottom-4 right-6 text-[10px] font-mono uppercase tracking-widest opacity-40">
              South: Sheda / Wako / Pai
            </div>
            <div className="absolute top-4 right-6 text-[10px] font-mono uppercase tracking-widest opacity-40">
              East: Ashara / Gumbo / Kundu
            </div>

            {/* Interactive Points on Map */}
            {loading ? (
              <div className="text-xs text-white/40">Loading live Kwali infrastructure...</div>
            ) : (
              filteredPoints.map((point) => {
                const isSelected = selectedPoint?.id === point.id;
                const isCritical = point.status === "CRITICAL";
                const isWarning = point.status === "WARNING";
                const isSanitation = point.type === "SANITATION_HAZARD";

                return (
                  <button
                    key={point.id}
                    onClick={() => setSelectedPoint(point)}
                    style={{ left: `${point.coordinates.x}%`, top: `${point.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-transform hover:scale-125 cursor-pointer z-20 group ${
                      isSelected ? "scale-125 ring-4 ring-[#1fcfab]/40" : ""
                    }`}
                    title={`${point.name} (${point.wardName})`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg border ${
                        isCritical
                          ? "bg-red-500 border-red-300 text-white animate-pulse"
                          : isWarning
                          ? "bg-amber-500 border-amber-300 text-white"
                          : isSanitation
                          ? "bg-emerald-600 border-emerald-300 text-white"
                          : "bg-sky-500 border-sky-300 text-white"
                      }`}
                    >
                      {isSanitation ? "🗑️" : "💧"}
                    </div>

                    {/* Tooltip on hover */}
                    <div
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap px-2 py-1 rounded-md text-[10px] font-semibold border pointer-events-none shadow-md z-30 ${
                        isDark ? "bg-[#071528] text-white border-white/20" : "bg-white text-slate-900 border-slate-300"
                      }`}
                    >
                      {point.name}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span className={isDark ? "text-white/60" : "text-slate-600"}>Water Scheme (PostgreSQL Live)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className={isDark ? "text-white/60" : "text-slate-600"}>Sanitation Hazard (Scout Live)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className={isDark ? "text-white/60" : "text-slate-600"}>Critical Outage / Anomaly</span>
              </div>
            </div>
            <span className={`text-[11px] font-mono ${isDark ? "text-white/40" : "text-slate-400"}`}>
              {filteredPoints.length} points plotted
            </span>
          </div>
        </div>

        {/* Right 1 Col: Selected Point Inspector Drawer */}
        <div
          className={`p-6 rounded-[2rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm flex flex-col justify-between transition-all ${
            isDark ? "bg-[#071528]/85 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          {selectedPoint ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                    selectedPoint.type === "WATER_POINT"
                      ? isDark
                        ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                        : "bg-sky-50 border-sky-200 text-sky-700"
                      : isDark
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  {selectedPoint.type === "WATER_POINT" ? "Water Infrastructure" : "Sanitation & Drainage"}
                </span>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    selectedPoint.status === "CRITICAL"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : selectedPoint.status === "WARNING"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {selectedPoint.status}
                </span>
              </div>

              <div>
                <h4 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {selectedPoint.name}
                </h4>
                <p className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>
                  {selectedPoint.wardName}
                </p>
              </div>

              {/* Status metric banner */}
              <div
                className={`p-3 rounded-xl border ${
                  isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className={`text-xs font-mono ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  Primary Telemetry / Metric:
                </div>
                <div className={`text-sm font-bold mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {selectedPoint.metric}
                </div>
                <p className={`text-xs mt-1 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  {selectedPoint.detail}
                </p>
              </div>

              {/* IoT Sensor readout */}
              <div className="text-xs space-y-1">
                <span className={`font-mono text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-400"}`}>
                  Telemetry Layer:
                </span>
                <p className={`p-2 rounded-lg text-xs ${isDark ? "bg-white/5 text-white/80" : "bg-slate-100 text-slate-800"}`}>
                  {selectedPoint.iotSensors}
                </p>
              </div>

              {/* Citizen Scout input */}
              <div className="text-xs space-y-1">
                <span className={`font-mono text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-400"}`}>
                  Community Evidence:
                </span>
                <p className={`p-2 rounded-lg text-xs ${isDark ? "bg-white/5 text-white/80" : "bg-slate-100 text-slate-800"}`}>
                  {selectedPoint.scoutReport}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Link
                  href="/institutional/simulation"
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-center block transition-all ${
                    isDark
                      ? "bg-[#1fcfab] text-[#030810] hover:bg-[#1ab898]"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Simulate Strategy in Digital Twin →
                </Link>
                <Link
                  href="/admin"
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-center block border transition-all ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  Tune in IoT Simulator
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6 text-xs text-slate-400">
              Click a map point to inspect details
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
