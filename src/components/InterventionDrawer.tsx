'use client';

import React from 'react';
import { X, Sparkles, Cpu, CheckCircle2, AlertCircle, DollarSign, Clock, ArrowRight } from 'lucide-react';

export type InterventionData = {
  id: string;
  communityId: string;
  communityName: string;
  title: string;
  diagnosis: string;
  proposedActions: string[];
  estimatedCostNgn: number;
  priority: string;
  projectedUptimeRecoveryPct?: number;
  rationale?: string;
  status: string;
};

type InterventionDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  intervention: InterventionData | null;
  onSimulate: (intervention: InterventionData) => void;
};

export default function InterventionDrawer({
  isOpen,
  onClose,
  intervention,
  onSimulate,
}: InterventionDrawerProps) {
  if (!isOpen || !intervention) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                  Gemini 3.8 Flash • Generative WASH-AI
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  intervention.priority === 'CRITICAL'
                    ? 'bg-red-100 text-red-700'
                    : intervention.priority === 'HIGH'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {intervention.priority} PRIORITY
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mt-0.5">
                {intervention.title}
              </h3>
              <p className="text-xs text-gray-500">
                Target Node: {intervention.communityName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Diagnosis Block */}
        <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-4 space-y-1.5">
          <div className="text-xs font-bold text-purple-900 uppercase tracking-wide flex items-center space-x-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-purple-600" />
            <span>Multi-Source Root Cause Diagnosis</span>
          </div>
          <p className="text-xs text-purple-950 leading-relaxed">
            {intervention.diagnosis}
          </p>
        </div>

        {/* Step-by-Step Proposed Actions */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Actionable Field Protocol
          </h4>
          <div className="space-y-2">
            {intervention.proposedActions.map((action, i) => (
              <div key={i} className="flex items-start space-x-2.5 rounded-lg border border-gray-100 bg-gray-50/60 p-2.5 text-xs text-gray-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & Uptime Impact Specs */}
        <div className="grid grid-cols-2 gap-3 py-2 border-y border-gray-100">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Estimated Budget</div>
              <div className="text-sm font-bold font-mono text-gray-900">
                ₦{intervention.estimatedCostNgn.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Target Recovery</div>
              <div className="text-sm font-bold font-mono text-gray-900">
                {intervention.projectedUptimeRecoveryPct || 95}% Uptime
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSimulate(intervention);
              onClose();
            }}
            className="inline-flex items-center space-x-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <Cpu className="h-4 w-4" />
            <span>Evaluate in Digital Twin Sandbox</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
