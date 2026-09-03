'use client';

import React, { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { Play, TrendingUp, CheckCircle, AlertCircle, DollarSign, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { CommunityNode } from './GoogleWASHMap';
import { SimulationResult } from '@/lib/simulator';

type SimulationSandboxProps = {
  communities: CommunityNode[];
  initialCommunity?: CommunityNode | null;
};

export default function SimulationSandbox({
  communities,
  initialCommunity,
}: SimulationSandboxProps) {
  const [selectedCommunityId, setSelectedCommunityId] = useState(
    initialCommunity?.id || communities[0]?.id || 'bako'
  );
  const [horizonDays, setHorizonDays] = useState<7 | 30 | 90>(30);
  const [userTariff, setUserTariff] = useState<number>(20);
  const [dispatchDelay, setDispatchDelay] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const selectedCommunity = communities.find((c) => c.id === selectedCommunityId);

  const runSimulation = async () => {
    if (!selectedCommunity) return;
    setLoading(true);

    try {
      const res = await fetch('/api/twin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communityId: selectedCommunity.id,
          horizonDays,
          userTariff,
          dispatchDelay,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.simulation);
      }
    } catch (err) {
      console.error('Simulation run failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sandbox Configurator Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-base font-bold text-gray-900">
                Digital Twin Pre-Implementation Evaluation Sandbox
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Simulate socio-technical and financial trajectories before deploying interventions into the field
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={loading}
            className="inline-flex items-center justify-center space-x-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4 fill-white" />
            )}
            <span>Execute Digital Twin Simulation</span>
          </button>
        </div>

        {/* Levers & Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-5">
          
          {/* Target Settlement */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Target Community / Water Node
            </label>
            <select
              value={selectedCommunityId}
              onChange={(e) => setSelectedCommunityId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-xs focus:border-emerald-500 focus:outline-none"
            >
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.water_point_status})
                </option>
              ))}
            </select>
          </div>

          {/* Time Horizon */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Simulation Horizon
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1 text-center text-xs font-medium">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setHorizonDays(days as any)}
                  className={`rounded-md py-1.5 transition-all ${
                    horizonDays === days
                      ? 'bg-white font-bold text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* User Tariff Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Community Water Tariff
              </label>
              <span className="font-mono text-xs font-bold text-emerald-700">
                ₦{userTariff} / 25L
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={userTariff}
              onChange={(e) => setUserTariff(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Technician Dispatch Latency */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Dispatch Latency
              </label>
              <span className="font-mono text-xs font-bold text-blue-700">
                {dispatchDelay} {dispatchDelay === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={dispatchDelay}
              onChange={(e) => setDispatchDelay(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Simulation Results & Charts */}
      {result ? (
        <div className="space-y-6">
          
          {/* Decision Verdict Banner */}
          <div className={`rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            result.verdict === 'HIGHLY_RECOMMENDED'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : result.verdict === 'FEASIBLE'
              ? 'bg-blue-50/70 border-blue-200 text-blue-950'
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 rounded-full p-1.5 bg-white shadow-xs">
                {result.verdict === 'HIGHLY_RECOMMENDED' ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Decision-Support Engine Verdict
                  </span>
                  <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-bold shadow-xs">
                    {result.verdict.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm font-medium mt-1 leading-relaxed">
                  {result.verdictNotes}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[11px] text-gray-500 font-medium">Estimated Capital Recovery</div>
              <div className="text-lg font-bold font-mono text-gray-900">
                Day {result.breakEvenDay} of {result.horizonDays}
              </div>
            </div>
          </div>

          {/* Key Metric Impact Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
                <span>Avoided Downtime</span>
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-gray-900">
                +{result.avoidedDowntimeHours} <span className="text-sm font-normal text-gray-500">hrs</span>
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 font-medium">
                {result.projectedUptimePct}% projected avg uptime
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
                <span>Net Water Gain</span>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-gray-900">
                {(result.netWaterGainLiters / 1000).toFixed(1)}k <span className="text-sm font-normal text-gray-500">Liters</span>
              </div>
              <div className="mt-1 text-[11px] text-gray-500">
                vs unmitigated decay baseline
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
                <span>Health Risk Drop</span>
                <ShieldCheck className="h-4 w-4 text-purple-600" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-gray-900">
                -{result.healthRiskReductionPct}%
              </div>
              <div className="mt-1 text-[11px] text-purple-600 font-medium">
                turbidity & shortage risk
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
                <span>Reserve Fund Post-Op</span>
                <DollarSign className="h-4 w-4 text-amber-600" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-gray-900">
                ₦{result.reserveFundBalanceNgn.toLocaleString()}
              </div>
              <div className="mt-1 text-[11px] text-gray-500">
                capital expenditure: ₦{result.projectedTotalSpendNgn.toLocaleString()}
              </div>
            </div>

          </div>

          {/* Interactive Trajectory Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Uptime Trajectory */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Uptime Trajectory Comparison (Baseline Decay vs. Intervention Recovery)
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Operational availability percentage modeled over {result.horizonDays} days
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.trajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#9ca3af" unit="%" />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Line
                      type="monotone"
                      dataKey="baselineUptimePct"
                      name="Unattended Baseline (Failure)"
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      dot={false}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="projectedUptimePct"
                      name="Projected Post-Intervention"
                      stroke="#10b981"
                      dot={false}
                      strokeWidth={2.5}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Reserve Fund Accumulation */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Financial Self-Sustainability & Escrow Reserve
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Cumulative community maintenance fund balance factoring tariff collection
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.trajectory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReserve" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" unit="₦" />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Area
                      type="monotone"
                      dataKey="reserveFundNgn"
                      name="Maintenance Reserve (NGN)"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorReserve)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
            <Play className="h-6 w-6 fill-emerald-600 ml-0.5" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            Digital Twin Ready for Pre-Implementation Simulation
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
            Select a community and click "Execute Digital Twin Simulation" to project water volume gains, cost recovery, and downtime avoidance curves.
          </p>
        </div>
      )}

    </div>
  );
}
