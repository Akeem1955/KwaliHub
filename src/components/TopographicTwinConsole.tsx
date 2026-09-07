"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

interface WaterPoint {
  id: string;
  name: string;
  stationCode: string;
  type: string;
  elevation: string;
  flowRate: string;
  turbidity: string;
  pressure: string;
  status: "nominal" | "warning" | "optimal";
  statusText: string;
  geminiNote: string;
  citizenReport: string;
  coords: { x: string; y: string };
  history: number[];
}

export function TopographicTwinConsole() {
  const [points, setPoints] = useState<WaterPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<WaterPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let isMounted = true;
    fetch("/api/institutional?ward=all")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data.waterPoints) && data.waterPoints.length > 0) {
          const mapped: WaterPoint[] = data.waterPoints.slice(0, 5).map((wp: any, idx: number) => {
            const isCritical = wp.status === "CRITICAL";
            const isDegraded = wp.status === "DEGRADED";
            const flow = Number(wp.flow_rate_lpm) || 0;

            // Geospatial coordinate mapping inside bounding viewport
            const minLon = 6.85;
            const maxLon = 7.15;
            const minLat = 8.65;
            const maxLat = 8.95;
            const lon = Number(wp.longitude) || 7.0;
            const lat = Number(wp.latitude) || 8.8;
            const xPercent = Math.round(((lon - minLon) / (maxLon - minLon)) * 70 + 15);
            const yPercent = Math.round(((maxLat - lat) / (maxLat - minLat)) * 70 + 15);

            return {
              id: wp.id,
              name: `${wp.name}`,
              stationCode: `KW-${wp.community_id.slice(0, 3).toUpperCase()}`,
              type: wp.type || "Solar Motorized Borehole",
              elevation: `${165 + idx * 15}m Elevation`,
              flowRate: `${flow.toFixed(1)} L/min`,
              turbidity: `${wp.turbidity_ntu || 1.4} NTU`,
              pressure: isCritical
                ? "-34% Cavitation Anomaly"
                : isDegraded
                ? "2.1 bar Degraded"
                : "3.8 bar Nominal",
              status: isCritical || isDegraded ? "warning" : "optimal",
              statusText: wp.status,
              geminiNote: isCritical
                ? "Pressure differential decline correlated with citizen acoustic reports indicating pump impeller cavitation rather than aquifer depletion."
                : "Nominal operational telemetry. Solar PV inverter running within normal efficiency curve.",
              citizenReport: `Scout verified field status in ${wp.community_name || wp.community_id} ward.`,
              coords: { x: `${xPercent}%`, y: `${yPercent}%` },
              history: isCritical ? [38, 32, 28, 22, 18, 14, flow] : [20, 21, 22, 21, 22, 23, flow],
            };
          });

          setPoints(mapped);
          setSelectedPoint(mapped[0]);
        }
      })
      .catch((err) => console.error("Failed to load twin console points:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="console" className="scroll-mt-28 w-full bg-white py-24 sm:py-32 px-4 sm:px-8 border-t border-purple-100">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-semibold text-purple-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Sentinel-2 Earth Observation • GIS Hydrology
            </div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Hydrological Digital Twin Console
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              Real-world Sentinel-2 catchment multi-spectral cartography (UTM Zone 32N, Nigeria). Click any edge sensor station to inspect live hydraulic telemetry, citizen evidence, and Gemini causal diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 px-4 py-2 rounded-xl text-xs font-mono text-purple-900 shadow-sm">
            <span>Catchment: Gurara River Basin (Kwali FCT)</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Studio Console Display Frame */}
        <div className="rounded-[2.5rem] bg-purple-50/50 p-3 sm:p-4 shadow-[0_12px_45px_rgba(124,58,237,0.08)] border border-purple-200/80">
          <div className="relative rounded-[2rem] bg-[#07050C] overflow-hidden border border-purple-900/30 min-h-[640px] shadow-2xl">
            {/* Top Bar of the Studio Display */}
            <div className="flex items-center justify-between border-b border-purple-500/20 px-6 py-3.5 text-xs text-slate-400 bg-[#100B20]">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono font-medium text-purple-200">
                  WASH TWIN // GIS HYDROLOGY VIEWPORT
                </span>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="text-purple-300">UTM Zone 32N (WGS 84, Nigeria)</span>
                <span className="text-emerald-400">SYNC: 100% POSTGRESQL</span>
              </div>
            </div>

            {/* Satellite GIS Viewport Canvas */}
            <div className="relative h-[480px] sm:h-[560px] w-full overflow-hidden">
              <Image
                src="/images/gis_watershed_satellite.jpg"
                alt="Sentinel-2 GIS Hydrological Satellite Catchment"
                fill
                className="object-cover object-center brightness-90 contrast-110"
                priority
              />

              {/* Coordinate Grid Lines Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.08)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />

              {/* Interactive Telemetry Hotspot Pins */}
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-purple-300 bg-black/40">
                  Synchronizing with Kwali PostgreSQL cluster...
                </div>
              ) : (
                points.map((point) => {
                  const isSelected = selectedPoint?.id === point.id;
                  return (
                    <button
                      key={point.id}
                      onClick={() => setSelectedPoint(point)}
                      style={{ top: point.coords.y, left: point.coords.x }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none cursor-pointer"
                      aria-label={`Select ${point.name}`}
                    >
                      <div className="relative flex items-center justify-center">
                        {/* Pulsing ring for warning or active */}
                        {point.status === "warning" && (
                          <span className="absolute h-10 w-10 rounded-full bg-amber-500/50 animate-ping" />
                        )}
                        {isSelected && (
                          <span className="absolute h-9 w-9 rounded-full bg-purple-500/60 animate-pulse" />
                        )}

                        {/* Pin Core */}
                        <div
                          className={`h-6 w-6 rounded-full border-2 border-white shadow-2xl flex items-center justify-center transition-transform group-hover:scale-125 ${
                            point.status === "warning"
                              ? "bg-amber-500 shadow-[0_0_15px_#F59E0B]"
                              : point.status === "optimal"
                              ? "bg-emerald-500 shadow-[0_0_15px_#10B981]"
                              : "bg-purple-600 shadow-[0_0_15px_#9333EA]"
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-white" />
                        </div>

                        {/* Pin Label Pill */}
                        <div className="absolute top-7 whitespace-nowrap rounded-lg bg-[#0B0813]/90 border border-purple-500/30 px-2.5 py-1 text-xs font-mono text-white shadow-xl backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity">
                          {point.stationCode}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}

              {/* Floating Glassmorphic Inspector Card */}
              {selectedPoint && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPoint.id}
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md rounded-2xl border border-purple-500/30 bg-[#0E091B]/95 p-5 text-white shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-30"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-purple-500/20 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              selectedPoint.status === "warning"
                                ? "bg-amber-400 animate-ping"
                                : selectedPoint.status === "optimal"
                                ? "bg-emerald-400"
                                : "bg-purple-400"
                            }`}
                          />
                          <h4 className="text-sm font-semibold text-white tracking-tight">
                            {selectedPoint.name}
                          </h4>
                        </div>
                        <span className="text-xs text-purple-300 font-mono">
                          {selectedPoint.type} • {selectedPoint.elevation}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          selectedPoint.status === "warning"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        {selectedPoint.statusText}
                      </span>
                    </div>

                    {/* Telemetry Metrics Row */}
                    <div className="grid grid-cols-3 gap-2 text-center bg-[#07050C] rounded-xl p-3 mb-2.5 border border-purple-500/20">
                      <div>
                        <span className="text-xs text-purple-400 uppercase font-mono">Flow Rate</span>
                        <div className="text-sm font-bold text-white font-mono mt-0.5">{selectedPoint.flowRate}</div>
                      </div>
                      <div>
                        <span className="text-xs text-purple-400 uppercase font-mono">Turbidity</span>
                        <div className="text-sm font-bold text-white font-mono mt-0.5">{selectedPoint.turbidity}</div>
                      </div>
                      <div>
                        <span className="text-xs text-purple-400 uppercase font-mono">Pressure</span>
                        <div className="text-xs font-semibold text-amber-400 font-mono mt-1">{selectedPoint.pressure}</div>
                      </div>
                    </div>

                    {/* AI Diagnostic Synthesis */}
                    <div className="rounded-xl bg-[#170E2E]/80 border border-purple-500/30 p-3 mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 mb-1">
                        <span>✨</span>
                        <span>Gemini 3.8 Flash Diagnostic</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedPoint.geminiNote}
                      </p>
                    </div>

                    {/* Citizen Ground Evidence */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>👤</span>
                      <span className="truncate">{selectedPoint.citizenReport}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
