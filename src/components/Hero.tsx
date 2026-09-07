"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/Button";

const stages = [
  {
    id: "gis",
    label: "Sentinel-2 GIS Basin",
    badge: "Earth Observation · UTM Zone 32N",
    title: "Gurara Hydrological Basin · Kwali FCT",
    subtitle: "Sentinel-2 multi-spectral elevation contours & river catchment",
    type: "image",
    image: "/images/gis_watershed_satellite.jpg",
    telemetry: {
      node: "Station KW-ST01 · Active Flow",
      metric: "38.4 L/min · WHO Standard",
      coords: "8°53'N, 7°01'E",
    },
  },
  {
    id: "hardware",
    label: "Solar IoT Edge Node",
    badge: "Hardware Telemetry + Guardian",
    title: "Community Solar Borehole #3",
    subtitle: "Amina Bello (Level 4 Sentinel) · 60s verified audio/video stream",
    type: "image",
    image: "/images/rural_borehole_solar.jpg",
    telemetry: {
      node: "AquaNet Edge Logger v2.4",
      metric: "Battery 98% (Solar) · 1.2 NTU",
      coords: "Kilankwa Ward · Borehole #3",
    },
  },
  {
    id: "ai",
    label: "AI Diagnostics",
    badge: "Automated Diagnosis",
    title: "Root-Cause Anomaly Analysis",
    subtitle: "Correlating IoT pressure drop (-34%) with community audio logs",
    type: "diagnostic",
    diagnostic:
      "Pressure decline indicates pump impeller cavitation rather than aquifer depletion. Ground water level remains stable at 85m. Action: Divert Sector C to Station KW-ST01 and dispatch replacement impeller seal.",
    confidence: "Verified Mechanical Fault",
    similarity: "Matches 14 Solved Repairs in Kwali",
  },
  {
    id: "simulation",
    label: "In-Twin Simulator",
    badge: "Predictive Decision Sandbox",
    title: "Pre-Action Maintenance Simulation",
    subtitle: "Evaluate intervention cost and community access before dispatch",
    type: "simulation",
    optA: {
      title: "Option A: Impeller Replacement",
      cost: "₦280,000",
      time: "18 Hours",
      impact: "92% community water access preserved",
    },
    optB: {
      title: "Option B: Aquifer Redrill (Unneeded)",
      cost: "₦3,800,000",
      time: "14 Days",
      impact: "64% disruption to village water points",
    },
  },
];

