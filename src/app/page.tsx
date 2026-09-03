'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Droplets, Cpu, MapPin, Sparkles, Database, ArrowRight, CheckCircle2,
  AlertCircle, Activity, ShieldCheck, Layers, RefreshCw, BarChart3,
  ExternalLink, ChevronRight, Terminal, Globe
} from 'lucide-react';

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  const FEEDBACK_STEPS = [
    {
      step: '01',
      title: 'Dual Data Collection',
      badge: 'Edge IoT + Citizen Science',
      desc: 'Low-cost IoT sensors continuously stream infrastructure health metrics (flow rate, pH, turbidity, pressure), while a web-based community reporting platform with Google Maps and location services captures ground-truth citizen observations.',
      color: 'border-blue-500 bg-blue-50/40 text-blue-900',
      icon: Droplets,
    },
    {
      step: '02',
      title: 'Digital Representation',
      badge: 'PostgreSQL + pgvector',
      desc: 'Community-specific WASH telemetry and historical records are organized and semantically indexed in PostgreSQL with pgvector, maintaining an evolving, high-fidelity digital representation of the rural water ecosystem.',
      color: 'border-emerald-500 bg-emerald-50/40 text-emerald-900',
      icon: Database,
    },
    {
      step: '03',
      title: 'Generative AI Engine',
      badge: 'Google Gemini 3.8 Flash',
      desc: 'Gemini 3.8 Flash analyzes the evolving multi-source data stream, identifies hidden mechanical or biological degradation patterns, and correlates sensor dips with crowdsourced citizen complaints.',
      color: 'border-purple-500 bg-purple-50/40 text-purple-900',
      icon: Sparkles,
    },
    {
      step: '04',
      title: 'Contextual Interventions',
      badge: 'Structured Decision Protocol',
      desc: 'Rather than generic advice, the system generates concrete, localized intervention plans with itemized steps, material bills of quantities, local currency budget estimates, and field technician dispatch orders.',
      color: 'border-amber-500 bg-amber-50/40 text-amber-900',
      icon: Layers,
    },
    {
      step: '05',
      title: 'Pre-Implementation Sandbox',
      badge: 'What-If Impact Forecasting',
      desc: 'Proposed interventions are tested inside the Digital Twin before physical deployment, projecting 7-, 30-, and 90-day trajectory curves for water yield gains, downtime reduction, and community maintenance reserve viability.',
      color: 'border-indigo-500 bg-indigo-50/40 text-indigo-900',
      icon: Cpu,
    },
    {
      step: '06',
      title: 'Continuous Feedback Cycle',
      badge: 'Self-Updating Twin',
      desc: 'Following field intervention, updated sensor feeds and resolved citizen reports dynamically refresh the digital twin state, closing the learning loop and refining future predictive accuracy.',
      color: 'border-teal-500 bg-teal-50/40 text-teal-900',
      icon: RefreshCw,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans antialiased flex flex-col selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Google-style Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 text-base tracking-tight">
                  WASH-AI Digital Twin
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                  Research Framework
                </span>
              </div>
            </div>
          </div>

          {/* Quick Section Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#abstract" className="hover:text-blue-600 transition-colors">Abstract</a>
            <a href="#feedback-cycle" className="hover:text-blue-600 transition-colors">Closed-Loop Model</a>
            <a href="#architecture" className="hover:text-blue-600 transition-colors">Google Tech Stack</a>
            <a href="#pilot" className="hover:text-blue-600 transition-colors">Kwali Pilot</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <Link
              href="/console"
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              <span>Launch Twin Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mx-auto max-w-4xl text-center space-y-6">
            
            {/* Tag chip */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-medium text-blue-800">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Google Gemini 3.8 Flash • PostgreSQL pgvector • Google Maps Platform</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
              Continuous Socio-Technical Monitoring & Dynamic Decision Support for Rural WASH
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Rural communities face persistent water and sanitation challenges because field conditions evolve rapidly while conventional monitoring relies on static periodic reports. This research introduces a <strong>Generative WASH-AI Digital Twin</strong> that continuously fuses low-cost IoT telemetry with citizen crowdsourcing to simulate and evaluate interventions before physical field deployment.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/console"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <span>Explore Operational Digital Twin</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#abstract"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>Read Research Abstract</span>
              </a>
            </div>

          </div>

          {/* Key Metrics Strip */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl border border-gray-200 bg-[#F8F9FA] p-5 sm:p-6 shadow-2xs text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-gray-900">10 Nodes</div>
              <div className="text-xs text-gray-500 font-medium mt-1">Kwali LGA Settlements Mapped</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-600">Dual-Stream</div>
              <div className="text-xs text-gray-500 font-medium mt-1">IoT Sensors + Citizen GPS Reports</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-600">768-dim</div>
              <div className="text-xs text-gray-500 font-medium mt-1">pgvector Semantic Memory Retrieval</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600">Pre-Sim</div>
              <div className="text-xs text-gray-500 font-medium mt-1">What-If Trajectory Sandbox</div>
            </div>
          </div>

        </div>
      </section>

      {/* ABSTRACT SECTION */}
      <section id="abstract" className="py-16 sm:py-20 border-b border-gray-200 bg-[#F8F9FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Abstract Callout Card */}
            <div className="lg:col-span-7 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                <span>Peer-Reviewed Study Abstract</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Generative WASH-AI Digital Twin Framework
              </h2>

              <blockquote className="text-sm sm:text-base text-gray-700 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1">
                "Rural communities often face persistent water, sanitation, and hygiene (WASH) challenges because WASH conditions change over time while conventional assessment approaches rely heavily on periodic data collection and static reports. This study proposes a Generative WASH-AI Digital Twin framework for continuously monitoring and improving WASH conditions at the community level.
                <br /><br />
                The framework integrates low-cost IoT sensors with a web-based community reporting platform incorporating Google Maps and location services to collect both infrastructure and citizen-generated data. Community-specific WASH information is organized and retrieved using PostgreSQL with pgvector, enabling the Digital Twin to maintain a continuously updated digital representation of the real-world WASH environment.
                <br /><br />
                Google Gemini 3.8 Flash is employed as the generative AI engine to analyze the evolving WASH data, identify emerging problems, and generate context-specific intervention strategies. Proposed interventions can then be evaluated through the Digital Twin before practical implementation, enabling decision-makers and communities to compare potential actions and anticipate their effects. The resulting feedback cycle data collection, digital representation, AI-generated interventions, simulation, implementation, and continuous updating provides a dynamic decision-support approach for WASH planning."
              </blockquote>

              <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
                <span>Domain: Rural Water Systems & Municipal AI</span>
                <span>Pilot: Kwali Area Council, Abuja</span>
              </div>
            </div>

            {/* Right Col: Comparison Matrix */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Paradigm Comparison
              </h3>

              {/* Conventional approach card */}
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span>Conventional Periodic Assessment</span>
                </div>
                <ul className="text-xs text-red-950 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Data collected annually or bi-annually via manual paper surveys</li>
                  <li>Blind to sudden seasonal turbidity spikes and pipe coupling ruptures</li>
                  <li>30–40% rural borehole failure rate within first 3 years of installation</li>
                  <li>Interventions deployed reactively after total system collapse</li>
                </ul>
              </div>

              {/* Generative WASH-AI approach card */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Generative WASH-AI Digital Twin</span>
                </div>
                <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Continuous dual telemetry (real-time IoT sensors + crowdsourced citizen GPS alerts)</li>
                  <li>PostgreSQL + pgvector living semantic memory of local aquifer & assets</li>
                  <li>Google Gemini 3.8 Flash automated anomaly diagnosis and strategy drafting</li>
                  <li>Pre-implementation sandbox simulates 30-day impact before capital is spent</li>
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-600">
                <p className="font-semibold text-gray-800 mb-1">Empirical Reality</p>
                The Digital Twin bridges the critical latency gap between when infrastructure begins degrading and when municipal authorities become aware.
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CLOSED-LOOP FEEDBACK CYCLE SECTION */}
      <section id="feedback-cycle" className="py-16 sm:py-20 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Closed-Loop Systems Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              The 6-Stage Continuous Decision Feedback Cycle
            </h2>
            <p className="text-sm text-gray-600">
              As articulated in the research, the framework maintains an unbroken loop where field conditions, generative intelligence, simulation, and community feedback continually reinforce one another.
            </p>
          </div>

          {/* Interactive Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEEDBACK_STEPS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(idx)}
                  className={`rounded-2xl border p-5 transition-all cursor-pointer ${
                    activeStep === idx
                      ? 'border-blue-600 bg-blue-50/20 shadow-md ring-1 ring-blue-600'
                      : 'border-gray-200 bg-white hover:border-gray-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-gray-400">
                      STAGE {item.step}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2.5 mb-2">
                    <div className="rounded-lg bg-gray-100 p-2 text-gray-700">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Handoff banner to Console */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900">
                Experience the 6-Stage Loop in Real Time
              </h4>
              <p className="text-xs text-gray-500">
                Submit a live citizen report on Google Maps, watch Gemini synthesize an action plan, and run the pre-implementation simulation sandbox.
              </p>
            </div>
            <Link
              href="/console"
              className="shrink-0 inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              <span>Launch Twin Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* GOOGLE CLOUD & AI TECH STACK SECTION */}
      <section id="architecture" className="py-16 sm:py-20 border-b border-gray-200 bg-[#F8F9FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Enterprise Grounding
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Built on Google Cloud Platform & Gemini
            </h2>
            <p className="text-sm text-gray-600">
              The framework utilizes enterprise-grade Google services for deterministic geospatial rendering, low-latency reasoning, and relational vector storage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Component 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Google Gemini 3.8 Flash
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Employed as the reasoning engine to ingest multi-source telemetry, detect subtle cross-variable correlations (e.g. flow drop correlated with citizen leakage complaints), and draft itemized engineering interventions.
              </p>
              <div className="text-[11px] font-mono text-purple-700 bg-purple-50 p-2 rounded-lg">
                SDK: @google/genai • Zero-conjecture structured JSON output
              </div>
            </div>

            {/* Component 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Google Maps Platform
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Provides dynamic geospatial mapping for community water points and hazard layers across Kwali LGA. Enables citizens to pin water leaks and contamination with browser GPS accuracy.
              </p>
              <div className="text-[11px] font-mono text-blue-700 bg-blue-50 p-2 rounded-lg">
                API: Maps JavaScript API • Weekly release loader
              </div>
            </div>

            {/* Component 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                PostgreSQL 17 with pgvector
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Deployed on Google Cloud SQL (neuronflow-db). Stores relational sensor readings alongside 768-dimensional vector embeddings of WHO standards and Nigerian rural water guidelines.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                Instance: Cloud SQL Postgres 17 • Extension: vector
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* KWALI AREA COUNCIL PILOT SECTION */}
      <section id="pilot" className="py-16 sm:py-20 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Empirical Field Setting
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Kwali Area Council Pilot Deployment
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Federal Capital Territory (FCT), Abuja, Nigeria • 10 Monitored Rural Settlements
              </p>
            </div>

            <Link
              href="/console"
              className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>View Interactive Geospatial Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Bako Card */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Bako Settlement</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  DEGRADED ANOMALY
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Flow rate dropped from 19.5 to 6.2 L/min due to mechanical HDPE riser coupling leakage. Validated by two citizen reports.
              </p>
              <div className="text-[11px] font-medium text-amber-900 pt-1">
                Gemini Strategy: Riser joint overhaul (₦45,000) • 94% Projected Uptime Recovery
              </div>
            </div>

            {/* Sheda Card */}
            <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Sheda Kiosk</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                  TURBIDITY SPIKE
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Optical sensor logs 8.4 NTU (safe limit &lt;5.0 NTU) post-rainfall runoff infiltration into cracked sanitary wellhead apron.
              </p>
              <div className="text-[11px] font-medium text-red-900 pt-1">
                Gemini Strategy: Shock chlorination + 1.5m apron rebuild (₦38,000)
              </div>
            </div>

            {/* Kwali Central Card */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Kwali Central Scheme</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  NOMINAL (85/100)
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Motorized solar borehole operating stably at 19.5 L/min with safe 1.8 NTU turbidity. Serving 14,500 residents.
              </p>
              <div className="text-[11px] font-medium text-emerald-900 pt-1">
                Routine maintenance schedule active • 0 unaddressed citizen complaints
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-12 text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                Generative WASH-AI Digital Twin
              </p>
              <p className="text-[11px] text-gray-400">
                Community-Level Continuous Monitoring & Intervention Modeling
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-medium">
            <Link href="/console" className="text-blue-600 hover:underline">
              Digital Twin Console
            </Link>
            <a href="#abstract" className="text-gray-600 hover:text-gray-900">
              Abstract
            </a>
            <a href="#feedback-cycle" className="text-gray-600 hover:text-gray-900">
              Feedback Cycle
            </a>
            <a href="#architecture" className="text-gray-600 hover:text-gray-900">
              Tech Stack
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
