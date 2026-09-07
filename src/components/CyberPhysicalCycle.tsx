"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function CyberPhysicalCycle() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="architecture" className="scroll-mt-28 w-full bg-white py-24 sm:py-32 px-4 sm:px-6 border-y border-purple-100">
      <div className="mx-auto max-w-6xl">
        {/* Section Header - Layman Centered */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-800 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
            From Breakdown to Flowing Water
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            How We Keep Clean Water Flowing
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From the first sound of pump trouble to clean water in community taps, resolved in under 4 hours without wasted funds.
          </p>
        </div>

        {/* 6-Step Process Cards with Clear Visuals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* STAGE 01 */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl bg-white border border-purple-200/80 p-5 flex flex-col justify-between hover:border-purple-400 transition-all shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                  STEP 01
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Early Warning
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                Catching Trouble Early
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Smart sound sensors and local water scouts notice when a pump begins to sputter, alerting the repair team before taps run dry.
              </p>

              {/* Clear Visual 1: Acoustic Warning & Phone Alert */}
              <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-200/70 space-y-2.5 mb-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-purple-900">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                    Borehole Sound Monitor
                  </span>
                  <span className="text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full font-medium text-[10px]">
                    Abnormal Noise
                  </span>
                </div>

                {/* Animated Waveform Visual */}
                <div className="h-9 w-full bg-white rounded-lg border border-purple-100 px-3 flex items-center justify-between gap-1">
                  {[40, 55, 30, 45, 95, 80, 100, 75, 40, 35, 60, 45].map((height, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full ${
                        height > 70 ? "bg-amber-500" : "bg-purple-400"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <span className="text-purple-600 font-bold">📱 Scout:</span> Amina logged 60s audio
                  </span>
                  <span className="text-emerald-700 font-medium">Auto-sent</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100 text-xs text-purple-800 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Stops sudden water shutoffs
              </span>
              <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </motion.div>

          {/* STAGE 02 */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl bg-white border border-purple-200/80 p-5 flex flex-col justify-between hover:border-purple-400 transition-all shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                  STEP 02
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-800 border-indigo-200 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Past Knowledge
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                Matching Past Solved Fixes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Instead of workers guessing blindly, the system checks previous repairs across the area to instantly find what worked before.
              </p>

              {/* Clear Visual 2: Pattern Matcher */}
              <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-200/70 space-y-2.5 mb-2">
                <div className="text-[11px] font-semibold text-indigo-900 flex items-center justify-between">
                  <span>Community Repair History</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-medium">
                    Direct Match
                  </span>
                </div>

                <div className="bg-white rounded-lg border border-indigo-100 p-2 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">Current Issue:</span>
                    <span className="font-semibold text-slate-900">Rattling Noise + Sputter</span>
                  </div>
                  <div className="h-px bg-indigo-100 w-full" />
                  <div className="flex items-center justify-between text-emerald-800 font-semibold">
                    <span className="text-slate-500 font-normal">Identified Fix:</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Impeller Sand Seal
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-indigo-700 font-medium text-center bg-indigo-100/60 py-1 rounded-md">
                  Matches 14 successfully solved pumps in Kwali
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100 text-xs text-purple-800 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> No trial-and-error visits
              </span>
              <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </motion.div>

          {/* STAGE 03 */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl bg-white border border-purple-200/80 p-5 flex flex-col justify-between hover:border-purple-400 transition-all shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                  STEP 03
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-purple-50 text-purple-800 border-purple-200 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  Remote Check
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                Checking the Pump Remotely
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Water leaders check water depth, pressure, and flow speed on screen, saving hours of travel across unpaved rural roads.
              </p>

              {/* Clear Visual 3: Live Flow & Water Level Gauge */}
              <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-200/70 space-y-2.5 mb-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-purple-900">
                  <span>Live Borehole Status</span>
                  <span className="text-purple-700 font-normal text-[10px]">No travel needed</span>
                </div>

                <div className="bg-white rounded-lg border border-purple-100 p-2.5 space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] font-medium text-slate-600 mb-1">
                      <span>Underground Water Table</span>
                      <span className="text-emerald-700 font-semibold">85m (Full & Safe)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-[85%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-medium text-slate-600 mb-1">
                      <span>Water Flow at Taps</span>
                      <span className="text-amber-700 font-semibold">Dipping (14 L/min)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[38%]" />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-600 flex items-center justify-between font-medium">
                  <span className="text-purple-700">● Live Satellite Feed</span>
                  <span>Solar Pump: Online</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100 text-xs text-purple-800 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Zero wasted travel time
              </span>
              <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </motion.div>

          {/* STAGE 04 */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl bg-white border border-purple-200/80 p-5 flex flex-col justify-between hover:border-purple-400 transition-all shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                  STEP 04
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-600" />
                  Exact Cause
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                Pinpointing the Broken Part
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                The smart assistant proves the underground aquifer has plenty of water and names the single worn-out seal to replace.
              </p>

              {/* Clear Visual 4: Component Inspection Breakdown */}
              <div className="bg-fuchsia-50/50 rounded-xl p-3 border border-fuchsia-200/70 space-y-2 mb-2">
                <div className="text-[11px] font-semibold text-fuchsia-950 flex items-center justify-between">
                  <span>Part-by-Part Inspection</span>
                  <span className="text-[10px] text-fuchsia-700 font-normal">Component Test</span>
                </div>

                <div className="bg-white rounded-lg border border-fuchsia-100 p-2 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Solar Motor & Power:</span>
                    <span className="text-emerald-700 font-semibold text-[10px]">✓ Working fine</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Aquifer Water Level:</span>
                    <span className="text-emerald-700 font-semibold text-[10px]">✓ Full (No drought)</span>
                  </div>
                  <div className="flex items-center justify-between bg-amber-50 -mx-1 px-1 py-0.5 rounded border border-amber-200/70">
                    <span className="text-slate-900 font-medium">Impeller Sand Seal:</span>
                    <span className="text-amber-800 font-bold text-[10px]">⚠️ Worn Rubber</span>
                  </div>
                </div>

                <div className="text-[10px] bg-white text-slate-700 font-medium p-1.5 rounded-lg border border-fuchsia-100 text-center">
                  💡 <span className="text-purple-800 font-bold">Solution:</span> Replace 50mm seal (Do not redrill)
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100 text-xs text-purple-800 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Buy only the right part
              </span>
              <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </motion.div>

          {/* STAGE 05 */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl bg-white border border-purple-200/80 p-5 flex flex-col justify-between hover:border-purple-400 transition-all shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                  STEP 05
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Save Money
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                Testing Fix Before Spending Money
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Before spending public or community funds, we simulate the repair on computer to confirm it will work, stopping wasteful contracts.
              </p>

              {/* Clear Visual 5: Cost & Time Comparison */}
              <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-200/70 space-y-2 mb-2">
                <div className="text-[11px] font-semibold text-amber-950 flex items-center justify-between">
                  <span>Simulated Repair Options</span>
                  <span className="text-emerald-700 font-bold text-[10px]">Best Choice Clear</span>
                </div>

                <div className="space-y-1.5">
                  {/* Option A */}
                  <div className="bg-white rounded-lg p-2 border-2 border-emerald-500 flex items-center justify-between text-[11px]">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <span className="text-emerald-600">✓</span> Replace Seal Ring
                      </div>
                      <div className="text-[10px] text-slate-500">Fixed in 4 Hours</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-700">₦280,000</div>
                      <div className="text-[9px] font-semibold text-emerald-600 uppercase">Recommended</div>
                    </div>
                  </div>

                  {/* Option B */}
                  <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-200 flex items-center justify-between text-[11px] opacity-75">
                    <div>
                      <div className="text-slate-700 line-through text-[10px]">Drill Brand New Borehole</div>
                      <div className="text-[9px] text-rose-600">Takes 3 Weeks</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-slate-500 line-through text-[10px]">₦3,800,000</div>
                      <div className="text-[9px] text-rose-600 font-semibold">Avoided Waste</div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-900 font-bold bg-emerald-100/70 py-1 px-2 rounded-md text-center">
                  ₦3,520,000 Community Funds Saved
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100 text-xs text-purple-800 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Stops contractor overbilling
              </span>
              <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </motion.div>

          {/* STAGE 06 */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.36, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl bg-white border border-purple-200/80 p-5 flex flex-col justify-between hover:border-purple-400 transition-all shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                  STEP 06
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Water Restored
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                Water Flowing & Confirmed
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                A local technician arrives with the exact part, repairs the pump in 4 hours, and local residents confirm clean water is running.
              </p>

              {/* Clear Visual 6: Water Flowing & Community Verification */}
              <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-200/70 space-y-2 mb-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-950">
                  <span>Community Verified</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    100% Flowing
                  </span>
                </div>

                <div className="bg-white rounded-lg border border-emerald-100 p-2.5 text-center space-y-1">
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    340 Families
                  </div>
                  <div className="text-[11px] font-medium text-emerald-700 flex items-center justify-center gap-1">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Clean Drinking Water Restored
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-600 px-1 pt-0.5">
                  <span className="font-medium text-purple-800">Scout Amina verified tap</span>
                  <span className="text-emerald-700 font-bold">+120 Points</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100 text-xs text-purple-800 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Safe drinking water in 4 hours
              </span>
              <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
