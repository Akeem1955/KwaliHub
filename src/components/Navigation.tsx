'use client';

import React from 'react';
import { Droplets, Cpu, MapPin, Database, Sparkles, PlusCircle, RotateCcw } from 'lucide-react';

type NavigationProps = {
  onOpenReportModal: () => void;
  onReseed: () => void;
  isReseeding?: boolean;
  activeTab: 'map' | 'simulator' | 'reports';
  setActiveTab: (tab: 'map' | 'simulator' | 'reports') => void;
};

export default function Navigation({
  onOpenReportModal,
  onReseed,
  isReseeding = false,
  activeTab,
  setActiveTab,
}: NavigationProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Branding & Region */}
        <div className="flex items-center space-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold tracking-tight text-gray-900">
                WASH-AI Digital Twin
              </h1>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                Kwali LGA Pilot
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Federal Capital Territory, Abuja • Continuous Socio-Technical Infrastructure Monitoring
            </p>
          </div>
        </div>

        {/* Center: Clean Tabs */}
        <nav className="hidden md:flex items-center space-x-1 rounded-lg bg-gray-100 p-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-2 rounded-md px-3.5 py-1.5 transition-colors ${
              activeTab === 'map'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>Digital Twin Map</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 rounded-md px-3.5 py-1.5 transition-colors ${
              activeTab === 'simulator'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Cpu className="h-4 w-4 text-emerald-600" />
            <span>Pre-Implementation Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-2 rounded-md px-3.5 py-1.5 transition-colors ${
              activeTab === 'reports'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>Citizen Crowdsource Feed</span>
          </button>
        </nav>

        {/* Right: Cloud System Status & Actions */}
        <div className="flex items-center space-x-3">
          {/* Cloud SQL badge */}
          <div className="hidden lg:flex items-center space-x-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <Database className="h-3.5 w-3.5 text-gray-500" />
            <span>PostgreSQL + pgvector</span>
          </div>

          <button
            onClick={onReseed}
            disabled={isReseeding}
            title="Reset telemetry and knowledge baselines in Cloud SQL"
            className="hidden sm:inline-flex items-center space-x-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isReseeding ? 'animate-spin' : ''}`} />
            <span>Reset Twin</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Report Issue</span>
          </button>
        </div>

      </div>
    </header>
  );
}