export function Hero() {
  const [activeStage, setActiveStage] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Auto-advance tabs every 6 seconds unless reduced motion is preferred
  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  const current = stages[activeStage];

  return (
    <section className="relative min-h-[96dvh] w-full overflow-hidden bg-white px-4 pt-28 pb-20 sm:px-8 lg:pt-36">
      {/* Ambient purple & indigo radial glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-100/60 blur-[120px]" />
        <div className="absolute top-1/3 right-10 h-[600px] w-[600px] rounded-full bg-indigo-100/50 blur-[140px]" />
        <div className="absolute -bottom-20 left-10 h-[400px] w-[400px] rounded-full bg-purple-50 blur-[100px]" />
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Editorial & Technical Positioning */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Live Operational Status Chip */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-medium text-purple-900 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-purple-700 font-semibold">LIVE SATELLITE TWIN ACTIVE</span>
              <span className="text-purple-300">·</span>
              <span className="text-slate-600">Gurara Catchment · Kwali FCT</span>
            </div>

            {/* Display H1 */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08]">
              WASH·Twin <br />
              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Cyber-Physical
              </span>{" "}
              Rural Water.
            </h1>

            {/* Sub-headline & Description */}
            <div className="space-y-3 max-w-xl">
              <p className="text-lg sm:text-xl font-semibold text-purple-800">
                Continuous ground truth for utilities, ministries, and field NGOs.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Fusing IoT flow telemetry, verified citizen video sentinels, and Gemini 3.8 Flash causal diagnostics into an interactive digital twin. Eliminate blind spots and simulate interventions before dispatching field crews.
              </p>
            </div>

            {/* Live Telemetry Status Ribbon */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-purple-200/80 bg-white p-3.5 shadow-[0_4px_20px_rgba(124,58,237,0.06)] max-w-lg">
              <div className="px-2">
                <span className="text-xs font-mono text-purple-600 uppercase tracking-wider font-semibold">Active Basin</span>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">UTM 32N</div>
                <div className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  4 Nodes Synced
                </div>
              </div>
              <div className="px-2 border-x border-purple-100">
                <span className="text-xs font-mono text-purple-600 uppercase tracking-wider font-semibold">Mean Triage</span>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">&lt; 12 Mins</div>
                <div className="text-xs text-slate-500 mt-0.5">vs 8 mo audit</div>
              </div>
              <div className="px-2">
                <span className="text-xs font-mono text-purple-600 uppercase tracking-wider font-semibold">AI Accuracy</span>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">94.2%</div>
                <div className="text-xs text-purple-700 font-medium mt-0.5">Causal Validation</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => {
                  const el = document.getElementById("console");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Launch GIS Hydrology Twin
                <span className="text-xs">→</span>
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  const el = document.getElementById("institutional");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Request Vetted Clearance
                <span className="text-xs text-purple-600 font-bold">↗</span>
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Authentic GIS Hydrological Twin Viewport */}
          <div className="lg:col-span-6 relative">
            
            {/* Outer Studio Display Frame */}
            <div className="rounded-3xl border border-purple-200/80 bg-purple-50/40 p-3 sm:p-4 shadow-[0_10px_40px_rgba(124,58,237,0.08)] backdrop-blur-xl">
              
              {/* Interactive Stage Tab Selector */}
              <div className="flex items-center justify-between border-b border-purple-200/60 pb-3 mb-3 gap-1 overflow-x-auto">
                {stages.map((stage, idx) => {
                  const isActive = activeStage === idx;
                  return (
                    <button
                      key={stage.id}
                      onClick={() => setActiveStage(idx)}
                      className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-purple-600 text-white shadow-sm border border-purple-500"
                          : "text-slate-600 hover:text-purple-700 hover:bg-purple-100/60"
                      }`}
                    >
                      {stage.label}
                    </button>
                  );
                })}
              </div>

              {/* Viewport Display Area */}
              <div className="relative rounded-2xl bg-white border border-purple-200/80 overflow-hidden min-h-[440px] flex flex-col justify-between shadow-sm">
                <AnimatePresence mode="wait">
                  {current.type === "image" ? (
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="relative h-[340px] sm:h-[370px] w-full"
                    >
                      <Image
                        src={current.image!}
                        alt={current.title}
                        fill
                        className="object-cover"
                        priority
                      />

                      {/* Top Bar Glass Pill */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="rounded-lg bg-white/95 border border-purple-200/80 px-3 py-1.5 backdrop-blur-md shadow-md">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{current.telemetry?.node}</span>
                          </div>
                          <div className="text-xs font-mono text-purple-700">
                            {current.telemetry?.metric}
                          </div>
                        </div>

                        <div className="rounded-lg bg-white/95 border border-purple-200/80 px-2.5 py-1 text-xs font-mono text-slate-700 backdrop-blur-md hidden sm:block shadow-md">
                          📍 {current.telemetry?.coords}
                        </div>
                      </div>

                      {/* Radar Hotspot Marker */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                        <span className="absolute h-10 w-10 rounded-full bg-purple-500/40 animate-ping" />
                        <span className="h-4 w-4 rounded-full bg-purple-600 border-2 border-white shadow-[0_0_15px_#A855F7]" />
                      </div>
                    </motion.div>
                  ) : current.type === "diagnostic" ? (
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                      className="p-6 space-y-4 h-full flex flex-col justify-between bg-white"
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-purple-100 pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                              ✦
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                              Gemini 3.8 Flash Diagnostic Synthesis
                            </span>
                          </div>
                          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                            {current.confidence}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="text-xs font-mono text-purple-700 font-semibold">
                            &gt; Cross-correlating IoT Sensor #14 logs with 3 community audio streams:
                          </div>
                          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 text-sm text-slate-800 leading-relaxed font-sans shadow-inner">
                            &ldquo;{current.diagnostic}&rdquo;
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-purple-100 flex items-center justify-between text-xs font-mono text-purple-700">
                        <span>Community Repair Archive:</span>
                        <span className="text-emerald-600 font-bold">{current.similarity}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                      className="p-6 space-y-4 h-full flex flex-col justify-between bg-white"
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-purple-100 pb-3 mb-4">
                          <span className="text-sm font-bold text-slate-900">
                            Twin Scenario Simulator (&ldquo;Test Before Touch&rdquo;)
                          </span>
                          <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            Recommended Strategy
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="rounded-xl bg-purple-50/70 border border-purple-200/80 p-3.5">
                            <span className="text-xs font-mono text-purple-700 uppercase font-semibold">Estimated Cost</span>
                            <div className="text-xl font-bold text-slate-900 font-mono mt-1">
                              {current.optA?.cost}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">vs {current.optB?.cost} (redrill)</div>
                          </div>
                          <div className="rounded-xl bg-purple-50/70 border border-purple-200/80 p-3.5">
                            <span className="text-xs font-mono text-purple-700 uppercase font-semibold">Time to Restore</span>
                            <div className="text-xl font-bold text-slate-900 font-mono mt-1">
                              {current.optA?.time}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">vs {current.optB?.time} downtime</div>
                          </div>
                        </div>

                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
                          <strong>Simulated Impact:</strong> {current.optA?.impact}.
                        </div>
                      </div>

                      <div className="pt-3 border-t border-purple-100 text-xs font-mono text-slate-500 flex items-center justify-between">
                        <span>Hydrological Risk: Zero Contamination</span>
                        <span className="text-purple-700 font-semibold">Approval Ready</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Status Bar in Stage Frame */}
                <div className="p-3.5 bg-purple-50/80 border-t border-purple-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{current.title}</span>
                    <p className="text-xs text-slate-600">{current.subtitle}</p>
                  </div>
                  <span className="rounded-full bg-purple-100 border border-purple-200 px-2.5 py-1 text-xs font-mono text-purple-800 font-medium">
                    {current.badge}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
