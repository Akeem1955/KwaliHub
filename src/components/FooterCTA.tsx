"use client";
import * as React from "react";
import { Button } from "./ui/Button";

export function FooterCTA() {
  return (
    <footer className="w-full bg-white py-20 px-4 sm:px-6 border-t border-purple-100">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Measurable SDG 6 Impact Outcomes & Field Testimonials from AquaTwin Story */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs font-bold text-purple-700 uppercase tracking-widest">
              Humanitarian &amp; Fiscal Outcomes
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Measurable SDG 6 Impact
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Moving water infrastructure from costly failure reactions to predictable longevity across Nigerian communities.
            </p>
          </div>

          {/* 3 Key Impact Metric Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="rounded-2xl border border-purple-200/80 bg-purple-50/50 p-5 text-left flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-bold">
                ⚡
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">4.2x Faster</div>
                <div className="text-xs text-slate-600 font-sans mt-0.5">Response &amp; repair resolution cycles</div>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200/80 bg-purple-50/50 p-5 text-left flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
                ₦
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">₦1.8B+ Saved</div>
                <div className="text-xs text-slate-600 font-sans mt-0.5">In avoided premature pump replacements</div>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200/80 bg-purple-50/50 p-5 text-left flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
                👥
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">86,000+ People</div>
                <div className="text-xs text-slate-600 font-sans mt-0.5">Guaranteed uninterrupted clean water security</div>
              </div>
            </div>
          </div>

          {/* Dual Field Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="rounded-2xl border border-purple-200/80 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                &ldquo;Before WASH-Twin, when a solar borehole broke in our ward, women and children walked 6km to the dry riverbed for weeks. Now our phone reports get recognized immediately, and parts arrive before the pump fails completely.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-purple-100">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-emerald-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  DI
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Danladi Ibrahim</div>
                  <div className="text-[11px] text-purple-700">Lead Scout Coordinator · Kilankwa Ward, Kwali FCT</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200/80 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                &ldquo;The combination of instant fault matching and automated diagnosis cuts our repair turnaround from 4 days to under an hour. We&apos;ve redirected emergency redrilling funds into permanent network expansion.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-purple-100">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  BL
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Engr. Babatunde Lawal</div>
                  <div className="text-[11px] text-purple-700">Chief WASH Operations Officer · FCT RUWASSA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main CTA Island */}
        <div className="rounded-[2.5rem] bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 border border-purple-400/30 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-300/40 bg-white/15 px-3.5 py-1 text-xs font-semibold text-purple-100 backdrop-blur-md">
              Generative WASH-AI Digital Twin Framework
            </span>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Anticipate community impact before physical intervention.
            </h2>

            <p className="text-purple-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Deploy continuous cyber-physical monitoring to replace static paper surveys with live, satellite-synchronized water security.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Button
                className="bg-white !text-purple-950 hover:bg-purple-50 shadow-[0_4px_20px_rgba(255,255,255,0.3)] font-bold text-xs"
                onClick={() => {
                  const el = document.getElementById("portals");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Launch Dual-Portal Preview
              </Button>
              <Button
                className="bg-purple-900/80 text-white hover:bg-purple-800 border border-purple-400/40 text-xs font-semibold shadow-sm"
                onClick={() => {
                  const el = document.getElementById("institutional");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Request Vetting Clearance
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Meta Details */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-6 border-t border-purple-100">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">WASH-Twin</span>
            <span>·</span>
            <span className="text-slate-600">Cyber-Physical Hydrological Research System</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#console" className="hover:text-purple-700 transition-colors">
              GIS Console
            </a>
            <a href="#architecture" className="hover:text-purple-700 transition-colors">
              Core Architecture
            </a>
            <a href="#portals" className="hover:text-purple-700 transition-colors">
              Dual Portals
            </a>
            <a href="#gamification" className="hover:text-purple-700 transition-colors">
              Water Guardians
            </a>
            <a href="#institutional" className="hover:text-purple-700 transition-colors">
              Governance Vetting
            </a>
          </div>

          <div>
            <span className="font-mono text-purple-700 font-semibold">UN SDG 6 Framework Compatible</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
