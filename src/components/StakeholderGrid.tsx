"use client";
import * as React from "react";
import { motion } from "framer-motion";

const technologies = [
  { name: "IoT Sensor Mesh", label: "Hardware Telemetry" },
  { name: "Sentinel-2 GIS", label: "Geospatial Catchment" },
  { name: "PostgreSQL", label: "Relational Storage" },
  { name: "Past Case Memory", label: "Solved Repair Archive" },
  { name: "Diagnostic AI", label: "Smart Root-Cause Engine" },
  { name: "Digital Twin State", label: "Cyber-Physical Sync" },
  { name: "UN SDG 6", label: "Clean Water Standard" },
];

export function StakeholderGrid() {
  return (
    <section className="w-full bg-white py-24 sm:py-32 px-4 sm:px-8 border-y border-purple-100">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-semibold text-purple-800 shadow-sm">
              Unified Cyber-Physical Core
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.12]">
              Connected with <br />
              every <span className="text-purple-600">stakeholder</span>.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
              One unified digital representation. Citizens, IoT edge nodes, field NGOs, and state water boards / Water Board plug into one synchronized twin that eliminates blind spots.
            </p>

            {/* Quick Live Telemetry Strip from AquaTwin Story */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 max-w-md font-mono text-xs">
              <div className="rounded-xl bg-purple-50/70 border border-purple-200/80 p-3">
                <div className="text-[11px] text-purple-700 uppercase tracking-wider font-semibold">Borehole Uptime</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">98.4%</div>
                <div className="text-[10px] text-emerald-600 font-medium">↑ +14.2% vs baseline</div>
              </div>
              <div className="rounded-xl bg-purple-50/70 border border-purple-200/80 p-3">
                <div className="text-[11px] text-purple-700 uppercase tracking-wider font-semibold">Indexed Reports</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">14,200+</div>
                <div className="text-[10px] text-purple-600 font-medium">Community Repair Archive</div>
              </div>
              <div className="rounded-xl bg-purple-50/70 border border-purple-200/80 p-3">
                <div className="text-[11px] text-purple-700 uppercase tracking-wider font-semibold">Triage Cycle</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">&lt; 3 Hours</div>
                <div className="text-[10px] text-emerald-600 font-medium">Zero-lag dispatch</div>
              </div>
              <div className="rounded-xl bg-purple-50/70 border border-purple-200/80 p-3">
                <div className="text-[11px] text-purple-700 uppercase tracking-wider font-semibold">Active Hubs</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">42 Hubs</div>
                <div className="text-[10px] text-purple-600 font-medium">Gurara Catchment</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#portals"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(168,85,247,0.25)] hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                Explore Dual Portals ↗
              </a>
              <a
                href="#institutional"
                className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 text-xs font-semibold text-purple-900 shadow-sm hover:bg-purple-100 hover:border-purple-300 transition-all"
              >
                Vetting Policy
              </a>
            </div>
          </div>

          {/* Right Column: Spatial Artifact Arrangement */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Artifact 1: IoT Hardware Telemetry */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-purple-200/80 bg-white p-5 shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] space-y-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-700">&gt; HARDWARE_NODE_04</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="font-mono text-xs text-slate-800 bg-purple-50/70 p-3 rounded-xl border border-purple-200/70 space-y-1">
                <div>FLOW: <span className="font-bold text-slate-900">38.4 L/min (Nominal)</span></div>
                <div>TURBIDITY: <span className="font-bold text-emerald-700">1.2 NTU (WHO Safe)</span></div>
                <div>BATTERY: <span className="font-bold text-purple-700">98% (Solar Synchronized)</span></div>
              </div>
              <p className="text-xs text-slate-600">Continuous telemetry stream syncing every 60 seconds with digital twin.</p>
            </motion.div>

            {/* Artifact 2: Community Water Scout */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-purple-200/80 bg-white p-5 shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] space-y-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">📍 Community Water Scout</span>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Level 6 Guardian
                </span>
              </div>
              <div className="text-xs text-slate-800 bg-purple-50/70 p-3 rounded-xl border border-purple-200/70">
                <div className="font-bold text-slate-900">Amina Bello · Kilankwa Ward</div>
                <div className="text-xs text-purple-700 mt-1 font-medium">60s Audio evidence attached · 2,450 XP (Top 3% Scout)</div>
              </div>
              <p className="text-xs text-slate-600">Verified ground truth pin auto-correlated with sensor mesh.</p>
            </motion.div>

            {/* Artifact 3: Community Knowledge Archive */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-purple-200/80 bg-white p-5 shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] space-y-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">📚 Local Repair Archive</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Direct Match</span>
              </div>
              <div className="text-xs text-slate-800 bg-purple-50/70 p-3 rounded-xl border border-purple-200/70 space-y-1">
                <div className="font-semibold text-slate-900">INCIDENT ID: #KW-8491</div>
                <div className="text-emerald-700 font-medium">PATTERN: Known Sand Abrasion Issue</div>
                <div className="text-slate-600">REPORTS: 3 nearby community confirmations</div>
              </div>
              <p className="text-xs text-slate-600">Automatically matched to 14 solved repairs across Kwali Area Council.</p>
            </motion.div>

            {/* Artifact 4: Root-Cause Diagnosis */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-purple-200/80 bg-white p-5 shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)] space-y-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900">✦ Root-Cause Diagnosis</span>
                <span className="text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full">
                  Exact Part Found
                </span>
              </div>
              <div className="text-xs text-slate-800 bg-purple-50/70 p-3 rounded-xl border border-purple-200/70 space-y-1">
                <div className="text-xs text-slate-900 font-bold">Diagnosed Fix:</div>
                <div className="text-xs text-slate-600">Replace impeller seal (₦280k). Saved ₦3,520,000 vs redrilling.</div>
              </div>
              <p className="text-xs text-slate-600">Validated in pre-action sandbox prior to field technician dispatch.</p>
            </motion.div>

          </div>

        </div>

        {/* Bottom Minimalist Technology Pill Strip */}
        <div className="mt-16 pt-8 border-t border-purple-100">
          <div className="text-center text-xs font-mono text-purple-700 uppercase tracking-widest mb-6 font-semibold">
            Underlying Cyber-Physical Infrastructure
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-2 rounded-xl border border-purple-200/80 bg-purple-50/60 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                <span className="font-bold text-slate-900">{tech.name}</span>
                <span className="text-xs text-purple-700">· {tech.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
