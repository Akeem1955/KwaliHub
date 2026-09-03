'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Droplets, Cpu, MapPin, Sparkles, Database, ArrowRight, CheckCircle2,
  AlertCircle, Activity, ShieldCheck, Layers, RefreshCw, BarChart3,
  Globe, Radio, Bell, Users, Wrench, Building2, Landmark, Check,
  ArrowUpRight, FileText, ChevronRight
} from 'lucide-react';

export default function CivicInfrastructurePlatform() {
  const [activeWorkflow, setActiveWorkflow] = useState<number>(0);

  const WORKFLOW_STAGES = [
    {
      id: '01',
      title: 'Geospatial Grounding & Asset Registry',
      tag: 'Google Maps Platform',
      headline: 'Register and geofence community water points across rural wards',
      desc: 'Every rural motorized borehole, solar filtration kiosk, or handpump is mapped with high-precision Google Maps coordinates, catchment population estimates, and baseline aquifer depth.',
      metrics: 'Kwali Pilot: 10 Wards Mapped • 46,000+ Residents Connected',
      icon: MapPin,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: '02',
      title: 'Dual-Stream Telemetry Ingestion',
      tag: 'IoT Telemetry + Citizen GPS',
      headline: 'Continuous mechanical monitoring paired with live citizen crowdsourcing',
      desc: 'Submersible flow meters and optical turbidity sensors stream continuous physical vitals. Concurrently, community residents and local stewards submit geolocated alerts for dirty water, leaks, or dry taps directly via mobile browsers without app installs.',
      metrics: 'Sensor frequency: 60s intervals • Zero-barrier citizen reporting',
      icon: Radio,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      id: '03',
      title: 'Living Semantic Digital Twin',
      tag: 'Cloud SQL PostgreSQL + pgvector',
      headline: 'Dynamic socio-technical representation of the rural water ecosystem',
      desc: 'Relational sensor time series and crowdsourced incident logs are indexed into PostgreSQL alongside 768-dimensional vector embeddings of WHO standards and Nigerian rural water benchmarks, giving the Digital Twin permanent contextual memory.',
      metrics: 'PostgreSQL 17 • Active pgvector extension • Sub-second RAG retrieval',
      icon: Database,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      id: '04',
      title: 'Generative Root-Cause Diagnostics',
      tag: 'Google Gemini 3.8 Flash',
      headline: 'Automated technical failure synthesis replaces slow periodic surveys',
      desc: 'Gemini 3.8 Flash correlates physical sensor dips with citizen complaint clusters (e.g. pressure drops alongside leakage reports), diagnosing the exact mechanical fatigue (such as HDPE riser coupling failure) and generating itemized local-currency work orders.',
      metrics: 'Zero-conjecture structured work orders • Local currency (NGN) costing',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      id: '05',
      title: 'Pre-Implementation Simulation Sandbox',
      tag: 'Predictive Decision Support',
      headline: 'Evaluate impact and financial viability before spending field capital',
      desc: 'Area council engineers and donor directors test proposed interventions in a predictive sandbox over 7, 30, and 90 days. Models project avoided downtime hours, net water gain (liters), and community maintenance reserve payback before dispatching technicians.',
      metrics: 'Verified 94% uptime recovery • Automated feasibility verdicts',
      icon: Cpu,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans antialiased flex flex-col selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Institutional Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900 text-base tracking-tight">
                  Kwali WASH Digital Twin
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                  Area Council Platform
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                Federal Capital Territory, Abuja • Civic Infrastructure Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-gray-600">
            <a href="#framework" className="hover:text-blue-600 transition-colors">Architecture</a>
            <a href="#workflow" className="hover:text-blue-600 transition-colors">How It Operates</a>
            <a href="#pilot" className="hover:text-blue-600 transition-colors">Field Deployment</a>
            <a href="#deployment-models" className="hover:text-blue-600 transition-colors">Institutional Roles</a>
          </nav>

          {/* Primary Action Button */}
          <div className="flex items-center space-x-3">
            <Link
              href="/console"
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all"
            >
              <span>Access Twin Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* HERO SECTION: CIVIC INFRASTRUCTURE INTELLIGENCE */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Problem Framing & Solution */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1 text-xs font-semibold text-gray-700">
                <Landmark className="h-3.5 w-3.5 text-blue-600" />
                <span>Kwali Area Council Municipal WASH Innovation Project</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                Continuous Digital Twin Intelligence for <span className="text-blue-600">Rural Water Security</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Conventional rural water projects suffer a 30–40% breakdown rate within three years because municipal authorities rely on slow annual surveys and static reports. The <strong>Kwali WASH Digital Twin</strong> establishes a closed-loop cyber-physical system fusing low-cost IoT telemetry, Google Maps citizen crowdsourcing, and Google Gemini 3.8 Flash to continuously anticipate failures and simulate interventions before physical field dispatch.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/console"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-all"
                >
                  <span>Open Operational Digital Twin</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#workflow"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Explore Operational Architecture</span>
                </a>
              </div>

              {/* Operational Realities Bar */}
              <div className="pt-4 grid grid-cols-3 gap-3 text-left border-t border-gray-100">
                <div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-gray-900">10 Wards</div>
                  <div className="text-[11px] text-gray-500">Continuous IoT Mesh</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-blue-600">&lt; 24 Hours</div>
                  <div className="text-[11px] text-gray-500">Anomaly Detection</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-emerald-600">Pre-Simulated</div>
                  <div className="text-[11px] text-gray-500">Capital Protection</div>
                </div>
              </div>

            </div>

            {/* Right Col: Live Digital Twin State Monitor */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg space-y-4">
                
                {/* Console header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-gray-900 uppercase">Kwali Digital Twin State</span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">PostgreSQL + pgvector Active</span>
                </div>

                {/* Node Status Box */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800">Target Asset: Bako Community Scheme</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      DEGRADED FLOW (6.2 LPM)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-gray-50 p-2 border border-gray-100">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Flow Rate</div>
                      <div className="font-bold font-mono text-gray-900">6.2 L/min</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2 border border-gray-100">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Quality Index</div>
                      <div className="font-bold font-mono text-gray-900">88 / 100</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2 border border-gray-100">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Turbidity</div>
                      <div className="font-bold font-mono text-gray-900">2.1 NTU</div>
                    </div>
                  </div>
                </div>

                {/* Gemini Diagnostic Dispatch Snippet */}
                <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-900">
                      <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                      <span>Gemini 3.8 Flash Diagnostic Synthesis</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">HIGH PRIORITY</span>
                  </div>
                  <p className="text-xs text-purple-950 leading-relaxed">
                    Correlated a 68% flow reduction with two citizen underground leakage reports. Diagnosed mechanical HDPE riser joint fatigue.
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] font-medium text-purple-900 border-t border-purple-100">
                    <span>Est. Repair: ₦45,000</span>
                    <span className="text-emerald-700 font-bold">Projected Recovery: 94%</span>
                  </div>
                </div>

                {/* Interactive Action Link */}
                <Link
                  href="/console"
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gray-900 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors shadow-xs"
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Launch Pre-Implementation Simulation Sandbox</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* HOW THE CLOSED-LOOP OPERATES */}
      <section id="workflow" className="py-20 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Closed-Loop Operational Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
              The 5-Stage Continuous Decision Cycle
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              How the platform bridges physical hardware, community feedback, and artificial intelligence into an unbroken operational loop.
            </p>
          </div>

          {/* Interactive Steps Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Stage Navigation Buttons */}
            <div className="lg:col-span-5 space-y-3">
              {WORKFLOW_STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isSelected = activeWorkflow === idx;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveWorkflow(idx)}
                    className={`w-full text-left rounded-xl border p-4 transition-all flex items-start space-x-3.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-600'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-gray-400">STAGE {stage.id}</span>
                        <span className="rounded-md bg-gray-100 px-1.5 py-0.2 text-[10px] font-semibold text-gray-600">{stage.tag}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mt-0.5">{stage.title}</h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Detailed Stage Deep-Dive Card */}
            <div className="lg:col-span-7 rounded-2xl border border-gray-200 bg-[#F8F9FA] p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs font-bold font-mono text-blue-700 uppercase">
                  ACTIVE STAGE ARCHITECTURE • {WORKFLOW_STAGES[activeWorkflow].id}
                </span>
                <span className="rounded-full bg-white border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                  {WORKFLOW_STAGES[activeWorkflow].tag}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 leading-snug">
                {WORKFLOW_STAGES[activeWorkflow].headline}
              </h3>

              <p className="text-sm text-gray-700 leading-relaxed">
                {WORKFLOW_STAGES[activeWorkflow].desc}
              </p>

              <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-1 text-xs">
                <div className="font-bold text-gray-900 uppercase tracking-wide text-[10px] text-gray-400">
                  Operational Benchmark
                </div>
                <div className="font-medium text-gray-800">
                  {WORKFLOW_STAGES[activeWorkflow].metrics}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Fully integrated in live digital twin</span>
                <Link
                  href="/console"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  <span>Test this stage in Console</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PILOT FIELD VALIDATION: KWALI AREA COUNCIL */}
      <section id="pilot" className="py-20 border-b border-gray-200 bg-[#F8F9FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Field Evidence & Pilot Results
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Kwali Area Council, Abuja Deployment Results
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Continuous monitoring across 10 rural settlements covering 46,000+ residents
              </p>
            </div>

            <Link
              href="/console"
              className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>Inspect Live Geospatial Markers</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Case 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Bako Settlement</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  FLOW DEGRADATION
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Pump throughput dropped from 19.5 to 6.2 L/min due to underground riser leakage. Gemini drafted an immediate coupling overhaul; digital twin projected 94% recovery.
              </p>
              <div className="pt-2 border-t border-gray-100 text-xs font-mono text-emerald-700 font-semibold">
                Downtime avoided: 18 days • Cost: ₦45,000
              </div>
            </div>

            {/* Case 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Sheda Filtration Kiosk</span>
                <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                  TURBIDITY ANOMALY
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Post-rainfall storm runoff elevated turbidity to 8.4 NTU. Gemini triggered a shock chlorination protocol and a reinforced 1.5m elevated sanitary apron.
              </p>
              <div className="pt-2 border-t border-gray-100 text-xs font-mono text-emerald-700 font-semibold">
                Pathogen risk drop: 82% • Cost: ₦38,000
              </div>
            </div>

            {/* Case 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Kwali Central Scheme</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  NOMINAL (85/100)
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Motorized solar borehole operating stably at 19.5 L/min with safe 1.8 NTU. Serving 14,500 residents with continuous maintenance escrow reserves.
              </p>
              <div className="pt-2 border-t border-gray-100 text-xs font-mono text-emerald-700 font-semibold">
                Uptime: 99.1% • 0 unresolved citizen tickets
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* INSTITUTIONAL DEPLOYMENT ROLES */}
      <section id="deployment-models" className="py-20 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Institutional Governance
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
              How Rural Water Stakeholders Collaborate
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              The Digital Twin provides tailored interfaces for every tier of the rural water management hierarchy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Stakeholder 1 */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Landmark className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Area Council Water Engineers
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gain an institutional command center across all rural wards. Receive automated Gemini repair protocols and test budget feasibility before committing public maintenance funds.
              </p>
              <ul className="text-xs text-gray-500 space-y-1.5 pt-2 border-t border-gray-200">
                <li>• Unified LGA geospatial map</li>
                <li>• Automated technical work orders</li>
                <li>• Pre-implementation sandbox</li>
              </ul>
            </div>

            {/* Stakeholder 2 */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Community Water Stewards
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Local kiosk operators and village committees monitor daily flow and manage maintenance reserve funds, receiving immediate notifications when sensors flag anomalies.
              </p>
              <ul className="text-xs text-gray-500 space-y-1.5 pt-2 border-t border-gray-200">
                <li>• Zero-app mobile incident alerts</li>
                <li>• Escrow reserve tracking</li>
                <li>• Local technician dispatch log</li>
              </ul>
            </div>

            {/* Stakeholder 3 */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Development Partners & NGOs
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                UNICEF, RUWASSA, and bilateral donors access real-time infrastructure auditability to ensure investments remain functional long after grant project closeout.
              </p>
              <ul className="text-xs text-gray-500 space-y-1.5 pt-2 border-t border-gray-200">
                <li>• Verified uptime percentage audit</li>
                <li>• Public health risk metrics</li>
                <li>• Multi-scheme performance reports</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 text-center space-y-5 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 mx-auto">
              <Cpu className="h-6 w-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Access the Kwali WASH Digital Twin Operational Console
            </h2>

            <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              Explore the live Google Maps telemetry layers, submit crowdsourced citizen observations, and evaluate repair scenarios in the pre-implementation simulation sandbox.
            </p>

            <div className="pt-2">
              <Link
                href="/console"
                className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-all"
              >
                <span>Launch Operational Console</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL FOOTER */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-12 text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  Kwali WASH Digital Twin
                </p>
                <p className="text-[11px] text-gray-400">
                  Federal Capital Territory, Abuja • Civic Infrastructure Intelligence Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs font-medium">
              <Link href="/console" className="text-blue-600 hover:underline font-semibold">
                Live Console
              </Link>
              <a href="#framework" className="text-gray-600 hover:text-gray-900">
                Architecture
              </a>
              <a href="#workflow" className="text-gray-600 hover:text-gray-900">
                Operational Loop
              </a>
              <a href="#pilot" className="text-gray-600 hover:text-gray-900">
                Pilot Results
              </a>
              <a href="#deployment-models" className="text-gray-600 hover:text-gray-900">
                Stakeholders
              </a>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
            <p>© 2026 Kwali Area Council Rural Water & Sanitation Program. Continuous Cyber-Physical Water Security.</p>
            <div className="flex items-center space-x-4">
              <span>Google Gemini 3.8 Flash</span>
              <span>•</span>
              <span>Google Maps Platform</span>
              <span>•</span>
              <span>Cloud SQL PostgreSQL 17 + pgvector</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
