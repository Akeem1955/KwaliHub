"use client";
import * as React from "react";
import { useState } from "react";
import { Button } from "./ui/Button";

export function InstitutionalGating() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="institutional" className="scroll-mt-28 w-full bg-white py-24 sm:py-32 px-4 sm:px-6 border-t border-purple-100">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2.5rem] bg-purple-50/50 p-3 sm:p-4 border border-purple-200/80 shadow-[0_12px_45px_rgba(124,58,237,0.08)]">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#1E1138] via-[#2A1550] to-[#160B2C] border border-purple-500/30 text-white p-8 sm:p-14 overflow-hidden relative shadow-2xl">
            {/* Background mesh lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Requirements & Vetting */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-semibold text-purple-300">
                  <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                  Vetted Governance Portal
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Institutional Access for Utilities, NGOs & Ministries
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed">
                  To safeguard critical rural water infrastructure and maintain operational integrity, all institutional accounts undergo formal vetting and approval by regional platform coordinators before simulation clearance is granted.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Direct access to the Gemini 3.8 Flash causal simulation sandbox</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Continuous IoT sensor telemetry with automated cavitation alerts</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Closed-loop community notification dispatch clearance</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Application Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-purple-500/30 bg-[#120B22]/95 p-6 shadow-xl backdrop-blur-md">
                  {submitted ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                        ✓
                      </div>
                      <h4 className="text-base font-semibold text-white">Application Received</h4>
                      <p className="text-xs text-slate-300">
                        Our governance team will review your organization&apos;s credentials and respond within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSubmitted(true);
                      }}
                      className="space-y-4"
                    >
                      <h3 className="text-sm font-semibold text-white">
                        Request Institutional Clearance
                      </h3>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Organization Name
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Federal Ministry of Water Resources / Water Board / WaterAid Nigeria"
                          className="w-full rounded-lg border border-purple-400/30 bg-[#180E2E] px-3.5 py-2.5 text-xs text-white placeholder:text-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Institutional Email
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="director@waterboard.gov.ng or wash@ngo.org.ng"
                          className="w-full rounded-lg border border-purple-400/30 bg-[#180E2E] px-3.5 py-2.5 text-xs text-white placeholder:text-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Primary Operating Watershed / Region
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Kwali Area Council FCT / Gurara Watershed (UTM 32N)"
                          className="w-full rounded-lg border border-purple-400/30 bg-[#180E2E] px-3.5 py-2.5 text-xs text-white placeholder:text-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors"
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full !py-2.5 !text-xs font-semibold shadow-md"
                      >
                        Submit for Vetting Review ↗
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
