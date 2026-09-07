"use client";
import * as React from "react";

export function GamificationExplainer() {

  return (
    <section id="gamification" className="scroll-mt-28 w-full bg-white py-24 sm:py-32 px-4 sm:px-6 border-t border-purple-100">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Explanatory Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-800 shadow-sm">
              Grassroots Participation
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              Empowering Citizens Like Google Maps Local Guides
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Traditional WASH surveys fail because rural citizens are treated as passive subjects. Our framework transforms community members into celebrated water guardians who see the real-time ripple effect of their reports.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl border border-purple-200/80 bg-white p-4 shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:border-purple-400 transition-all">
                <div className="text-xs font-bold text-slate-900 mb-1">
                  Effortless Onboarding
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No complex passwords or lengthy forms. Create a verified community reporter profile in under 30 seconds.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-200/80 bg-white p-4 shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:border-purple-400 transition-all">
                <div className="text-xs font-bold text-slate-900 mb-1">
                  Gamified Reputation Tiers
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Earn points, unlock community badges, and receive public recognition on regional watershed leaderboards.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-200/80 bg-white p-4 shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:border-purple-400 transition-all">
                <div className="text-xs font-bold text-slate-900 mb-1">
                  60s Acoustic &amp; Video Evidence
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Record pump rattle, sputtering air pockets, or turbidity so Gemini AI can acoustically diagnose mechanical wear.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-200/80 bg-white p-4 shadow-[0_4px_25px_rgba(124,58,237,0.06)] hover:border-purple-400 transition-all">
                <div className="text-xs font-bold text-slate-900 mb-1">
                  Verified Impact Notifications
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Get alerted when maintenance completes: &ldquo;Your report restored clean water for 340 neighbors.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Gamification Tier Card Showcase */}
          <div className="lg:col-span-6">
            <div className="rounded-[2.5rem] bg-purple-50/50 p-3 sm:p-4 border border-purple-200/80 shadow-[0_12px_45px_rgba(124,58,237,0.08)]">
              <div className="rounded-[2rem] bg-white border border-purple-200/70 p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 font-mono">
                    Community Scout Progression Ladder
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active Scouts: 14,200+
                  </span>
                </div>

                {/* Level 1 */}
                <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center font-bold text-xs">
                      L1
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Community Observer</div>
                      <div className="text-[11px] text-slate-500">First geotagged report &amp; 1-tap photo</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-500">0 - 250 XP</span>
                </div>

                {/* Level 2 */}
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      L2
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">WASH Sentinel</div>
                      <div className="text-[11px] text-indigo-800">5 verified video clips + periodic flow checks</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-indigo-700">251 - 1,000 XP</span>
                </div>

                {/* Level 3 */}
                <div className="rounded-xl border border-purple-200 bg-purple-100/40 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      L3
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Borehole Specialist</div>
                      <div className="text-[11px] text-purple-800">Acoustic vibration clips + turbidity assay</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-700">1,001 - 2,000 XP</span>
                </div>

                {/* Level 6 Water Guardian Elite */}
                <div className="rounded-xl border border-purple-300 bg-gradient-to-r from-purple-100/70 to-indigo-100/60 p-3.5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-600 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      ★ L6
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Water Guardian (Elite Rank)</div>
                      <div className="text-[11px] text-purple-900">Direct dispatch triage clearance &amp; supervisor rank</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-700">2,450+ XP</span>
                </div>

                {/* Badges Ribbon */}
                <div className="pt-2 border-t border-purple-100">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-2 font-semibold">
                    Earnable Community Badges
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                      🔥 7-Day Streak
                    </span>
                    <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                      ⚡ First Responder
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                      💧 Borehole Master
                    </span>
                    <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                      🔍 Quality Hawk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
