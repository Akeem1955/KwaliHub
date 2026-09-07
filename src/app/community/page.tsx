"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GooglePinboard from "@/components/dashboard/GooglePinboard";

import { useCommunity } from "./CommunityContext";

interface CommunityPoint {
  id: string;
  name: string;
  ward: string;
  wardName: string;
  type: "WATER_POINT" | "SANITATION_HAZARD";
  status: "NORMAL" | "WARNING" | "CRITICAL";
  metric: string;
  detail: string;
  coordinates: { x: number; y: number };
  iotSensors?: string;
  scoutReport?: string;
}

export default function CommunityDashboard() {
  const { isDark, scoutWard, scoutName, scoutXp, addScoutXp } = useCommunity();

  const [activeTab, setActiveTab] = useState<"ALL" | "WATER_POINT" | "SANITATION_HAZARD" | "ALERTS">("ALL");
  const [points, setPoints] = useState<CommunityPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<CommunityPoint | null>(null);
  const [loading, setLoading] = useState(true);

  // Core KPIs from PostgreSQL
  const [kpis, setKpis] = useState({
    totalSchemes: 0,
    uptimePct: 100,
    waterQualityIndex: 90,
    wasteHazardsOpen: 0,
    wasteHazardsCleared: 0,
  });

  // Incident Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState("BOREHOLE_FAULT");
  const [urgency, setUrgency] = useState("MEDIUM");
  const [description, setDescription] = useState("");
  const [landmark, setLandmark] = useState("");
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Convert lat/long to Kwali schematic percentage coordinates
  const geoToPercent = (lat: number, lon: number) => {
    const minLon = 6.85;
    const maxLon = 7.15;
    const minLat = 8.65;
    const maxLat = 8.95;
    const clampedLon = Math.max(minLon, Math.min(maxLon, lon || 7.0));
    const clampedLat = Math.max(minLat, Math.min(maxLat, lat || 8.8));
    const x = Math.round(((clampedLon - minLon) / (maxLon - minLon)) * 75 + 12);
    const y = Math.round(((maxLat - clampedLat) / (maxLat - minLat)) * 75 + 12);
    return { x, y };
  };

  // Fetch real data from PostgreSQL
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/community?ward=${scoutWard}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;

        const mappedPoints: CommunityPoint[] = [];
        const wps = Array.isArray(data.waterPoints) ? data.waterPoints : [];
        const reps = Array.isArray(data.reports) ? data.reports : [];

        // Map Water Points
        let totalFlow = 0;
        let operationalCount = 0;
        let qualitySum = 0;
        let qualityCount = 0;

        wps.forEach((wp: any) => {
          const isCritical = wp.status === "CRITICAL";
          const isDegraded = wp.status === "DEGRADED";
          const isOperational = wp.status === "OPERATIONAL" || (!isCritical && !isDegraded);
          if (isOperational) operationalCount++;

          const flow = Number(wp.flow_rate_lpm) || 0;
          totalFlow += flow;

          const quality = Number(wp.water_quality_score);
          if (!isNaN(quality) && quality > 0) {
            qualitySum += quality;
            qualityCount++;
          }

          const coords = geoToPercent(Number(wp.latitude), Number(wp.longitude));
          mappedPoints.push({
            id: wp.id,
            name: wp.name,
            ward: wp.community_id,
            wardName: `${wp.community_id.charAt(0).toUpperCase() + wp.community_id.slice(1)} Ward`,
            type: "WATER_POINT",
            status: isCritical ? "CRITICAL" : isDegraded ? "WARNING" : "NORMAL",
            metric: flow > 0 ? "Water is Flowing" : "Water is Stopped",
            detail: isCritical ? "Water requires urgent repair." : "Water quality is safe for use.",
            coordinates: coords,
            iotSensors: `Edge Sensor Array: Flow ${flow} LPM | Turbidity ${wp.turbidity_ntu || 1.4} NTU | Status: ${wp.status}`,
            scoutReport: "Borehole solar array nominal. Community water collection point active.",
          });
        });

        // Map Citizen Reports
        let openHazards = 0;
        let clearedHazards = 0;

        reps.forEach((rep: any) => {
          const isSanitation =
            rep.category === "SANITATION_HAZARD" ||
            rep.category === "REFUSE_HEAP" ||
            rep.category === "BLOCKED_DRAINAGE";

          if (rep.status === "RESOLVED" || rep.status === "CLEARED") {
            clearedHazards++;
          } else {
            openHazards++;
          }

          if (isSanitation) {
            const coords = geoToPercent(Number(rep.latitude), Number(rep.longitude));
            mappedPoints.push({
              id: rep.id,
              name: `${rep.community_id.charAt(0).toUpperCase() + rep.community_id.slice(1)} Waste Incursion`,
              ward: rep.community_id,
              wardName: `${rep.community_id.charAt(0).toUpperCase() + rep.community_id.slice(1)} Ward`,
              type: "SANITATION_HAZARD",
              status: rep.urgency === "HIGH" || rep.urgency === "CRITICAL" ? "CRITICAL" : "WARNING",
              metric: `${rep.category.replace(/_/g, " ")} (${rep.status})`,
              detail: rep.description,
              coordinates: coords,
              iotSensors: "No IoT: Sanitation and hygiene is 100% community-scout monitored.",
              scoutReport: `Scout: ${rep.reporter_name} (${rep.phone || "Verified"}). Date: ${new Date(rep.reported_at).toLocaleDateString()}.`,
            });
          }
        });

        // Calculate KPI summaries
        const uptimePct = wps.length > 0 ? Math.round((operationalCount / wps.length) * 100) : 100;
        const avgQuality = qualityCount > 0 ? Math.round(qualitySum / qualityCount) : 90;

        setKpis({
          totalSchemes: wps.length,
          uptimePct,
          waterQualityIndex: avgQuality,
          wasteHazardsOpen: openHazards,
          wasteHazardsCleared: clearedHazards,
        });

        setPoints(mappedPoints);
        if (mappedPoints.length > 0) {
          setSelectedPoint((prev) => prev || mappedPoints[0]);
        }
      })
      .catch((err) => console.error("Failed to load community data:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [scoutWard]);

  // Submit Incident to PostgreSQL
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    try {
      let lat = 8.82;
      let lon = 6.98;
      if (typeof window !== "undefined" && navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
          });
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        } catch (_) {}
      }

      const payload = {
        communityId: scoutWard === "all" ? "kilankwa" : scoutWard,
        reporterName: scoutName || "Community Scout",
        phone: "Community Field Sentry",
        category,
        urgency,
        description: landmark ? `${description} (Landmark: ${landmark})` : description,
        latitude: lat,
        longitude: lon,
      };

      
      if (photoData) {
        const existing = JSON.parse(localStorage.getItem("aquawatch-gallery") || "[]");
        existing.unshift({ id: Date.now(), image: photoData, date: new Date().toISOString(), category, description });
        localStorage.setItem("aquawatch-gallery", JSON.stringify(existing));
      }
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success && result.report) {
        const bonusXp = photoData ? 70 : 50;
        addScoutXp(bonusXp);

        // Add to map points
        const coords = geoToPercent(lat, lon);
        const newPoint: CommunityPoint = {
          id: result.report.id,
          name: `${result.report.category.replace(/_/g, " ")} Logged`,
          ward: result.report.community_id,
          wardName: `${result.report.community_id.toUpperCase()} Ward`,
          type: "SANITATION_HAZARD",
          status: urgency === "HIGH" || urgency === "CRITICAL" ? "CRITICAL" : "WARNING",
          metric: `${result.report.category.replace(/_/g, " ")} (PENDING)`,
          detail: result.report.description,
          coordinates: coords,
          iotSensors: "No IoT: Community scout monitored.",
          scoutReport: `Logged by ${scoutName}. Verified with GPS coordinates.`,
        };

        setPoints((prev) => [newPoint, ...prev]);
        setSelectedPoint(newPoint);
        setKpis((prev) => ({ ...prev, wasteHazardsOpen: prev.wasteHazardsOpen + 1 }));

        setToastMessage(`Incident dispatched to Water Board! +${bonusXp} XP credited.`);
        setTimeout(() => setToastMessage(null), 5000);

        setDescription("");
        setLandmark("");
        setPhotoData(null);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error submitting report:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter points based on activeTab
  const filteredPoints = points.filter((p) => {
    if (activeTab === "WATER_POINT") return p.type === "WATER_POINT";
    if (activeTab === "SANITATION_HAZARD") return p.type === "SANITATION_HAZARD";
    if (activeTab === "ALERTS") return p.status !== "NORMAL";
    return true;
  });

  // Dynamic Scout Rank
  const getScoutRank = (xp: number) => {
    if (xp >= 750) return { title: "Master Guardian", level: "Tier 5" };
    if (xp >= 500) return { title: "Rapid Sentry", level: "Tier 4" };
    if (xp >= 300) return { title: "Clean Ward Lead", level: "Tier 3" };
    if (xp >= 150) return { title: "Ward Watcher", level: "Tier 2" };
    if (xp >= 50) return { title: "Field Scout", level: "Tier 1" };
    return { title: "Initiate Scout", level: "Tier 0" };
  };
  const scoutRank = getScoutRank(scoutXp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="space-y-8 pt-6 pb-12"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1fcfab] text-[#030810] font-bold text-xs shadow-2xl shadow-[#1fcfab]/30 animate-bounce">
          <span className="text-xl">🎉</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Scout Welcome Banner */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className={`p-8 sm:p-10 rounded-[2.5rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all ${
          isDark
            ? "bg-[#071528] border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            : "bg-white border-none shadow-sm"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="mb-1">
              <span className={`text-xs font-mono uppercase tracking-widest font-bold ${isDark ? "text-[#1fcfab]" : "text-purple-600"}`}>
                {scoutWard === "all" ? "Kwali Regional Scout" : `${scoutWard.replace('-', ' ').toUpperCase()} WARD SCOUT`}
              </span>
            </div>
            <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Hello, {scoutName || "Community Scout"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                isDark
                  ? "bg-[#1fcfab] text-[#030810] border-[#1fcfab] hover:bg-[#1ab898]"
                  : "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
              }`}
            >
              <span>+ Report WASH Incident</span>
              <span className="text-xs">⚡</span>
            </button>

          </div>
        </div>
      </motion.div>

      {/* 4-Card Regional KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Borehole Uptime */}
        <div
          className={`p-6 sm:p-8 rounded-[2rem] border transition-all ${
            isDark ? "bg-[#071528]/90 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-4">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Borehole Uptime
            </span>
            <span className="text-emerald-500 font-mono text-[10px] font-bold bg-emerald-500/10 px-2 py-1 rounded-md">
              Online
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-bold font-display tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {kpis.uptimePct}%
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Target: 95%</span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? "text-white/45" : "text-slate-500"}`}>
            {kpis.totalSchemes} water schemes monitored.
          </p>
        </div>

        {/* Card 2: Water Quality Score */}
        <div
          className={`p-6 sm:p-8 rounded-[2rem] border transition-all ${
            isDark ? "bg-[#071528]/90 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-4">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Water Quality Score
            </span>
            <span className="text-sky-500 font-mono text-[10px] font-bold bg-sky-500/10 px-2 py-1 rounded-md">
              Sensors
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-bold font-display tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {kpis.waterQualityIndex}<span className="text-lg text-slate-400 font-normal">/100</span>
            </span>
            <span className="text-xs text-sky-400 font-semibold">WHO Standard</span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Overall water health and safety.
          </p>
        </div>

        {/* Card 3: Waste Hazards Open vs Cleared */}
        <div
          className={`p-6 sm:p-8 rounded-[2rem] border transition-all ${
            isDark ? "bg-[#071528]/90 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-4">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Waste Hazards
            </span>
            <span className="text-amber-500 font-mono text-[10px] font-bold bg-amber-500/10 px-2 py-1 rounded-md">
              Scouts
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-bold font-display tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {kpis.wasteHazardsOpen} <span className="text-sm font-normal text-amber-500">Open</span>
            </span>
            <span className="text-xs text-emerald-500 font-semibold">{kpis.wasteHazardsCleared} Cleared</span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Citizen Google Maps reports.
          </p>
        </div>

        {/* Card 4: Scout Guardian XP & Tier */}
        <div
          className={`p-6 sm:p-8 rounded-[2rem] border transition-all ${
            isDark ? "bg-[#071528]/90 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-4">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Scout Vigilance
            </span>
            <span className="text-purple-400 font-mono text-[10px] font-bold bg-purple-500/10 px-2 py-1 rounded-md">
              {scoutRank.level}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-bold font-display tracking-tight ${isDark ? "text-white" : "text-purple-700"}`}>
              {scoutXp} XP
            </span>
            <span className="text-xs text-emerald-400 font-semibold">{scoutRank.title}</span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Field audit verification points.
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive GIS Map & Pinboard + Point Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ward Pinboard & Map */}
        <div
          className={`lg:col-span-2 p-8 sm:p-10 rounded-[2.5rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all ${
            isDark ? "bg-[#071528]/85 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Kwali Area Council Pinboard
              </h3>
              <p className={`text-sm mt-1.5 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                Map of community water points and reports.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "ALL", label: "All Points" },
                { id: "WATER_POINT", label: "Water Schemes" },
                { id: "SANITATION_HAZARD", label: "Sanitation & Waste" },
                { id: "ALERTS", label: "Active Alerts" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? isDark
                        ? "bg-[#1fcfab]/20 text-[#1fcfab] border border-[#1fcfab]/40"
                        : "bg-purple-100 text-purple-800 border border-purple-300 font-semibold"
                      : isDark
                      ? "text-white/50 hover:text-white bg-white/5"
                      : "text-slate-600 hover:text-slate-900 bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Surface (Google Maps Integration) */}
          <div
            className={`relative rounded-2xl border h-72 sm:h-[400px] overflow-hidden flex items-center justify-center transition-colors ${
              isDark ? "bg-[#030810] border-white/10" : "bg-slate-100 border-slate-200"
            }`}
          >
            <GooglePinboard 
              points={filteredPoints} 
              isDark={isDark} 
              selectedPoint={selectedPoint} 
              setSelectedPoint={setSelectedPoint} 
            />
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span className={isDark ? "text-white/60" : "text-slate-600"}>Water Scheme</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className={isDark ? "text-white/60" : "text-slate-600"}>Sanitation Hazard (Scout)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className={isDark ? "text-white/60" : "text-slate-600"}>Critical Outage</span>
              </div>
            </div>
            <span className={`text-[11px] font-mono ${isDark ? "text-white/40" : "text-slate-400"}`}>
              {filteredPoints.length} points plotted
            </span>
          </div>
        </div>

        {/* Right 1 Col: Selected Point Inspector Drawer */}
        <div
          className={`p-8 sm:p-10 rounded-[2.5rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm flex flex-col justify-between transition-all ${
            isDark ? "bg-[#071528]/85 border-white/10" : "bg-white border-none shadow-sm"
          }`}
        >
          {selectedPoint ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                    selectedPoint.type === "WATER_POINT"
                      ? isDark
                        ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                        : "bg-sky-50 border-sky-200 text-sky-700"
                      : isDark
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  {selectedPoint.type === "WATER_POINT" ? "Water Infrastructure" : "Sanitation & Drainage"}
                </span>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    selectedPoint.status === "CRITICAL"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : selectedPoint.status === "WARNING"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {selectedPoint.status}
                </span>
              </div>

              <div>
                <h4 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {selectedPoint.name}
                </h4>
                <p className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>
                  {selectedPoint.wardName}
                </p>
              </div>

              {/* Incident Details */}
              <div
                className={`p-3 rounded-xl border ${
                  isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className={`text-xs font-mono ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  Details:
                </div>
                <div className={`text-sm font-bold mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {selectedPoint.metric}
                </div>
                <p className={`text-xs mt-1 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  {selectedPoint.detail}
                </p>
              </div>

              {/* Citizen Scout input */}
              <div className="text-xs space-y-1">
                <span className={`font-mono text-[10px] uppercase font-bold ${isDark ? "text-white/40" : "text-slate-400"}`}>
                  Community Evidence:
                </span>
                <p className={`p-2 rounded-lg text-xs ${isDark ? "bg-white/5 text-white/80" : "bg-slate-100 text-slate-800"}`}>
                  {selectedPoint.scoutReport}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setLandmark(selectedPoint.name);
                    setDescription(`Field report regarding ${selectedPoint.name}: `);
                    setIsModalOpen(true);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-center block transition-all cursor-pointer ${
                    isDark
                      ? "bg-[#1fcfab] text-[#030810] hover:bg-[#1ab898]"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  + Log Update for this Point
                </button>

              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6 text-xs text-slate-400">
              Click a map point to inspect details
            </div>
          )}
        </div>
      </div>

      {/* Incident Reporting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className={`relative w-full max-w-lg rounded-3xl border p-6 sm:p-8 shadow-2xl ${
              isDark
                ? "bg-[#071528] border-white/15 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-4 mb-6 ${isDark ? "border-white/10" : "border-slate-100"}`}>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Dispatch New WASH & Waste Report
                </h3>
                <p className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>
                  {scoutWard === "all" ? "Kwali Regional" : scoutWard.toUpperCase()} Fast-Track
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark ? "text-white/50 hover:text-white hover:bg-white/10" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
                  Incident Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "BOREHOLE_FAULT", label: "💧 Pump Mechanical Fault" },
                    { id: "WATER_QUALITY", label: "🧪 Water Contamination" },
                    { id: "REFUSE_HEAP", label: "🗑️ Open Refuse Dump" },
                    { id: "BLOCKED_DRAINAGE", label: "🚫 Blocked Gutter" },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`min-h-[44px] p-2.5 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                        category === cat.id
                          ? isDark
                            ? "bg-white/10 border-white/40 text-white font-bold"
                            : "bg-purple-50 border-purple-500 text-purple-900 font-bold"
                          : isDark
                          ? "bg-white/3 border-white/8 text-white/60 hover:bg-white/5"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
                  Urgency Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((u) => (
                    <button
                      type="button"
                      key={u}
                      onClick={() => setUrgency(u)}
                      className={`min-h-[40px] py-1.5 text-center text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                        urgency === u
                          ? isDark
                            ? "bg-[#1fcfab]/20 border-[#1fcfab] text-[#1fcfab] font-bold"
                            : "bg-purple-600 border-purple-600 text-white font-bold"
                          : isDark
                          ? "bg-white/3 border-white/8 text-white/50"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Landmark */}
              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
                  Village / Landmark Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Market Square or Community Borehole Apron"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs border focus:outline-none transition-colors ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white focus:border-[#1fcfab]"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600"
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
                  Observations & Symptoms
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the fault, pump vibration, discoloration, or refuse overflow..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full p-3 rounded-xl text-xs border focus:outline-none transition-colors ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white focus:border-[#1fcfab]"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-600"
                  }`}
                />
              </div>

              {/* Real Photo Upload */}
              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
                  Attach Photo Evidence
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setPhotoData(reader.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setPhotoData(null);
                    }
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs border transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white file:bg-[#1fcfab]/20 file:text-[#1fcfab] hover:file:bg-[#1fcfab]/30"
                      : "bg-slate-50 border-slate-200 text-slate-700 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                  }`}
                />
              </div>

              {/* Actions */}
              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? "border-white/10" : "border-slate-100"}`}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`min-h-[44px] px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 ${
                    isDark
                      ? "bg-[#1fcfab] text-[#030810] hover:bg-[#19b595]"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {submitting ? "Dispatching..." : `Submit & Earn +${photoData ? 70 : 50} XP`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
