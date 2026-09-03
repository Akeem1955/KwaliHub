'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CitizenReportModal from '@/components/CitizenReportModal';
import {
  Droplets, MapPin, Sparkles, Database, ArrowRight, CheckCircle2,
  AlertCircle, Activity, ShieldCheck, Layers, RefreshCw, BarChart3,
  Users, Check, Camera, Bell, ArrowUpRight, Lock, Eye, CheckCircle,
  HelpCircle, ChevronRight, Sliders, Smartphone, LayoutDashboard,
  Clock, HeartHandshake, FileText
} from 'lucide-react';
import { CommunityNode } from '@/components/GoogleWASHMap';

export default function WASHPlatformLanding() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [communities, setCommunities] = useState<CommunityNode[]>([]);
  const [liveStats, setLiveStats] = useState({
    totalCommunities: 10,
    operationalCount: 8,
    degradedCount: 2,
    totalReports: 6,
    avgHealthIndex: 78,
  });

  useEffect(() => {
    fetch('/api/twin/overview')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCommunities(data.communities || []);
          if (data.stats) {
            setLiveStats(data.stats);
          }
        }
      })
      .catch(() => {
        // Fallback silently if offline during static generation
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans antialiased flex flex-col selection:bg-blue-100 selection:text-blue-900">
      
      {/* INSTITUTIONAL TOP BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900 text-base sm:text-lg tracking-tight">
                  Kwali WASH Hub
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                  Community & Council Platform
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                Federal Capital Territory, Abuja • Real-Time Water & Sanitation Response
              </p>
            </div>
          </div>

          {/* Nav Anchors */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-gray-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#audiences" className="hover:text-blue-600 transition-colors">For Communities & Admins</a>
            <a href="#trust" className="hover:text-blue-600 transition-colors">Trust & Privacy</a>
            <a href="#live-snapshot" className="hover:text-blue-600 transition-colors">Live Snapshot</a>
          </nav>

          {/* Quick Dual Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center space-x-1.5 rounded-lg border border-blue-600 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <span>Report Issue</span>
            </button>
            <Link
              href="/console"
              className="inline-flex items-center space-x-1.5 rounded-lg bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-gray-800 transition-colors"
            >
              <span>Admin Console</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

        </div>
      </header>

      {/* 1. HERO SECTION: SHARED TRUNK, TWO DOORS */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left: Universal Message & Dual CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-800">
                <HeartHandshake className="h-3.5 w-3.5 text-blue-600" />
                <span>Connecting Kwali Communities Directly to Water Response Teams</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                Report a water or sanitation problem in your community — <span className="text-blue-600">and watch it get fixed, faster.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                When a borehole pump breaks, taps run dry, or water turns brown with clay, waiting months for scheduled government surveys is not an option. Kwali WASH Hub gives residents a direct voice and gives local engineers the live data needed to respond in days instead of weeks.
              </p>

              {/* The Two Equal-Weight Doors */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch justify-center lg:justify-start gap-4">
                
                {/* Door 1: Community Entry (Primary Audience) */}
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex-1 inline-flex items-center justify-center space-x-2.5 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-[0.99] transition-all"
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-center">I Want to Report an Issue</span>
                </button>

                {/* Door 2: Admin / Partner Entry (Response Managers) */}
                <Link
                  href="/console"
                  className="flex-1 inline-flex items-center justify-center space-x-2.5 rounded-xl border-2 border-gray-900 bg-white px-6 py-4 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50 active:scale-[0.99] transition-all"
                >
                  <LayoutDashboard className="h-5 w-5 text-gray-900" />
                  <span className="text-center">I Manage WASH Response</span>
                </Link>

              </div>

              {/* Quick assurance signals */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-gray-500">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Zero App Download Needed</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Works on Low-Bandwidth 2G/3G</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Verified Area Council Dispatch</span>
                </span>
              </div>

            </div>

            {/* Right: Authentic Community Water Point Image Placeholder */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[360px] overflow-hidden shadow-xs group">
                
                {/* Visual Placeholder Illustration */}
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-105 transition-transform">
                  <Droplets className="h-8 w-8" />
                </div>

                <div className="space-y-2 max-w-sm">
                  <span className="inline-block rounded-md bg-blue-100/80 px-2.5 py-0.5 text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                    [Image Placeholder #1: Hero Community Photo]
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm">
                    Kwali Community Water Point in Action
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Recommended: Authentic, high-resolution photo of a community member or local steward in Kwali (e.g., at Bako or Kilankwa) fetching water at a solar borehole or checking an alert on a mobile phone.
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-gray-400">
                    Aspect Ratio: 4:3 or 16:9 • Minimum 1200×900px • Natural daylight
                  </div>
                </div>

                {/* Sub-label */}
                <div className="absolute bottom-3 left-4 right-4 text-center">
                  <span className="text-[10px] text-gray-400 italic">
                    Replace with local photo: /public/hero-kwali-borehole.jpg
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. THE PROBLEM (SHARED PLAIN-LANGUAGE CONTEXT) */}
      <section className="py-14 sm:py-16 border-b border-gray-200 bg-[#F8F9FA]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Why Rural Water Systems Fail
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Water conditions change every single day — but traditional reports only happen once a year.
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
            A solar inverter trips, a riser pipe cracks underground, or seasonal rains wash mud into an open well apron. When monitoring depends on periodic paper questionnaires or static annual reviews, damaged boreholes sit abandoned for months. By the time authorities find out, simple repairs have become expensive complete pump seizures.
          </p>

        </div>
      </section>

      {/* 3. HOW IT WORKS (THE 4-STEP VISUAL LOOP) */}
      <section id="how-it-works" className="py-16 sm:py-20 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Clear 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              How Problems Get Found and Solved
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              A continuous, transparent feedback cycle that leaves no community in the dark.
            </p>
          </div>

          {/* 4-Step Visual Sequential Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3 relative hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-mono font-bold text-sm">
                  1
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  COMMUNITY
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">
                Report with Location
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                A resident notices cloudy water, low pressure, or a dry tap, taps their phone, and shares what they see with one-click GPS.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3 relative hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-mono font-bold text-sm">
                  2
                </span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  DIGITAL MAP
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">
                Live Picture Forms
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Citizen alerts combine with automated IoT flow meters on Google Maps, creating an instant live picture of water availability.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3 relative hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-mono font-bold text-sm">
                  3
                </span>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  INTELLIGENCE
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">
                AI Identifies the Fix
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                The system correlates water pressure loss with leakage complaints, flags the exact failing pipe or filter, and calculates parts needed.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3 relative hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-mono font-bold text-sm">
                  4
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ACTION & UPDATE
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">
                Simulate, Fix, Update
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Engineers verify the repair plan in the simulation sandbox, dispatch the technician, and close the ticket as water flow returns to normal.
              </p>
            </div>

          </div>

          {/* Visual Diagram Placeholder callout */}
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-6 text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              [Visual Diagram #2: Sequential Circular Feedback Loop]
            </span>
            <p className="text-xs text-gray-600 max-w-lg mx-auto">
              Suggested: Clean SVG infographic illustrating the cyclical loop between Community Citizen → Google Map Ingestion → AI Synthesis → Field Technician → Restored Water Tap.
            </p>
          </div>

        </div>
      </section>

      {/* 4. TWO-COLUMN AUDIENCE SECTION (COMMUNITY VS ADMIN) */}
      <section id="audiences" className="py-16 sm:py-24 border-b border-gray-200 bg-[#F8F9FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Two Tailored Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Built for the People Who Need Water and the Teams Who Manage It
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* COLUMN 1: FOR THE COMMUNITY (WARM, PLAIN, MOBILE-FIRST) */}
            <div className="rounded-3xl border border-blue-200 bg-white p-6 sm:p-8 flex flex-col justify-between shadow-xs space-y-6">
              
              <div className="space-y-5">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-100 text-blue-800 font-bold px-3 py-1 text-xs uppercase tracking-wide">
                    For Community Residents & Stewards
                  </span>
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Your voice fixes your water.
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  You know immediately when water stops running or looks dirty. Kwali WASH Hub ensures your observation reaches the right repair team without phone calls, delays, or bureaucracy.
                </p>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3 text-xs text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Report in under 30 seconds:</strong> Pick an issue tag (dry tap, dirty water, leak) and pin your location.</span>
                  </div>
                  <div className="flex items-start space-x-3 text-xs text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Track status transparently:</strong> See whether your alert is pending, under investigation, or resolved.</span>
                  </div>
                  <div className="flex items-start space-x-3 text-xs text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>View your neighborhood map:</strong> Check if neighbors have already logged the same breakdown nearby.</span>
                  </div>
                </div>

                {/* Phone Mockup Placeholder */}
                <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-6 text-center space-y-2">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                    [Image Placeholder #3: Mobile Reporting Flow Screenshot]
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-blue-950 font-medium">
                    Mobile browser preview showing the clean 1-tap report button, category chips, and GPS map pin.
                  </p>
                  <span className="text-[10px] text-blue-600 font-mono block">
                    Target image: /public/mockup-mobile-report.png
                  </span>
                </div>

              </div>

              {/* Community CTAs */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <span>Report an Issue Right Now</span>
                </button>
                <Link
                  href="/console"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 rounded-xl border border-gray-300 bg-white px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>View Community Map</span>
                </Link>
              </div>

            </div>

            {/* COLUMN 2: FOR ADMINS & PARTNERS (CREDIBLE, DATA-FORWARD) */}
            <div className="rounded-3xl border border-gray-300 bg-white p-6 sm:p-8 flex flex-col justify-between shadow-xs space-y-6">
              
              <div className="space-y-5">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-gray-100 text-gray-800 font-bold px-3 py-1 text-xs uppercase tracking-wide">
                    For Area Council Engineers & Donors
                  </span>
                  <LayoutDashboard className="h-5 w-5 text-gray-700" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  See the whole WASH picture, live.
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Consolidate real-time physical sensor feeds with crowdsourced complaints into a unified decision dashboard. Anticipate breakdowns, simulate interventions, and deploy repairs with confidence.
                </p>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3 text-xs text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-gray-900 shrink-0 mt-0.5" />
                    <span><strong>Fused intelligence:</strong> Cross-reference telemetry flow drops with citizen clusters to isolate root causes.</span>
                  </div>
                  <div className="flex items-start space-x-3 text-xs text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-gray-900 shrink-0 mt-0.5" />
                    <span><strong>Pre-implementation simulation:</strong> Model 30-day water recovery and budget payback before funding field work.</span>
                  </div>
                  <div className="flex items-start space-x-3 text-xs text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-gray-900 shrink-0 mt-0.5" />
                    <span><strong>Donor & audit transparency:</strong> Real-time uptime telemetry verifies long-term project sustainability.</span>
                  </div>
                </div>

                {/* Admin Dashboard Mockup Placeholder */}
                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/70 p-6 text-center space-y-2">
                  <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
                    [Image Placeholder #4: Admin Command Console Screenshot]
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-300 flex items-center justify-center mx-auto text-gray-700">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-gray-800 font-medium">
                    Console preview showing the Google Maps layer with green/amber pins and the What-If simulation trajectory curve.
                  </p>
                  <span className="text-[10px] text-gray-400 font-mono block">
                    Target image: /public/mockup-admin-console.png
                  </span>
                </div>

              </div>

              {/* Admin CTAs */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/console"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 rounded-xl bg-gray-900 px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-gray-800 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Access Response Console</span>
                </Link>
                <Link
                  href="/console"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 rounded-xl border border-gray-300 bg-white px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Explore Sandbox</span>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. TRUST & TRANSPARENCY (SHARED INTEGRITY) */}
      <section id="trust" className="py-16 sm:py-20 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Integrity & Local Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Built on Trust, Privacy, and Community Ownership
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
              Technology only succeeds when communities feel safe and authorities can verify data accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Lock className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Privacy First</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Citizen incident alerts are anchored to the physical water point location, not personal identification. Residents can report completely anonymously without fear of tracking.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Dual Verification</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Citizen reports are verified against automated physical sensor readings. This prevents false alarms while ensuring legitimate quiet failures are never ignored.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Community Ownership</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Data belongs to Kwali Area Council and its residents. Maintenance reserves and tariff allocations remain under community stewardship, not closed corporate silos.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. IMPACT / LIVE SNAPSHOT */}
      <section id="live-snapshot" className="py-16 sm:py-20 border-b border-gray-200 bg-[#F8F9FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Live Field Telemetry
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Kwali Area Council Snapshot
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Live status streamed from Cloud SQL PostgreSQL & IoT monitors
              </p>
            </div>

            <Link
              href="/console"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>View Full Interactive Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
              <div className="text-xs text-gray-500 font-medium uppercase">Active Water Schemes</div>
              <div className="mt-2 text-3xl font-bold font-mono text-gray-900">
                {liveStats.totalCommunities} <span className="text-xs font-normal text-gray-400">Wards</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                {liveStats.operationalCount} Operational
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
              <div className="text-xs text-gray-500 font-medium uppercase">Active Anomaly Alerts</div>
              <div className="mt-2 text-3xl font-bold font-mono text-amber-600">
                {liveStats.degradedCount} <span className="text-xs font-normal text-gray-400">Nodes</span>
              </div>
              <div className="text-[11px] text-amber-700 font-medium mt-1">
                Bako & Sheda Under Action
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
              <div className="text-xs text-gray-500 font-medium uppercase">Citizen Reports Logged</div>
              <div className="mt-2 text-3xl font-bold font-mono text-blue-600">
                {liveStats.totalReports}
              </div>
              <div className="text-[11px] text-blue-700 font-medium mt-1">
                GPS Verified Submissions
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
              <div className="text-xs text-gray-500 font-medium uppercase">Average Council Health</div>
              <div className="mt-2 text-3xl font-bold font-mono text-emerald-600">
                {liveStats.avgHealthIndex} <span className="text-xs font-normal text-gray-400">/ 100</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-1">
                Uptime & Quality Composite
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FOOTER: BOTH ENTRY POINTS + CREDIBILITY */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-14 text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Repeat Both CTAs */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Start Using the Kwali WASH Hub
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Whether you are a community member logging an alert or an engineer managing municipal response.
              </p>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span>Report an Issue</span>
              </button>

              <Link
                href="/console"
                className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin Console</span>
              </Link>
            </div>
          </div>

          {/* Credits & Institutional Backing */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  Kwali WASH Hub
                </p>
                <p className="text-[11px] text-gray-400">
                  Kwali Area Council, Abuja • Community Water Resilience Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs font-medium">
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#audiences" className="hover:text-blue-600 transition-colors">Audiences</a>
              <a href="#trust" className="hover:text-blue-600 transition-colors">Trust & Privacy</a>
              <Link href="/console" className="text-blue-600 hover:underline">
                Admin Console
              </Link>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-gray-50 pt-4">
            <p>© 2026 Kwali Area Council Rural Water & Sanitation Program. Continuous Cyber-Physical Water Security.</p>
            <div className="flex items-center space-x-3">
              <span>Google Maps Platform</span>
              <span>•</span>
              <span>Google Gemini 3.8 Flash</span>
              <span>•</span>
              <span>PostgreSQL pgvector</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Citizen Report Modal Dialog (Shared across page) */}
      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        communities={communities}
        onReportSubmitted={() => {
          // Refresh stats
          fetch('/api/twin/overview')
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.stats) setLiveStats(data.stats);
            });
        }}
      />

    </div>
  );
}
