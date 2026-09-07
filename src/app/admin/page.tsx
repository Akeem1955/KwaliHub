"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface WaterPoint {
  id: string;
  community_id: string;
  name: string;
  type: string;
  status: "OPERATIONAL" | "DEGRADED" | "CRITICAL";
  flow_rate_lpm: number;
  water_quality_score: number;
  ph: number;
  turbidity_ntu: number;
  tds_ppm: number;
  energy_kwh: number;
  community_name?: string;
}

export default function AdminIoTPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [waterPoints, setWaterPoints] = useState<WaterPoint[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [transmitting, setTransmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Telemetry state
  const [flowRate, setFlowRate] = useState<number>(20.0);
  const [vibration, setVibration] = useState<number>(1.2);
  const [waterQuality, setWaterQuality] = useState<number>(90);
  const [ph, setPh] = useState<number>(7.2);
  const [turbidity, setTurbidity] = useState<number>(1.5);
  const [tds, setTds] = useState<number>(140);
  const [energy, setEnergy] = useState<number>(1.4);
  const [status, setStatus] = useState<"OPERATIONAL" | "DEGRADED" | "CRITICAL">("OPERATIONAL");

  // Check saved session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("kwali_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch points from live database
  const fetchPoints = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/iot");
      const data = await res.json();
      if (data.waterPoints && data.waterPoints.length > 0) {
        setWaterPoints(data.waterPoints);
        if (!selectedId) {
          setSelectedId(data.waterPoints[0].id);
          applyPointData(data.waterPoints[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load water points:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPoints();
    }
  }, [isAuthenticated]);

  const applyPointData = (wp: WaterPoint) => {
    setFlowRate(Number(wp.flow_rate_lpm) || 20.0);
    setWaterQuality(Number(wp.water_quality_score) || 90);
    setPh(Number(wp.ph) || 7.2);
    setTurbidity(Number(wp.turbidity_ntu) || 1.5);
    setTds(Number(wp.tds_ppm) || 140);
    setEnergy(Number(wp.energy_kwh) || 1.4);
    setStatus(wp.status || "OPERATIONAL");
    // Default vibration based on status
    if (wp.status === "CRITICAL") setVibration(4.8);
    else if (wp.status === "DEGRADED") setVibration(2.9);
    else setVibration(1.1);
  };

  const handleSelectPoint = (id: string) => {
    setSelectedId(id);
    const found = waterPoints.find((p) => p.id === id);
    if (found) {
      applyPointData(found);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("kwali_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Invalid credentials. Please enter admin and admin.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("kwali_admin_auth");
    setUsername("");
    setPassword("");
  };

  // Presets
  const applyPreset = (presetType: string) => {
    if (presetType === "CAVITATION") {
      setFlowRate(14.2);
      setVibration(4.8);
      setStatus("CRITICAL");
      setWaterQuality(88);
      setTurbidity(1.8);
    } else if (presetType === "TURBIDITY") {
      setTurbidity(8.4);
      setWaterQuality(58);
      setPh(6.4);
      setStatus("DEGRADED");
      setTds(280);
    } else if (presetType === "PUMP_FAILURE") {
      setFlowRate(0.0);
      setVibration(0.0);
      setStatus("CRITICAL");
      setEnergy(0.0);
    } else if (presetType === "NOMINAL") {
      setFlowRate(22.5);
      setVibration(0.9);
      setWaterQuality(95);
      setPh(7.3);
      setTurbidity(1.2);
      setTds(135);
      setEnergy(1.5);
      setStatus("OPERATIONAL");
    }
  };

  const handleTransmit = async () => {
    setTransmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/iot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "admin",
          password: "admin",
          waterPointId: selectedId,
          flowRateLpm: flowRate,
          waterQualityScore: waterQuality,
          ph,
          turbidityNtu: turbidity,
          tdsPpm: tds,
          energyKwh: energy,
          status,
          vibrationMmS: vibration,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: "success",
          message: data.message || `Telemetry injected successfully for ${selectedId}!`,
        });
        // Update local list
        setWaterPoints((prev) =>
          prev.map((p) =>
            p.id === selectedId
              ? {
                  ...p,
                  flow_rate_lpm: flowRate,
                  water_quality_score: waterQuality,
                  ph,
                  turbidity_ntu: turbidity,
                  tds_ppm: tds,
                  energy_kwh: energy,
                  status,
                }
              : p
          )
        );
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Failed to transmit telemetry",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Network error while transmitting telemetry",
      });
    } finally {
      setTransmitting(false);
    }
  };

  // Login Gate View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030810] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#071528] p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#1fcfab]/20 text-[#1fcfab] border border-[#1fcfab]/30 mx-auto flex items-center justify-center text-xl font-bold">
              📡
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Kwali IoT Admin</h1>
            <p className="text-xs text-white/50">
              Authorized personnel only: Hardware sensor and telemetry simulation.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#1fcfab]"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#1fcfab]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#1fcfab] text-[#030810] font-bold text-sm hover:bg-[#1ab898] transition-all shadow-lg active:scale-[0.99]"
            >
              Sign In to IoT Simulator
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/institutional"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              Return to Institutional Console
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const activePoint = waterPoints.find((p) => p.id === selectedId);

  return (
    <div className="min-h-screen bg-[#030810] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Navigation Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#071528] rounded-[2rem] border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1fcfab]/20 text-[#1fcfab] border border-[#1fcfab]/30 flex items-center justify-center text-lg font-bold">
              📡
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Kwali IoT Hardware Simulator</h1>
              <p className="text-xs text-white/50">
                Direct edge sensor telemetry injection across Kwali Area Council Wards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/institutional/simulation"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white flex items-center gap-1.5"
            >
              <span>View Digital Twin</span>
              <span className="text-xs text-[#1fcfab]">→</span>
            </Link>
            <Link
              href="/institutional"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white"
            >
              Overview Map
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Feedback Alert */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
              feedback.type === "success"
                ? "bg-[#1fcfab]/15 border-[#1fcfab]/30 text-[#1fcfab]"
                : "bg-red-500/15 border-red-500/30 text-red-400"
            }`}
          >
            <span>{feedback.message}</span>
            <button
              onClick={() => setFeedback(null)}
              className="opacity-70 hover:opacity-100 text-sm ml-2"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Point Selector and Presets */}
          <div className="space-y-6 lg:col-span-1">
            {/* Target Water Point Card */}
            <div className="p-6 bg-[#071528] rounded-[2rem] border border-white/10 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">
                1. Select Target Scheme
              </h2>

              {loading ? (
                <div className="text-xs text-white/40 py-4">Loading Kwali water schemes...</div>
              ) : (
                <select
                  value={selectedId}
                  onChange={(e) => handleSelectPoint(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1fcfab]"
                >
                  {waterPoints.map((wp) => (
                    <option key={wp.id} value={wp.id} className="bg-[#071528] text-white">
                      {wp.name} ({wp.community_name || wp.community_id})
                    </option>
                  ))}
                </select>
              )}

              {activePoint && (
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-[11px] space-y-1 text-white/70">
                  <div>
                    <span className="text-white/40">Scheme ID:</span> {activePoint.id}
                  </div>
                  <div>
                    <span className="text-white/40">Ward/Community:</span>{" "}
                    {activePoint.community_name || activePoint.community_id}
                  </div>
                  <div>
                    <span className="text-white/40">Current Status:</span>{" "}
                    <span
                      className={`font-bold ${
                        activePoint.status === "OPERATIONAL"
                          ? "text-emerald-400"
                          : activePoint.status === "DEGRADED"
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {activePoint.status}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Failure Mode Presets Card */}
            <div className="p-6 bg-[#071528] rounded-[2rem] border border-white/10 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">
                2. Anomaly Presets
              </h2>
              <p className="text-xs text-white/50">
                Instantly load simulated failure dynamics into the sensor dials:
              </p>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => applyPreset("CAVITATION")}
                  className="w-full text-left p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all text-xs"
                >
                  <div className="font-bold">Impeller Cavitation Grind</div>
                  <div className="text-[10px] text-amber-300/70">
                    High vibration (4.8 mm/s), 14.2 LPM, Critical status
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset("TURBIDITY")}
                  className="w-full text-left p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 transition-all text-xs"
                >
                  <div className="font-bold">Flood Runoff Turbidity Infiltration</div>
                  <div className="text-[10px] text-sky-300/70">
                    Turbidity 8.4 NTU, pH 6.4, degraded water quality
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset("PUMP_FAILURE")}
                  className="w-full text-left p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all text-xs"
                >
                  <div className="font-bold">Complete Motor Burnout / Zero Flow</div>
                  <div className="text-[10px] text-red-300/70">
                    0 LPM flow rate, Critical status, 0 kWh
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset("NOMINAL")}
                  className="w-full text-left p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-all text-xs"
                >
                  <div className="font-bold">Restore Nominal Solar Pumping</div>
                  <div className="text-[10px] text-emerald-300/70">
                    22.5 LPM, 0.9 mm/s, Operational status, 95% quality
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry Sliders and Transmission */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 md:p-8 bg-[#071528] rounded-[2rem] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white">3. Sensor Telemetry Dials</h2>
                  <p className="text-xs text-white/50">
                    Tune simulated edge IoT sensor signals before transmitting to Postgres
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    status === "OPERATIONAL"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : status === "DEGRADED"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* Status Radio Controls */}
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2">
                  Scheme Operational Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["OPERATIONAL", "DEGRADED", "CRITICAL"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setStatus(mode)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        status === mode
                          ? mode === "OPERATIONAL"
                            ? "bg-emerald-500 text-[#030810] border-emerald-400 shadow-md"
                            : mode === "DEGRADED"
                            ? "bg-amber-500 text-[#030810] border-amber-400 shadow-md"
                            : "bg-red-500 text-white border-red-400 shadow-md"
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Telemetry Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Flow Rate */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white/70">Flow Rate</span>
                    <span className="font-mono text-[#1fcfab] font-bold text-sm">
                      {flowRate.toFixed(1)} LPM
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="0.5"
                    value={flowRate}
                    onChange={(e) => setFlowRate(parseFloat(e.target.value))}
                    className="w-full accent-[#1fcfab]"
                  />
                  <div className="flex justify-between text-[10px] text-white/30">
                    <span>0 LPM (Dry)</span>
                    <span>20 LPM (Baseline)</span>
                    <span>40 LPM</span>
                  </div>
                </div>

                {/* Vibration Amplitude */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white/70">Vibration (Impeller)</span>
                    <span
                      className={`font-mono font-bold text-sm ${
                        vibration > 3.5 ? "text-red-400" : "text-sky-400"
                      }`}
                    >
                      {vibration.toFixed(1)} mm/s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={vibration}
                    onChange={(e) => setVibration(parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] text-white/30">
                    <span>0.0 mm/s</span>
                    <span>&gt;3.5 mm/s (Cavitation Alert)</span>
                    <span>10.0 mm/s</span>
                  </div>
                </div>

                {/* Water Quality Score */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white/70">Water Quality Score</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      {waterQuality} / 100
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="1"
                    value={waterQuality}
                    onChange={(e) => setWaterQuality(parseInt(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-white/30">
                    <span>20 (Unsafe)</span>
                    <span>70 (Potable)</span>
                    <span>100 (Pristine)</span>
                  </div>
                </div>

                {/* Turbidity */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white/70">Turbidity</span>
                    <span
                      className={`font-mono font-bold text-sm ${
                        turbidity > 5.0 ? "text-red-400" : "text-sky-400"
                      }`}
                    >
                      {turbidity.toFixed(1)} NTU
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="20"
                    step="0.1"
                    value={turbidity}
                    onChange={(e) => setTurbidity(parseFloat(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                  <div className="flex justify-between text-[10px] text-white/30">
                    <span>0.1 NTU (Clear)</span>
                    <span>&gt;5.0 NTU (Contaminated)</span>
                    <span>20.0 NTU</span>
                  </div>
                </div>

                {/* pH Level */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white/70">pH Level</span>
                    <span className="font-mono text-purple-400 font-bold text-sm">
                      {ph.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="9.0"
                    step="0.1"
                    value={ph}
                    onChange={(e) => setPh(parseFloat(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                  <div className="flex justify-between text-[10px] text-white/30">
                    <span>5.0 (Acidic)</span>
                    <span>7.0 (Neutral)</span>
                    <span>9.0 (Alkaline)</span>
                  </div>
                </div>

                {/* TDS Level */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white/70">Total Dissolved Solids</span>
                    <span className="font-mono text-cyan-400 font-bold text-sm">
                      {tds} ppm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="5"
                    value={tds}
                    onChange={(e) => setTds(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-white/30">
                    <span>50 ppm</span>
                    <span>&lt;300 ppm (Optimal)</span>
                    <span>500 ppm</span>
                  </div>
                </div>
              </div>

              {/* Transmit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTransmit}
                  disabled={transmitting || !selectedId}
                  className="w-full py-4 rounded-2xl bg-[#1fcfab] text-[#030810] font-bold text-sm hover:bg-[#1ab898] transition-all shadow-xl active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {transmitting ? (
                    <span>Transmitting Telemetry Packets to Database...</span>
                  ) : (
                    <>
                      <span>Transmit Live IoT Telemetry</span>
                      <span className="text-xs">⚡</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-white/40 mt-2">
                  Instantly updates PostgreSQL and triggers live state change on the Digital Twin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
