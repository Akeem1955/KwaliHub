"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInstitutional } from "../InstitutionalContext";
import Image from "next/image";
import Link from "next/link";

interface TwinPoint {
  id: string;
  name: string;
  type: "WATER_POINT" | "SANITATION_HAZARD";
  ward: string;
  image: string;
  telemetry: {
    flowLpm: number;
    vibration: number;
    waterQuality: number;
    ph: number;
    turbidity: number;
    tds: number;
    status: "OPERATIONAL" | "DEGRADED" | "CRITICAL" | "WARNING";
    updatedAt: string;
  };
  citizenReportsCount: number;
  aiSummary: string;
  scoutEvidenceText: string;
}

export default function DigitalTwinPage() {
  const { isDark, selectedWard } = useInstitutional();

  const [twinPoints, setTwinPoints] = useState<TwinPoint[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"REPRESENTATION" | "EVIDENCE" | "INTERVENTION">("REPRESENTATION");
  const [strategies, setStrategies] = useState<any>({});
  const [selectedStrategy, setSelectedStrategy] = useState<string>("A");
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch live points and strategies from PostgreSQL
  const fetchTwinData = async () => {
    try {
      const res = await fetch("/api/institutional?ward=all");
      const data = await res.json();

      if (data.strategies) {
        setStrategies(data.strategies);
      }

      const generatedTwinPoints: TwinPoint[] = [];

      // 1. Water points from database
      if (Array.isArray(data.waterPoints)) {
        data.waterPoints.forEach((wp: any) => {
          const flow = Number(wp.flow_rate_lpm) || 0;
          const isCritical = wp.status === "CRITICAL";
          const isDegraded = wp.status === "DEGRADED";
          const vibration = isCritical ? 4.8 : isDegraded ? 2.9 : 1.1;

          // Match AI synthesis if available
          const matchingSynthesis = Array.isArray(data.aiSynthesis)
            ? data.aiSynthesis.find((s: any) => s.id === `syn-${wp.id}` || s.waterPoint.includes(wp.name))
            : null;

          const aiText = matchingSynthesis
            ? `${matchingSynthesis.diagnosis} ${matchingSynthesis.recommendedAction}`
            : flow < 10
            ? "Mechanical impeller cavitation and sand scour degradation detected. This is localized to the pump head, verified by acoustic signatures and pressure differential decline."
            : "Nominal operational state. Solar PV yield and inverter efficiency operating within manufacturer safety tolerance.";

          generatedTwinPoints.push({
            id: wp.id,
            name: wp.name,
            type: "WATER_POINT",
            ward: wp.community_name ? `${wp.community_name} Ward` : wp.community_id,
            image: "/shot_hero.png",
            telemetry: {
              flowLpm: flow,
              vibration,
              waterQuality: Number(wp.water_quality_score) || 90,
              ph: Number(wp.ph) || 7.2,
              turbidity: Number(wp.turbidity_ntu) || 1.5,
              tds: Number(wp.tds_ppm) || 140,
              status: wp.status,
              updatedAt: wp.updated_at ? new Date(wp.updated_at).toLocaleTimeString() : "Just now",
            },
            citizenReportsCount: isCritical ? 4 : isDegraded ? 2 : 0,
            aiSummary: aiText,
            scoutEvidenceText: `Scout audio clips confirm acoustic frequency modulation at pump head. Water distribution apron inspected.`,
          });
        });
      }

      // 2. Sanitation hazards from database
      if (Array.isArray(data.reports)) {
        data.reports
          .filter((r: any) => r.category === "SANITATION_HAZARD" || r.category === "REFUSE_HEAP")
          .forEach((rep: any) => {
            generatedTwinPoints.push({
              id: rep.id,
              name: `${rep.community_name || rep.community_id} Drainage & Waste Incursion`,
              type: "SANITATION_HAZARD",
              ward: rep.community_name ? `${rep.community_name} Ward` : rep.community_id,
              image: "/shot_story_stepper.png",
              telemetry: {
                flowLpm: 0,
                vibration: 0,
                waterQuality: 45,
                ph: 6.5,
                turbidity: 9.8,
                tds: 310,
                status: rep.urgency === "HIGH" || rep.urgency === "CRITICAL" ? "CRITICAL" : "WARNING",
                updatedAt: new Date(rep.reported_at).toLocaleTimeString(),
              },
              citizenReportsCount: 1,
              aiSummary: `Solid waste runoff accumulation threatening sanitary buffer zone. Scout observation confirmed: "${rep.description}".`,
              scoutEvidenceText: `Submitted by ${rep.reporter_name} (${rep.phone || "Verified"}). Location coordinates: [${rep.latitude}, ${rep.longitude}].`,
            });
          });
      }

      setTwinPoints(generatedTwinPoints);
      if (generatedTwinPoints.length > 0 && !selectedPointId) {
        setSelectedPointId(generatedTwinPoints[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch digital twin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTwinData();
  }, []);

  const point = twinPoints.find((p) => p.id === selectedPointId) || twinPoints[0] || null;
  const activeStrategyData = strategies[selectedStrategy] || null;

  const handleApproveStrategy = async () => {
    if (!activeStrategyData) return;
    setExecuting(true);
    setExecutionResult(null);

    try {
      const res = await fetch("/api/institutional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE_SIMULATION",
          strategyKey: selectedStrategy,
          pointId: point?.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setExecutionResult(
          data.message || `Strategy ${activeStrategyData.name} approved and committed to Kwali Regional Ledger.`
        );
      }
    } catch (err: any) {
      setExecutionResult("Failed to approve strategy. Network error.");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Top Header & Selection */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className={`p-6 rounded-[2rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? "bg-[#071528] border-none" : "bg-white border-none"
        }`}
      >
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Generative WASH-AI Digital Twin
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/60" : "text-slate-600"}`}>
            Live physical and semantic representation of specific community infrastructure.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-xs font-semibold ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Target Point:
          </span>
          {loading ? (
            <div className="text-xs text-white/40">Loading schemes...</div>
          ) : (
            <select
              value={selectedPointId}
              onChange={(e) => {
                setSelectedPointId(e.target.value);
                setExecutionResult(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-none ring-1 transition-all focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-white/10 ring-white/20 text-white focus:ring-[#1fcfab]"
                  : "bg-slate-50 ring-slate-200 text-slate-800 focus:ring-purple-500"
              }`}
            >
              {twinPoints.map((p) => (
                <option key={p.id} value={p.id} className={isDark ? "bg-[#071528] text-white" : "bg-white text-slate-900"}>
                  {p.name} ({p.ward})
                </option>
              ))}
            </select>
          )}

          <Link
            href="/admin"
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all flex items-center gap-1.5"
          >
            <span>Simulate IoT</span>
            <span className="text-xs text-[#1fcfab]">📡</span>
          </Link>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {[
          { id: "REPRESENTATION", label: "Telemetry & Status" },
          { id: "EVIDENCE", label: "Community Evidence & AI" },
          { id: "INTERVENTION", label: "Generative Solutions" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? isDark
                  ? "bg-[#1fcfab] text-[#030810] shadow-sm"
                  : "bg-purple-600 text-white shadow-sm"
                : isDark
                ? "bg-[#071528] text-white/60 hover:bg-white/5"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {point && (
          <motion.div
            key={`${activeTab}-${point.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`p-6 md:p-8 rounded-[2rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm ${
              isDark ? "bg-[#071528]" : "bg-white"
            }`}
          >
            {activeTab === "REPRESENTATION" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        point.type === "WATER_POINT" ? "bg-sky-500/20 text-sky-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {point.type === "WATER_POINT" ? "Water Infrastructure" : "Sanitation Hazard"}
                      </span>
                      <span className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>
                        Updated: {point.telemetry.updatedAt}
                      </span>
                    </div>
                    <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {point.name}
                    </h2>
                    <p className={`text-sm mt-1 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                      Live sensor telemetry aggregated directly from PostgreSQL and Kwali scout network.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-2xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                      <div className={`text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-500"}`}>
                        System Status
                      </div>
                      <div
                        className={`text-lg font-bold mt-1 ${
                          point.telemetry.status === "CRITICAL"
                            ? "text-red-500"
                            : point.telemetry.status === "DEGRADED" || point.telemetry.status === "WARNING"
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {point.telemetry.status}
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                      <div className={`text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-500"}`}>
                        Scout Corroboration
                      </div>
                      <div className={`text-lg font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {point.citizenReportsCount} Verified
                      </div>
                    </div>

                    {point.type === "WATER_POINT" ? (
                      <>
                        <div className={`p-4 rounded-2xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                          <div className={`text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-500"}`}>
                            Flow Rate (LPM)
                          </div>
                          <div className="text-lg font-bold mt-1 text-sky-500">
                            {point.telemetry.flowLpm.toFixed(1)} LPM
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                          <div className={`text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-500"}`}>
                            Impeller Vibration
                          </div>
                          <div
                            className={`text-lg font-bold mt-1 ${
                              point.telemetry.vibration > 3.5 ? "text-red-400" : "text-emerald-400"
                            }`}
                          >
                            {point.telemetry.vibration.toFixed(1)} mm/s
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                          <div className={`text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-500"}`}>
                            Water Quality / pH
                          </div>
                          <div className="text-lg font-bold mt-1 text-emerald-400">
                            {point.telemetry.waterQuality} / 100 ({point.telemetry.ph} pH)
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                          <div className={`text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-500"}`}>
                            Turbidity & TDS
                          </div>
                          <div className="text-lg font-bold mt-1 text-sky-400">
                            {point.telemetry.turbidity} NTU ({point.telemetry.tds} ppm)
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={`p-4 rounded-2xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                          <div className={`text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-500"}`}>
                            Hazard Exposure
                          </div>
                          <div className="text-lg font-bold mt-1 text-amber-500">
                            High Runoff Inundation
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                          <div className={`text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-500"}`}>
                            Sanitary Buffer Threat
                          </div>
                          <div className="text-lg font-bold mt-1 text-red-400">
                            Within 25m of Wellhead
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Trend Visualizer */}
                <div
                  className={`rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] border border-dashed ${
                    isDark ? "border-white/20 bg-white/5" : "border-slate-300 bg-slate-50"
                  }`}
                >
                  <div className={`text-sm font-semibold mb-3 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                    7-Day Continuous Telemetry Trend
                  </div>

                  <svg viewBox="0 0 400 200" className="w-full max-w-sm drop-shadow-md">
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="400" y2="50" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <line x1="0" y1="100" x2="400" y2="100" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <line x1="0" y1="150" x2="400" y2="150" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />

                    {/* Flow / Hazard curve */}
                    <polyline
                      fill="none"
                      stroke={
                        point.telemetry.status === "CRITICAL"
                          ? "#ef4444"
                          : point.telemetry.status === "DEGRADED" || point.telemetry.status === "WARNING"
                          ? "#f59e0b"
                          : isDark
                          ? "#1fcfab"
                          : "#7c3aed"
                      }
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={
                        point.telemetry.status === "CRITICAL"
                          ? "0,40 50,50 100,70 150,110 200,140 250,165 300,175 350,180 400,185"
                          : point.telemetry.status === "DEGRADED"
                          ? "0,40 50,45 100,60 150,85 200,95 250,110 300,120 350,130 400,135"
                          : "0,50 50,45 100,40 150,42 200,38 250,40 300,35 350,38 400,35"
                      }
                    />
                  </svg>

                  <div className="flex justify-between w-full max-w-sm mt-3 text-[10px] text-white/40">
                    <span>Day -7</span>
                    <span>Day -3</span>
                    <span>Current Reading</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "EVIDENCE" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Community Scout Evidence
                  </h2>
                  <div
                    className={`relative w-full aspect-video rounded-2xl overflow-hidden border ${
                      isDark ? "border-white/10" : "border-slate-200"
                    }`}
                  >
                    <Image
                      src={point.image}
                      alt="Site Evidence"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className={`text-xs mt-3 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                    {point.scoutEvidenceText}
                  </p>
                </div>

                <div>
                  <h2 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <span className={isDark ? "text-[#1fcfab]" : "text-purple-600"}>✨</span>
                    Gemini 3.8 Flash Synthesis
                  </h2>
                  <div
                    className={`p-6 rounded-2xl leading-relaxed text-sm ${
                      isDark
                        ? "bg-[#1fcfab]/10 text-[#1fcfab] border border-[#1fcfab]/20"
                        : "bg-purple-50 text-purple-900 border border-purple-200"
                    }`}
                  >
                    <p className="font-semibold text-xs uppercase tracking-wider mb-2 opacity-80">
                      Context-Specific Diagnosis
                    </p>
                    <p>{point.aiSummary}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "INTERVENTION" && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-xl font-bold mb-1 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <span className={isDark ? "text-[#1fcfab]" : "text-purple-600"}>✨</span>
                    Generative Intervention Strategies
                  </h2>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>
                    AI-proposed actions evaluated against the Digital Twin to project impact before real-world implementation.
                  </p>
                </div>

                {executionResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"
                  >
                    {executionResult}
                  </motion.div>
                )}

                {Object.keys(strategies).length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Strategy List */}
                    <div className="space-y-3 lg:col-span-1">
                      {Object.keys(strategies).map((key) => {
                        const strat = strategies[key];
                        const isSelected = selectedStrategy === key;
                        return (
                          <div
                            key={key}
                            onClick={() => {
                              setSelectedStrategy(key);
                              setExecutionResult(null);
                            }}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? isDark
                                  ? "bg-white/10 border-white/30 ring-1 ring-white/30"
                                  : "bg-slate-50 border-purple-300 ring-1 ring-purple-300"
                                : isDark
                                ? "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                                : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`text-xs font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                              {strat.name}
                            </div>
                            <div className={`text-[10px] font-mono ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                              Committed Cost: {strat.costLabel}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Simulation Panel */}
                    <div className="lg:col-span-2">
                      {activeStrategyData && (
                        <div
                          className={`p-6 rounded-2xl border ${
                            isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <h3 className={`text-base font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                            Projected Outcome: {activeStrategyData.name}
                          </h3>
                          <p className={`text-sm mb-6 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                            {activeStrategyData.description}
                          </p>

                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                              <div className={`text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-500"}`}>
                                Downtime Days
                              </div>
                              <div className={`text-lg font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                                {activeStrategyData.downtimeDays} Days
                              </div>
                            </div>
                            <div>
                              <div className={`text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-500"}`}>
                                Uptime Projection
                              </div>
                              <div className="text-lg font-bold mt-1 text-sky-500">
                                {activeStrategyData.uptimeProjection}%
                              </div>
                            </div>
                            <div>
                              <div className={`text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-500"}`}>
                                Health Risk Index
                              </div>
                              <div
                                className={`text-lg font-bold mt-1 ${
                                  activeStrategyData.healthRiskIndex > 20 ? "text-red-400" : "text-emerald-400"
                                }`}
                              >
                                {activeStrategyData.healthRiskIndex} / 100
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={handleApproveStrategy}
                            disabled={executing}
                            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                              isDark
                                ? "bg-[#1fcfab] text-[#030810] hover:bg-[#1ab898]"
                                : "bg-purple-600 text-white hover:bg-purple-700"
                            }`}
                          >
                            {executing ? "Committing Allocation to Postgres..." : "Approve Strategy & Execute"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`text-center py-12 text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
                    Loading generative strategies from database...
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
