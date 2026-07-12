'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { X, BatteryMedium, Droplets, Banknote, BrainCircuit } from 'lucide-react';

type TerminalDetailPanelProps = {
  terminal: any | null;
  onClose: () => void;
};

export default function TerminalDetailPanel({ terminal, onClose }: TerminalDetailPanelProps) {
  if (!terminal) return null;

  const latest = terminal.sensorReadings?.[0];
  const isBroken = latest?.pump_status === 'BROKEN';
  const isDegraded = latest?.pump_status === 'DEGRADED';
  
  const statusGlow = isBroken ? 'glow-red' : isDegraded ? 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'glow-blue';
  const statusColor = isBroken ? 'text-red-400 bg-red-400/10 border-red-400/20' : isDegraded ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20';

  // Prepare chart data
  const chartData = (terminal.sensorReadings || []).map((reading: any) => ({
    time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    flow: reading.flow_rate,
    energy: reading.energy_use,
  })).reverse();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[500]"
      >
        <div className={`bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden ${statusGlow}`}>
          
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800/50 bg-slate-900/50">
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                {latest?.pump_status || 'UNKNOWN'}
              </span>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight leading-tight">{terminal.community_name}</h2>
                <p className="text-xs text-slate-400 font-mono">NODE-ID: {terminal.id.split('-')[0].toUpperCase()}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800/50">
            
            {/* Flow Rate */}
            <div className="p-5 flex flex-col">
              <div className="flex items-center space-x-2 mb-3 text-slate-400">
                <Droplets size={16} className="text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-widest">Flow Rate</span>
              </div>
              <div className="flex items-end space-x-2 mb-4">
                <span className="text-3xl font-black text-white">{latest?.flow_rate.toFixed(1)}</span>
                <span className="text-sm text-slate-500 mb-1 font-medium">L/min</span>
              </div>
              <div className="h-16 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Line type="monotone" dataKey="flow" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Energy */}
            <div className="p-5 flex flex-col">
              <div className="flex items-center space-x-2 mb-3 text-slate-400">
                <BatteryMedium size={16} className="text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest">Energy Load</span>
              </div>
              <div className="flex items-end space-x-2 mb-4">
                <span className="text-3xl font-black text-white">{latest?.energy_use.toFixed(1)}</span>
                <span className="text-sm text-slate-500 mb-1 font-medium">W</span>
              </div>
              <div className="h-16 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Steward / Revenue */}
            <div className="p-5 flex flex-col">
              <div className="flex items-center space-x-2 mb-3 text-slate-400">
                <Banknote size={16} className="text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-widest">Steward Data</span>
              </div>
              <div className="flex flex-col space-y-4">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Assigned Operator</span>
                  <span className="text-sm font-medium text-slate-200">{terminal.stewards?.[0]?.name || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Water Quality</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${latest?.water_quality === 'FAIL' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                    <span className="text-sm font-medium text-slate-200">{latest?.water_quality === 'PASS' ? 'Safe (Potable)' : 'Contamination'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Diagnostics */}
            <div className="p-5 bg-slate-900/30 flex flex-col">
              <div className="flex items-center space-x-2 mb-3 text-slate-400">
                <BrainCircuit size={16} className="text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-widest">Twin Diagnostics</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                 {isBroken 
                   ? "Terminal requires immediate physical maintenance. Flow rate is consistently zero. Initiating business model recalibration." 
                   : isDegraded 
                   ? "Predictive maintenance warning: Anomalous energy spikes detected relative to flow rate. Filter may be clogged."
                   : "Terminal is operating within optimal parameters. No predictive anomalies detected across the 14-day trailing horizon."}
              </p>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
