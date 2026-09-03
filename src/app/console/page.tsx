'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import GoogleWASHMap, { CommunityNode, CitizenReport } from '@/components/GoogleWASHMap';
import SimulationSandbox from '@/components/SimulationSandbox';
import CitizenReportModal from '@/components/CitizenReportModal';
import InterventionDrawer, { InterventionData } from '@/components/InterventionDrawer';
import {
  Droplets, Users, Activity, AlertTriangle, Sparkles, RefreshCw,
  Cpu, ArrowLeft, CheckCircle2, Clock, Filter, MapPin
} from 'lucide-react';

export default function DigitalTwinConsole() {
  const [activeTab, setActiveTab] = useState<'map' | 'simulator' | 'reports'>('map');
  const [loading, setLoading] = useState(true);
  const [isReseeding, setIsReseeding] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isInterventionDrawerOpen, setIsInterventionDrawerOpen] = useState(false);

  // Core Digital Twin State
  const [communities, setCommunities] = useState<CommunityNode[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalCommunities: 0,
    operationalCount: 0,
    degradedCount: 0,
    criticalCount: 0,
    totalPopulation: 0,
    avgHealthIndex: 0,
    totalReports: 0,
    totalInterventions: 0,
  });

  const [selectedCommunity, setSelectedCommunity] = useState<CommunityNode | null>(null);
  const [activeIntervention, setActiveIntervention] = useState<InterventionData | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);

  // Fetch twin overview state from PostgreSQL API
  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/twin/overview');
      const data = await res.json();
      if (res.ok && data.success) {
        setCommunities(data.communities);
        setReports(data.recentReports);
        setInterventions(data.activeInterventions);
        setStats(data.stats);
        if (!selectedCommunity && data.communities.length > 0) {
          const degraded = data.communities.find((c: CommunityNode) => c.water_point_status === 'DEGRADED') || data.communities[0];
          setSelectedCommunity(degraded);
        }
      }
    } catch (err) {
      console.error('Failed to load Digital Twin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // Reseed Cloud SQL Database
  const handleReseed = async () => {
    setIsReseeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        await fetchOverview();
      }
    } catch (err) {
      console.error('Reseed error:', err);
    } finally {
      setIsReseeding(false);
    }
  };

  // AI Diagnose trigger (Gemini Flash)
  const handleDiagnose = async (comm: CommunityNode) => {
    setDiagnosing(true);
    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId: comm.id }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActiveIntervention(data.intervention);
        setIsInterventionDrawerOpen(true);
        await fetchOverview();
      }
    } catch (err) {
      console.error('Diagnosis failed:', err);
    } finally {
      setDiagnosing(false);
    }
  };

  const handleSimulate = (comm: CommunityNode | InterventionData) => {
    const targetId = 'communityId' in comm ? comm.communityId : comm.id;
    const found = communities.find((c) => c.id === targetId);
    if (found) setSelectedCommunity(found);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col font-sans">
      
      {/* Top Google-style Navigation */}
      <Navigation
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onReseed={handleReseed}
        isReseeding={isReseeding}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Sub-bar with Back to Landing Page */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-2">
        <div className="mx-auto max-w-7xl flex items-center justify-between text-xs">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Framework & Abstract Overview</span>
          </Link>
          <span className="text-gray-400">
            Environment: Cloud SQL PostgreSQL 17 • Google Maps API Active
          </span>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* KPI Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>Monitored Nodes</span>
              <Droplets className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-gray-900">
              {stats.totalCommunities} <span className="text-xs font-normal text-gray-400">sites</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 font-medium">
              {stats.operationalCount} Operational • {stats.degradedCount} Anomaly
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>Population Served</span>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-gray-900">
              {(stats.totalPopulation / 1000).toFixed(1)}k
            </div>
            <div className="mt-1 text-[11px] text-gray-500">
              Kwali Area Council catchment
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>Avg Health Index</span>
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-gray-900">
              {stats.avgHealthIndex} <span className="text-xs font-normal text-gray-400">/ 100</span>
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 font-medium">
              Composite telemetry & reports
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>Citizen Reports</span>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-gray-900">
              {reports.length}
            </div>
            <div className="mt-1 text-[11px] text-orange-600 font-medium">
              Crowdsourced feedback active
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>AI Interventions</span>
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-gray-900">
              {interventions.length}
            </div>
            <div className="mt-1 text-[11px] text-purple-600 font-medium">
              Gemini Flash synthesized
            </div>
          </div>
        </div>

        {/* Tab 1: DIGITAL TWIN MAP VIEW */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[600px] flex flex-col">
              <GoogleWASHMap
                communities={communities}
                reports={reports}
                selectedCommunity={selectedCommunity}
                onSelectCommunity={setSelectedCommunity}
                onDiagnoseCommunity={handleDiagnose}
                onSimulateCommunity={handleSimulate}
              />
            </div>

            <div className="space-y-6">
              {selectedCommunity ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          Digital Twin Node
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          selectedCommunity.water_point_status === 'OPERATIONAL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : selectedCommunity.water_point_status === 'DEGRADED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedCommunity.water_point_status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                        {selectedCommunity.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedCommunity.baseline_source}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-gray-400">Health Index</div>
                      <div className="text-lg font-bold font-mono text-gray-900">
                        {selectedCommunity.health_index}/100
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Flow Rate</span>
                      <div className="text-sm font-bold font-mono text-gray-900 mt-0.5">
                        {selectedCommunity.flow_rate_lpm} L/min
                      </div>
                      <span className="text-[10px] text-gray-500">Target: &gt;18.0</span>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Turbidity</span>
                      <div className={`text-sm font-bold font-mono mt-0.5 ${
                        selectedCommunity.turbidity_ntu > 5.0 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {selectedCommunity.turbidity_ntu} NTU
                      </div>
                      <span className="text-[10px] text-gray-500">Limit: &lt;5.0 NTU</span>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-gray-400">pH Level</span>
                      <div className="text-sm font-bold font-mono text-gray-900 mt-0.5">
                        {selectedCommunity.ph}
                      </div>
                      <span className="text-[10px] text-gray-500">Safe: 6.5 - 8.5</span>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-gray-400">TDS</span>
                      <div className="text-sm font-bold font-mono text-gray-900 mt-0.5">
                        {selectedCommunity.tds_ppm} ppm
                      </div>
                      <span className="text-[10px] text-gray-500">Mineral solids</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleDiagnose(selectedCommunity)}
                      disabled={diagnosing}
                      className="w-full flex items-center justify-center space-x-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {diagnosing ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      <span>
                        {diagnosing ? 'Synthesizing with Gemini 3.8 Flash...' : 'Synthesize AI Strategy with Gemini'}
                      </span>
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-900 uppercase">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span>Live Crowdsourced Stream</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {reports.length} verified
                  </span>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {reports.map((r) => (
                    <div key={r.id} className="rounded-lg border border-gray-100 bg-gray-50/70 p-2.5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          {r.community_name}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          r.urgency === 'CRITICAL'
                            ? 'bg-red-100 text-red-700'
                            : r.urgency === 'HIGH'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {r.urgency}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {r.description}
                      </p>
                      <div className="text-[10px] text-gray-400">
                        {r.category.replace('_', ' ')} • {r.reporter_name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DIGITAL TWIN PRE-IMPLEMENTATION SANDBOX */}
        {activeTab === 'simulator' && (
          <SimulationSandbox
            communities={communities}
            initialCommunity={selectedCommunity}
          />
        )}

        {/* Tab 3: CITIZEN REPORTS TABULAR VIEW */}
        {activeTab === 'reports' && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Citizen-Generated Incident Telemetry
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Crowdsourced community reports linked to Google Maps geospatial coordinates
                </p>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                <span>+ New Citizen Report</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-semibold uppercase text-gray-500">
                  <tr>
                    <th className="py-3 px-4">Community</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Reporter</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900">{r.community_name}</td>
                      <td className="py-3 px-4">
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                          {r.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm truncate text-gray-600">{r.description}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.urgency === 'CRITICAL'
                            ? 'bg-red-100 text-red-700'
                            : r.urgency === 'HIGH'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {r.urgency}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{r.reporter_name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{r.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        communities={communities}
        onReportSubmitted={fetchOverview}
      />

      <InterventionDrawer
        isOpen={isInterventionDrawerOpen}
        onClose={() => setIsInterventionDrawerOpen(false)}
        intervention={activeIntervention}
        onSimulate={handleSimulate}
      />

    </div>
  );
}
