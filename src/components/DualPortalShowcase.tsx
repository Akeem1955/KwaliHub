"use client";
import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DualPortalShowcase() {
  const [activeTab, setActiveTab] = useState<"citizen" | "institutional">("citizen");
  const [simStrategy, setSimStrategy] = useState<"A" | "B">("A");
  const [simExecuting, setSimExecuting] = useState(false);
  const [simExecuted, setSimExecuted] = useState(false);

  const handleExecuteSim = () => {
    setSimExecuting(true);
    setTimeout(() => {
      setSimExecuting(false);
      setSimExecuted(true);
    }, 850);
  };

  return (
    <section id="portals" className="scroll-mt-28 w-full bg-white py-24 sm:py-32 px-4 sm:px-6 border-b border-purple-100">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-800 shadow-sm">
            Two Stakeholders · One Closed Feedback Loop
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Dual-Portal Architecture
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Gamified mobile ground-truth collection for citizens, paired with a non-overwhelming decision suite for vetted institutions.
          </p>
        </div>

        {/* Spring Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full border border-purple-200 bg-purple-50/70 p-1.5 shadow-inner">
            <button
              onClick={() => setActiveTab("citizen")}
              className={`relative rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "citizen" ? "text-white" : "text-slate-600 hover:text-purple-700"
              }`}
            >
              {activeTab === "citizen" && (
                <motion.div
                  layoutId="activePortalTab"
                  className="absolute inset-0 rounded-full bg-purple-600 shadow-[0_4px_15px_rgba(168,85,247,0.35)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Community Water Scouts (Mobile)
              </span>
            </button>

            <button
              onClick={() => setActiveTab("institutional")}
              className={`relative rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "institutional" ? "text-white" : "text-slate-600 hover:text-purple-700"
              }`}
            >
              {activeTab === "institutional" && (
                <motion.div
                  layoutId="activePortalTab"
                  className="absolute inset-0 rounded-full bg-purple-600 shadow-[0_4px_15px_rgba(168,85,247,0.35)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2 font-medium">
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                Institutional Suite (Gated Console)
              </span>
            </button>
          </div>
        </div>

        {/* Double-Bezel Hardware Showcase Container */}
        <div className="relative rounded-[2.5rem] bg-purple-50/50 p-3 sm:p-4 border border-purple-200/80 shadow-[0_12px_45px_rgba(124,58,237,0.08)]">
          <div className="overflow-hidden rounded-[2rem] bg-white border border-purple-200/70 p-6 sm:p-10 shadow-sm min-h-[580px]">
            <AnimatePresence mode="wait">
              {activeTab === "citizen" ? (
                /* CITIZEN PORTAL SHOWCASE */
                <motion.div
                  key="citizen-view"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  {/* Left: Persona Context */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 text-xs font-semibold">
                      Community Sentinel Network
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      Instant Onboarding &amp; Visible Community Impact
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Community members onboard in seconds with email and password access. Just like Google Maps Local Guides, citizens earn badge tiers, record 60-second acoustic evidence, and track the exact real-world impact of their reports.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center text-xs font-bold shrink-0">
                          1
                        </div>
                        <p className="text-xs text-slate-600">
                          <strong className="text-slate-900">Badge Levels &amp; XP:</strong> Earn rankings from <em>Community Observer</em> to <em>Level 6 Water Guardian (2,450 XP)</em>.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center text-xs font-bold shrink-0">
                          2
                        </div>
                        <p className="text-xs text-slate-600">
                          <strong className="text-slate-900">Effortless Field Verification:</strong> 1-tap photos, 60s voice notes, and auto-GPS tagging in under 30 seconds.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center text-xs font-bold shrink-0">
                          3
                        </div>
                        <p className="text-xs text-slate-600">
                          <strong className="text-slate-900">Closed-Loop Resolution:</strong> Automated SMS/App alert: &ldquo;Fixed Kwali Solar Pump in 4 hours. Clean water secured for 340 families.&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Phone Frame Mockup */}
                  <div className="lg:col-span-7 flex justify-center">
                    <div className="w-full max-w-[340px] sm:max-w-[360px] rounded-[2.5rem] bg-slate-950 p-3 shadow-2xl border-4 border-purple-200">
                      {/* Phone Screen Core */}
                      <div className="rounded-[2rem] bg-[#07050C] text-white p-5 overflow-hidden relative space-y-4 border border-purple-500/20">
                        {/* Status bar */}
                        <div className="flex justify-between items-center text-xs text-purple-300/80 border-b border-purple-500/20 pb-2">
                          <span>09:41</span>
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            GPS Active
                          </span>
                        </div>

                        {/* Citizen Profile Card */}
                        <div className="rounded-xl bg-[#140E26] border border-purple-500/25 p-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-emerald-400 flex items-center justify-center text-xs font-bold text-white shadow-md">
                              AB
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white">Amina Bello</div>
                              <div className="text-xs text-emerald-400 flex items-center gap-1">
                                ★ Level 6 Water Guardian
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-semibold text-purple-300">2,450 XP</span>
                            <div className="text-[10px] text-emerald-400 font-semibold">Top 3% Scout</div>
                          </div>
                        </div>

                        {/* Badges Streak Strip */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1">
                            🔥 7-Day Streak
                          </span>
                          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                            ⚡ First Responder
                          </span>
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                            💧 Borehole Master
                          </span>
                        </div>

                        {/* 1-Tap Field Action Row */}
                        <div className="bg-[#120B22] p-2.5 rounded-xl border border-purple-500/20 space-y-1.5">
                          <span className="text-[10px] uppercase font-mono text-purple-300 tracking-wider">Effortless Field Verification</span>
                          <div className="grid grid-cols-3 gap-1.5 text-center">
                            <div className="bg-[#1C1236] py-1.5 rounded-lg border border-purple-500/30 text-[10px] text-purple-200 font-medium">
                              📷 1-Tap Snap
                            </div>
                            <div className="bg-[#1C1236] py-1.5 rounded-lg border border-purple-500/30 text-[10px] text-emerald-300 font-medium">
                              🎙 Voice Note
                            </div>
                            <div className="bg-[#1C1236] py-1.5 rounded-lg border border-purple-500/30 text-[10px] text-purple-200 font-medium">
                              📍 Auto GPS Tag
                            </div>
                          </div>
                        </div>

                        {/* Sentinel Geotagged Report Pin */}
                        <div className="rounded-xl bg-[#140E26] border border-purple-500/25 p-3.5 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 flex items-center gap-1">
                              📍 <span>Kilankwa Ward · Station KW-ST01</span>
                            </span>
                            <span className="text-xs text-purple-400 font-mono">8.86° N, 7.02° E</span>
                          </div>

                          {/* 60s Evidence Clip with Waveform */}
                          <div className="rounded-lg bg-[#0B0813] border border-purple-500/20 p-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-md bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center text-xs font-bold">
                                0:42
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-slate-200">60s Audio Evidence</span>
                                <span className="text-xs text-purple-300/80">Pump grinding noise recorded</span>
                              </div>
                            </div>
                            {/* Waveform */}
                            <div className="flex items-end gap-0.5 h-4">
                              <span className="w-1 bg-purple-400 h-2 rounded-full animate-pulse" />
                              <span className="w-1 bg-purple-400 h-4 rounded-full animate-pulse" />
                              <span className="w-1 bg-purple-400 h-3 rounded-full animate-pulse" />
                              <span className="w-1 bg-purple-400 h-1 rounded-full animate-pulse" />
                            </div>
                          </div>
                        </div>

                        {/* Impact Notification Card */}
                        <div className="rounded-xl bg-gradient-to-r from-emerald-950/80 to-[#140E26] border border-emerald-500/30 p-3.5">
                          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                            <span>✓</span>
                            <span>Report Acted Upon by FCT RUWASSA</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-200 leading-snug">
                            Fixed Kwali Solar Pump in 4 hours. <strong>340 community families</strong> have clean water restored.
                          </p>
                          <div className="mt-2 text-xs text-emerald-300 font-mono">
                            +120 Guardian XP Credited
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* INSTITUTIONAL SUITE SHOWCASE */
                <motion.div
                  key="institutional-view"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  className="space-y-6"
                >
                  {/* Top Bar: Gated Clearance Status */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-100 pb-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1 text-xs font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                        Vetted Institutional Clearance · Access Granted
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        WASH-AI Executive Command Console
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Target Region:</span>
                      <span className="font-semibold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-lg">
                        Gurara Catchment Sector 4 (Kwali FCT)
                      </span>
                    </div>
                  </div>

                  {/* Telemetry KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-purple-200/80 bg-purple-50/50 p-4">
                      <div className="text-xs font-semibold text-purple-700 font-mono">Borehole Flow Telemetry</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 font-mono">38.4</span>
                        <span className="text-xs text-slate-500">L / min</span>
                      </div>
                      <div className="mt-1 text-xs text-emerald-700 font-medium">Within nominal threshold</div>
                    </div>

                    <div className="rounded-xl border border-purple-200/80 bg-purple-50/50 p-4">
                      <div className="text-xs font-semibold text-purple-700 font-mono">Water Turbidity (Sensor #14)</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 font-mono">1.2</span>
                        <span className="text-xs text-slate-500">NTU</span>
                      </div>
                      <div className="mt-1 text-xs text-emerald-700 font-medium">Safe drinking status (WHO Standard)</div>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                      <div className="text-xs font-semibold text-amber-800 font-mono">Pressure Differential Anomaly</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-amber-700 font-mono">-34%</span>
                        <span className="text-xs text-amber-800">Drop Detected</span>
                      </div>
                      <div className="mt-1 text-xs text-amber-800 font-medium">Correlated with 3 citizen acoustic uploads</div>
                    </div>
                  </div>

                  {/* Gemini 3.8 Flash Diagnostic Card */}
                  <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                          AI
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          Gemini 3.8 Flash Diagnostic Synthesis
                        </span>
                      </div>
                      <span className="text-xs text-emerald-800 font-mono font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Confidence: 94.2%
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      &ldquo;Cross-analysis of <strong className="text-slate-900">IoT Sensor #14</strong> pressure decline (-34%) with <strong className="text-slate-900">3 citizen audio clips</strong> showing grinding vibration indicates pump impeller cavitation rather than aquifer depletion. Recommended action: divert local supply to Station KW-ST02 and dispatch technician with replacement impeller seal.&rdquo;
                    </p>
                  </div>

                  {/* Digital Twin Simulation Sandbox */}
                  <div className="rounded-2xl border border-purple-200/80 bg-white p-5 space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Digital Twin Scenario Simulation (&ldquo;Test Before Touch&rdquo;)
                        </h4>
                        <p className="text-xs text-slate-500">
                          Simulate practical outcome and budget impact before committing field teams.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-purple-50 p-1 rounded-lg border border-purple-200">
                        <button
                          onClick={() => setSimStrategy("A")}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                            simStrategy === "A" ? "bg-purple-600 text-white shadow-sm" : "text-slate-600 hover:text-purple-700"
                          }`}
                        >
                          Option A: Targeted Repair
                        </button>
                        <button
                          onClick={() => setSimStrategy("B")}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                            simStrategy === "B" ? "bg-purple-600 text-white shadow-sm" : "text-slate-600 hover:text-purple-700"
                          }`}
                        >
                          Option B: Aquifer Redrill
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-purple-100">
                      <div>
                        <span className="text-xs text-purple-700 uppercase tracking-wider font-mono font-semibold">Estimated Cost</span>
                        <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                          {simStrategy === "A" ? "₦280,000" : "₦3,800,000"}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-purple-700 uppercase tracking-wider font-mono font-semibold">Time to Restoration</span>
                        <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                          {simStrategy === "A" ? "18 Hours" : "14 Days"}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-purple-700 uppercase tracking-wider font-mono font-semibold">Population Access</span>
                        <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">
                          {simStrategy === "A" ? "92% Protected" : "64% Disrupted"}
                        </div>
                      </div>
                    </div>

                    {/* Execute Interactive Simulation Button */}
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={handleExecuteSim}
                        disabled={simExecuting}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] transition-all disabled:opacity-75"
                      >
                        {simExecuting ? (
                          <>
                            <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            <span>Calculating Hydrodynamic Flush &amp; Cavitation Pressure...</span>
                          </>
                        ) : simExecuted ? (
                          <span>✓ Simulation Validated: Optimal Path Confirmed (Saved ₦3,520,000)</span>
                        ) : (
                          <span>Execute Digital Twin Simulation ({simStrategy === "A" ? "Option A: ₦280k" : "Option B: ₦3.8M"}) ↗</span>
                        )}
                      </button>

                      {simExecuted && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 font-medium"
                        >
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Digital twin synchronized: Pressure nominal, flow returned to 38.4 L/min. Safe clean water preserved for 340 families.</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
