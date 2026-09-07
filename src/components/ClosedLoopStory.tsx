"use client";
import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const incidentStages = [
  {
    phase: "01",
    time: "03:14 AM",
    stageLabel: "Edge Alert",
    actor: "AquaNet IoT Node #14",
    actorType: "Autonomous Logger",
    badge: "Edge Telemetry Trigger",
    title: "Autonomous Acoustic Cavitation Detection",
    headline: "Sensor #14 detects pressure cavitation at 85m aquifer depth.",
    narration:
      "While the rural community sleeps, the solar borehole pump encounters air pocket cavitation. Line pressure drops by 34% and flow rate falls below nominal thresholds. In standard non-twin environments, this defect goes undetected for up to 8 months until an in-person manual audit.",
    telemetry: "FLOW: 12.2 L/min (-68%) · PRESSURE: 1.4 bar · ANOMALY: Cavitation Detected",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    phase: "02",
    time: "07:15 AM",
    stageLabel: "Scout Evidence",
    actor: "Amina Bello",
    actorType: "Level 6 Water Guardian",
    badge: "Scout Ground Truth",
    title: "Ground Truth Verification via Mobile App",
    headline: "Amina records 60s acoustic audio of pump rattle & turbidity.",
    narration:
      "Arriving at the borehole to collect water for her family, Amina observes sputter and turbidity. She opens the mobile reporting app, records a 60-second audio/video clip of the mechanical grinding, and pins it with GPS accuracy on Google Maps.",
    telemetry: "MEDIA: 60s Audio/Video · GPS: 8.8654° N, 7.0215° E · REPUTATION: 2,450 XP (Top 3%)",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  {
    phase: "03",
    time: "07:16 AM",
    stageLabel: "History Matching",
    actor: "Community Incident Archive",
    actorType: "Historical Repair Database",
    badge: "Past Repair Match",
    title: "Matching Against Known Local Pump Breakdowns",
    headline: "Comparing the breakdown sound against past borehole repairs across Kwali.",
    narration:
      "Instead of sending technicians to guess in the dark, the system matches Amina's recording and sensor logs against past repairs in the area. It recognizes the exact same mechanical grinding that occurred previously at the Kilankwa borehole, identifying an impeller seal failure.",
    telemetry: "PATTERN FOUND: Identical sand abrasion profile · AREA: Kilankwa Hub · VERIFIED: 3 nearby reports",
    badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
  {
    phase: "04",
    time: "07:17 AM",
    stageLabel: "Root-Cause AI",
    actor: "Diagnostic Assistant",
    actorType: "Automated Root-Cause Analysis",
    badge: "Exact Fault Isolated",
    title: "Pinpointing the Single Failing Component",
    headline: "Confirms water is plentiful in the ground and names the exact seal to replace.",
    narration:
      "The diagnostic assistant confirms the underground aquifer is full and stable at 85 meters. The issue is localized to a worn rubber impeller seal. It prescribes a straightforward ₦280,000 seal swap and stops the Water Board team from wasting ₦3,800,000 on an unnecessary redrill.",
    telemetry: "ROOT CAUSE: Impeller Sand Seal · ESTIMATED COST: ₦280,000 · AVOIDED WASTE: ₦3,520,000",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
  },
  {
    phase: "05",
    time: "08:30 AM",
    stageLabel: "Twin Simulation",
    actor: "Water Board Operations Director",
    actorType: "Vetted Institutional Clearance",
    badge: "Pre-Deployment Sandbox",
    title: "Pre-Deployment Scenario Simulation & Authorization",
    headline: "Decision-maker tests the solution in the Digital Twin before spending funds.",
    narration:
      "Logging into the vetted command console, the operations director tests Scenario A vs Scenario B in the digital twin simulator. Projected outcome confirms 92% community water access preserved. The director authorizes the ₦280,000 targeted repair and dispatches the local technician.",
    telemetry: "SIMULATED DOWNTIME: 18 Hours · POPULATION PROTECTED: 92% · CLEARANCE: Approved",
    badgeColor: "bg-cyan-50 text-cyan-800 border-cyan-200",
  },
  {
    phase: "06",
    time: "02:15 PM",
    stageLabel: "Loop Closed",
    actor: "Community Feedback Engine",
    actorType: "Restoration & Guardian Reward",
    badge: "Verified Community Impact",
    title: "Physical Resolution & Community Impact Closure",
    headline: "Clean water restored for 340 families; Amina receives +120 XP.",
    narration:
      "The technician replaces the impeller seal. Sensor #14 confirms flow rate is back to nominal 38.4 L/min. An automated notification buzzes on Amina's phone: 'Report resolved. Kwali Solar Pump restored in 4 hours. Safe clean water secured for 340 families.' Amina earns +120 XP toward her Water Guardian ranking.",
    telemetry: "CLEAN WATER RESTORED: 340 Families · XP CREDITED: +120 · CYCLE TIME: Solved in 11 Hours",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
];

export function ClosedLoopStory() {
  const [currentStage, setCurrentStage] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const stage = incidentStages[currentStage];

  return (
    <section id="narrative" className="scroll-mt-28 w-full bg-white py-24 sm:py-32 px-4 sm:px-8 border-t border-purple-100">
      <div className="mx-auto max-w-5xl space-y-10">
        
        {/* Story Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-semibold text-purple-800 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Incident Lifecycle · Incident #KW-8491
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
            How the Autonomous Feedback Loop Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Follow a real-time incident lifecycle: from a 03:14 AM mechanical cavitation anomaly to vector correlation, Gemini causal diagnosis, virtual sandbox simulation, and verified community restoration in under 180 minutes.
          </p>
        </div>

        {/* Interactive Incident Pipeline Stepper */}
        <div className="flex items-center justify-between overflow-x-auto pb-4 gap-2.5 border-b border-purple-100">
          {incidentStages.map((item, index) => (
            <button
              key={item.phase}
              onClick={() => setCurrentStage(index)}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-medium transition-all shrink-0 ${
                currentStage === index
                  ? "bg-purple-600 text-white shadow-[0_4px_15px_rgba(168,85,247,0.35)] border border-purple-500 font-semibold"
                  : "bg-white text-slate-600 border border-purple-200/80 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <span className="h-5 w-5 rounded-full flex items-center justify-center font-mono text-[11px] font-bold bg-white/20">
                {item.phase}
              </span>
              <div className="flex flex-col text-left">
                <span className="leading-tight">{item.stageLabel}</span>
                <span className="text-[10px] font-mono opacity-80">{item.time}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Incident Stage Display Card */}
        <div className="rounded-[2.5rem] bg-purple-50/50 p-3 sm:p-4 border border-purple-200/80 shadow-[0_12px_45px_rgba(124,58,237,0.08)]">
          <div className="rounded-[2rem] bg-white border border-purple-200/70 p-8 sm:p-12 shadow-sm min-h-[380px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.phase}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="space-y-6"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                      PHASE {stage.phase} // {stage.time}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${stage.badgeColor}`}>
                      {stage.actor} · {stage.actorType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Incident Stage {currentStage + 1} of 6</span>
                  </div>
                </div>

                {/* Main Content */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-tight">
                    {stage.title}: <span className="text-purple-700 font-semibold">{stage.headline}</span>
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                    {stage.narration}
                  </p>
                </div>

                {/* Telemetry Stream Pill */}
                <div className="rounded-xl bg-purple-50/70 border border-purple-200 p-3.5 font-mono text-xs text-slate-800 flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-purple-700 font-bold">&gt; TELEMETRY_CHANNEL: </span>
                    <span className="text-slate-900 font-semibold">{stage.telemetry}</span>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse shrink-0 ml-2" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stepper Navigation Controls */}
            <div className="pt-6 border-t border-purple-100 flex items-center justify-between mt-6">
              <button
                disabled={currentStage === 0}
                onClick={() => setCurrentStage((prev) => Math.max(0, prev - 1))}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← Previous Stage
              </button>

              <button
                disabled={currentStage === incidentStages.length - 1}
                onClick={() => setCurrentStage((prev) => Math.min(incidentStages.length - 1, prev + 1))}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {currentStage === incidentStages.length - 1 ? "Incident Resolved ✓" : "Advance to Next Stage →"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
