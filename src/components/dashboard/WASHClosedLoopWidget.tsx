"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";

interface Stage {
  id: number;
  number: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  badge: string;
  metric: string;
  icon: string;
  status: "ACTIVE" | "VERIFIED" | "SYNCHRONIZED";
}

const STAGES: Stage[] = [
  {
    id: 1,
    number: "01",
    name: "Data Collection",
    shortDesc: "Low-cost IoT sensors + citizen Google Maps reports",
    fullDesc: "Continuous telemetry captures borehole flow rates, water quality, and acoustic vibration while scouts log waste dumps and drainage blockages via location services.",
    badge: "IoT + Community",
    metric: "13 Schemes · 7 Reports",
    icon: "📡",
    status: "ACTIVE",
  },
  {
    id: 2,
    number: "02",
    name: "Digital Representation",
    shortDesc: "PostgreSQL with pgvector knowledge retrieval",
    fullDesc: "Community-specific WASH data organized and vectorized, enabling the Digital Twin to maintain a continuously updated digital representation of the Kwali environment.",
    badge: "pgvector 0.8.5",
    metric: "1536-dim Embeddings",
    icon: "🗄️",
    status: "SYNCHRONIZED",
  },
  {
    id: 3,
    number: "03",
    name: "AI Interventions",
    shortDesc: "Google Gemini 3.8 Flash generative analysis",
    fullDesc: "Gemini 3.8 Flash evaluates evolving telemetry patterns, identifies emerging mechanical and sanitary risks, and formulates context-specific intervention strategies.",
    badge: "Gemini 3.8 Flash",
    metric: "3 Dynamic Strategies",
    icon: "🧠",
    status: "ACTIVE",
  },
  {
    id: 4,
    number: "04",
    name: "Twin Simulation",
    shortDesc: "Pre-implementation evaluation before physical action",
    fullDesc: "Proposed interventions evaluated through the Digital Twin sandbox before spending public capital, enabling decision-makers and communities to compare potential effects.",
    badge: "Decision Support",
    metric: "Pre-Flight Sandbox",
    icon: "⚗️",
    status: "ACTIVE",
  },
  {
    id: 5,
    number: "05",
    name: "Implementation",
    shortDesc: "Water Board technician dispatches & volunteer brigades",
    fullDesc: "Prioritized work orders dispatched to government repair crews and community clean-up volunteers with precise GPS coordinates and equipment specifications.",
    badge: "Field Operations",
    metric: "Dispatched Work Orders",
    icon: "🔧",
    status: "ACTIVE",
  },
  {
    id: 6,
    number: "06",
    name: "Continuous Updating",
    shortDesc: "Closing the dynamic feedback loop",
    fullDesc: "Post-repair sensor readings and scout audits feed back into the Digital Twin, verifying recovery and sustaining an adaptive, responsive WASH ecosystem.",
    badge: "Closed Loop",
    metric: "Feedback Sustained",
    icon: "🔄",
    status: "SYNCHRONIZED",
  },
];

export function WASHClosedLoopWidget({ isDark }: { isDark: boolean }) {
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const activeStage = STAGES.find((s) => s.id === selectedStage) || STAGES[0];

  return (
    <div
      className={`rounded-[26px] p-6 sm:p-7 border transition-all duration-300 ${
        isDark
          ? "bg-[#071528]/90 border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
          : "bg-white border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                isDark
                  ? "bg-[#1fcfab]/10 border-[#1fcfab]/30 text-[#1fcfab]"
                  : "bg-purple-50 border-purple-200 text-purple-700"
              }`}
            >
              Generative WASH-AI Framework
            </span>
            <span className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>•</span>
            <span className={`text-xs font-mono ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Dynamic Decision-Support Cycle
            </span>
          </div>
          <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            The 6-Stage Closed-Loop Feedback Cycle
          </h3>
        </div>

        <Link
          href="/institutional/simulation"
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border self-start sm:self-auto transition-all ${
            isDark
              ? "bg-[#1fcfab]/15 border-[#1fcfab]/30 text-[#1fcfab] hover:bg-[#1fcfab]/25"
              : "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 font-bold"
          }`}
        >
          Evaluate in Sandbox →
        </Link>
      </div>

      {/* Horizontal Interactive Stage Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
        {STAGES.map((s) => {
          const isSelected = selectedStage === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedStage(s.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? isDark
                    ? "bg-[#1fcfab]/15 border-[#1fcfab]/50 shadow-md shadow-[#1fcfab]/10"
                    : "bg-purple-50 border-purple-400 shadow-md shadow-purple-600/10"
                  : isDark
                  ? "bg-white/3 border-white/6 hover:bg-white/6 hover:border-white/12"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-base">{s.icon}</span>
                <span
                  className={`font-mono text-[10px] font-bold ${
                    isSelected
                      ? isDark ? "text-[#1fcfab]" : "text-purple-700"
                      : isDark ? "text-white/40" : "text-slate-400"
                  }`}
                >
                  {s.number}
                </span>
              </div>

              <p
                className={`text-xs font-bold leading-tight truncate ${
                  isSelected
                    ? isDark ? "text-white" : "text-slate-900"
                    : isDark ? "text-white/70" : "text-slate-700"
                }`}
              >
                {s.name}
              </p>

              <span
                className={`text-[9px] font-mono mt-1 block truncate ${
                  isSelected
                    ? isDark ? "text-[#1fcfab]" : "text-purple-600 font-bold"
                    : isDark ? "text-white/40" : "text-slate-500"
                }`}
              >
                {s.badge}
              </span>

              {/* Active Indicator Underline */}
              {isSelected && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${
                    isDark ? "bg-[#1fcfab]" : "bg-purple-600"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Stage Detail Card */}
      <div
        className={`mt-4 p-4 sm:p-5 rounded-2xl border transition-colors ${
          isDark
            ? "bg-white/3 border-white/8 text-white"
            : "bg-slate-50/80 border-slate-200 text-slate-800"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{activeStage.icon}</span>
            <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Stage {activeStage.number}: {activeStage.name}
            </h4>
            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isDark
                  ? "bg-[#1fcfab]/15 text-[#1fcfab] border-[#1fcfab]/30"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              {activeStage.status}
            </span>
          </div>

          <span className={`text-[11px] font-mono ${isDark ? "text-white/60" : "text-slate-600 font-medium"}`}>
            Live Status: {activeStage.metric}
          </span>
        </div>

        <p className={`text-xs leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"}`}>
          {activeStage.fullDesc}
        </p>
      </div>
    </div>
  );
}
