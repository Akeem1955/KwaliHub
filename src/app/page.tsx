'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Droplets, Cpu, MapPin, Sparkles, Database, ArrowRight, CheckCircle2,
  AlertCircle, Activity, ShieldCheck, Layers, RefreshCw, BarChart3,
  ExternalLink, ChevronRight, Terminal, Globe, Zap, Radio, Bell,
  Users, Check, Star, HelpCircle, PhoneCall
} from 'lucide-react';

export default function SaaSWaterTwin() {
  // Interactive ROI Calculator State
  const [waterPointsCount, setWaterPointsCount] = useState<number>(15);
  const [responseHours, setResponseHours] = useState<number>(24);

  // Derived ROI calculations
  const annualDowntimeSavedDays = Math.round(waterPointsCount * (38 - responseHours * 0.5));
  const cleanWaterRecoveredLiters = waterPointsCount * 420000;
  const maintenanceCostSavedNgn = (waterPointsCount * 185000).toLocaleString();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans antialiased flex flex-col selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top SaaS Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900 text-lg tracking-tight">
                  HydroTwin<span className="text-blue-600">.ai</span>
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                  WASH Cloud
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Platform Modules</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#roi-calculator" className="hover:text-blue-600 transition-colors">Impact & ROI</a>
            <a href="#case-study" className="hover:text-blue-600 transition-colors">Case Study</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Plans</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              href="/console"
              className="hidden sm:inline-flex items-center text-xs font-semibold text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/console"
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <span>Launch Live Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: SaaS Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-800">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Next-Gen Infrastructure Intelligence for Municipalities & NGOs</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                Zero-Downtime Rural Water Management with <span className="text-blue-600">Generative Digital Twins</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Stop reacting to broken boreholes after communities run dry. HydroTwin combines low-cost IoT telemetry, GPS citizen reporting, and Google Gemini AI to predict failures, simulate repairs, and coordinate field dispatch in real time.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/console"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
                >
                  <span>Open Operational Console</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Explore the Architecture</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Sub-second Anomaly Detection</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Google Maps Geofencing</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Pre-Implementation Sandbox</span>
                </div>
              </div>

            </div>

            {/* Right Col: Live Interactive Platform Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xl space-y-4">
                
                {/* Window header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono text-gray-400 ml-2">hydrotwin-cloud://kwali-central</span>
                  </div>
                  <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>SYSTEM LIVE</span>
                  </span>
                </div>

                {/* Simulated Telemetry Card */}
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3.5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900">Bako Settlement Solar Scheme</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      DEGRADED FLOW (6.2 LPM)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-white p-2 border border-gray-100 shadow-2xs">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Flow</div>
                      <div className="font-bold font-mono text-gray-900">6.2 L/m</div>
                    </div>
                    <div className="rounded-lg bg-white p-2 border border-gray-100 shadow-2xs">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Quality</div>
                      <div className="font-bold font-mono text-gray-900">88%</div>
                    </div>
                    <div className="rounded-lg bg-white p-2 border border-gray-100 shadow-2xs">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Turbidity</div>
                      <div className="font-bold font-mono text-gray-900">2.1 NTU</div>
                    </div>
                  </div>
                </div>

                {/* Gemini AI Synthesis Stream Card */}
                <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-900">
                      <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                      <span>Gemini 3.8 Flash • Action Dispatch</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-600">CONFIDENCE: 98%</span>
                  </div>
                  <p className="text-xs text-purple-950 leading-relaxed">
                    Correlated pressure loss with 2 citizen underground leakage reports. Generated work order for 1.5-inch HDPE coupling replacement.
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] font-medium text-purple-900 border-t border-purple-100">
                    <span>Est. Budget: ₦45,000</span>
                    <span className="text-emerald-700 font-bold">Projected Recovery: 94%</span>
                  </div>
                </div>

                {/* Quick Link Button */}
                <Link
                  href="/console"
                  className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-gray-900 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  <span>Test in Pre-Implementation Sandbox</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PLATFORM MODULES (FEATURES) */}
      <section id="features" className="py-20 border-b border-gray-200 bg-[#F8F9FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Complete WASH Operating System
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
              Four Interconnected Engines, One Living Platform
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Everything rural councils, utilities, and international aid agencies need to eradicate water downtime and maintain positive cash-flow sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Module 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Radio className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                IoT Telemetry Mesh
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect optical turbidity sensors, magnetic flow meters, and solar inverter voltage meters for continuous sub-minute telemetry streaming.
              </p>
              <ul className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• Real-time flow & pressure logs</li>
                <li>• Water quality & pH diagnostics</li>
                <li>• Solar array state-of-charge</li>
              </ul>
            </div>

            {/* Module 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Citizen Crowdsource Portal
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Empower community members to submit GPS-verified alerts for dry taps, colored clay water, and sanitation runoff directly via mobile browsers.
              </p>
              <ul className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• One-tap GPS coordinate capture</li>
                <li>• Visual hazard categorization</li>
                <li>• Instant sync with Google Maps</li>
              </ul>
            </div>

            {/* Module 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Gemini 3.8 Flash AI Engine
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Replaces slow annual engineering surveys. Gemini detects subtle mechanical fatigue and outputs itemized local-currency repair protocols.
              </p>
              <ul className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• Automated root-cause diagnosis</li>
                <li>• Material cost estimations</li>
                <li>• Technician action checklists</li>
              </ul>
            </div>

            {/* Module 4 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Pre-Implementation Sandbox
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Model 7, 30, and 90-day trajectory curves. Simulate water volume gain, capital break-even days, and health risk drops before spending cash.
              </p>
              <ul className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• Uptime decay vs recovery curves</li>
                <li>• Community tariff viability testing</li>
                <li>• Automated feasibility verdicts</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" className="py-20 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Streamlined Deployment
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
              How Municipalities Deploy HydroTwin in Days
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              No complicated field servers required. Fully cloud-managed on Google Cloud infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="space-y-3 text-center md:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 font-bold font-mono text-lg border border-blue-200 mx-auto md:mx-0">
                01
              </div>
              <h3 className="text-lg font-bold text-gray-900">Connect Sensors & Map Points</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Register water schemes on Google Maps. Attach standard low-cost flow and turbidity sensors or enable SMS/web reporting for local stewards.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 font-bold font-mono text-lg border border-purple-200 mx-auto md:mx-0">
                02
              </div>
              <h3 className="text-lg font-bold text-gray-900">AI Synthesizes Action Plans</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                When flow drops or water discolors, Gemini AI analyzes sensor dips alongside citizen complaints to diagnose the exact failure point.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 font-bold font-mono text-lg border border-emerald-200 mx-auto md:mx-0">
                03
              </div>
              <h3 className="text-lg font-bold text-gray-900">Simulate Impact & Dispatch</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Run a pre-implementation test to verify budget feasibility and recovery curves. Dispatch field technicians with confirmed spare parts.
              </p>
            </div>

          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-base font-bold text-gray-900">Ready to test the digital twin in action?</h4>
              <p className="text-xs text-gray-500 mt-1">
                Access the full interactive geospatial map, IoT sensor inspector, and predictive sandbox right now.
              </p>
            </div>
            <Link
              href="/console"
              className="shrink-0 inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              <span>Explore Operational Console</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* INTERACTIVE ROI / IMPACT CALCULATOR */}
      <section id="roi-calculator" className="py-20 border-b border-gray-200 bg-[#F8F9FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Quantifiable Municipal Value
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
              Interactive Impact & Cost-Recovery Calculator
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              See the projected downtime avoided and maintenance capital recovered based on your council's water infrastructure scale.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Controls */}
            <div className="lg:col-span-6 space-y-6">
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Active Water Schemes Monitored
                  </label>
                  <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {waterPointsCount} Communities
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={waterPointsCount}
                  onChange={(e) => setWaterPointsCount(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                  <span>5 schemes</span>
                  <span>25 schemes</span>
                  <span>50 schemes</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Average Technician Dispatch Latency
                  </label>
                  <span className="font-mono text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {responseHours} Hours
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="72"
                  step="12"
                  value={responseHours}
                  onChange={(e) => setResponseHours(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                  <span>12 hrs (Rapid)</span>
                  <span>48 hrs (Standard)</span>
                  <span>72 hrs (Delayed)</span>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-gray-900">Why predictive maintenance wins:</p>
                <p>Preventative coupling replacements cost 80% less than full borehole re-drilling after catastrophic motor seizure.</p>
              </div>

            </div>

            {/* Projected Impact Dashboard */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-2xs">
                <div className="text-xs font-semibold text-gray-500 uppercase">Annual Downtime Saved</div>
                <div className="mt-2 text-3xl font-bold font-mono text-blue-600">
                  +{annualDowntimeSavedDays} <span className="text-sm font-normal text-gray-500">Days</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Across all community water points</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-2xs">
                <div className="text-xs font-semibold text-gray-500 uppercase">Safe Water Delivered</div>
                <div className="mt-2 text-3xl font-bold font-mono text-emerald-600">
                  {(cleanWaterRecoveredLiters / 1000000).toFixed(1)}M <span className="text-sm font-normal text-gray-500">Liters</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Recovered from prevented outages</p>
              </div>

              <div className="sm:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Projected Maintenance Fund Value
                  </div>
                  <div className="mt-1 text-2xl font-bold font-mono text-gray-900">
                    ₦{maintenanceCostSavedNgn}
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Self-sustaining reserve via regulated micro-tariffs
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CASE STUDY SPOTLIGHT */}
      <section id="case-study" className="py-20 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Pilot Deployment
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Kwali Area Council, Abuja Pilot Program
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Field validation across 10 rural settlements covering 46,000+ residents
              </p>
            </div>

            <Link
              href="/console"
              className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>Explore Live Telemetry Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="rounded-2xl border border-gray-200 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-sm">Bako Settlement</h4>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  RESOLVED ANOMALY
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Flow rate dropped from 19.5 to 6.2 L/min due to underground riser leakage. Gemini drafted an immediate coupling overhaul; digital twin projected 94% recovery.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold pt-1">
                Downtime avoided: 18 days • Cost: ₦45,000
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-sm">Sheda Filtration Scheme</h4>
                <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                  TURBIDITY REMEDIATED
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Post-rainfall runoff elevated turbidity to 8.4 NTU. Gemini triggered shock chlorination protocol and a reinforced 1.5m elevated sanitary apron.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold pt-1">
                Pathogen risk drop: 82% • Cost: ₦38,000
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-sm">Kwali Central Kiosk</h4>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  STABLE (85/100)
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Motorized solar borehole operating stably at 19.5 L/min with safe 1.8 NTU. Serving 14,500 residents with continuous maintenance escrow reserves.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold pt-1">
                Uptime: 99.1% • 0 unresolved tickets
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PRICING TIERS */}
      <section id="pricing" className="py-20 border-b border-gray-200 bg-[#F8F9FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Transparent Deployment Plans
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
              Built for Communities, Councils, and Donors
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Start free with pilot community schemes or deploy council-wide across entire administrative areas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tier 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6 shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Community Steward</h3>
                <p className="text-xs text-gray-500 mt-1">For single village water committees and local borehole operators.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-gray-900">Free</span>
                  <span className="text-xs text-gray-500 ml-1">/ forever</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Up to 2 water points</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Web-based citizen reporting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Daily automated health score</span>
                </li>
              </ul>

              <Link
                href="/console"
                className="w-full inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Launch Free Pilot
              </Link>
            </div>

            {/* Tier 2 (Featured) */}
            <div className="rounded-2xl border-2 border-blue-600 bg-white p-6 space-y-6 shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Most Popular
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">Area Council / LGA</h3>
                <p className="text-xs text-gray-500 mt-1">For local government water boards and regional utility coordinators.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-gray-900">₦75,000</span>
                  <span className="text-xs text-gray-500 ml-1">/ month per council</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Up to 25 water schemes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Google Gemini 3.8 Flash automated dispatch</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Pre-Implementation Simulation Sandbox</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Google Maps hazard heat layers</span>
                </li>
              </ul>

              <Link
                href="/console"
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
              >
                Start 14-Day Council Trial
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6 shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-gray-900">State / Global NGO</h3>
                <p className="text-xs text-gray-500 mt-1">For multi-LGA donor projects, UNICEF partners, and state ministries.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-gray-900">Custom</span>
                  <span className="text-xs text-gray-500 ml-1">/ tailored scope</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Unlimited water schemes & nodes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Dedicated Cloud SQL pgvector database</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Custom sensor hardware integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>24/7 priority technician support</span>
                </li>
              </ul>

              <Link
                href="/console"
                className="w-full inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Contact Enterprise Team
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-12 text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  HydroTwin<span className="text-blue-600">.ai</span>
                </p>
                <p className="text-[11px] text-gray-400">
                  Continuous Socio-Technical WASH Intelligence Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs font-medium">
              <Link href="/console" className="text-blue-600 hover:underline font-semibold">
                Open Console
              </Link>
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">
                How it Works
              </a>
              <a href="#roi-calculator" className="text-gray-600 hover:text-gray-900">
                Impact Calculator
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
            <p>© 2026 HydroTwin Cloud. Built for municipal water security and community resilience.</p>
            <div className="flex items-center space-x-4">
              <span>Powered by Google Gemini 3.8 Flash & Google Cloud</span>
              <span>•</span>
              <span>PostgreSQL pgvector</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
