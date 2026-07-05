'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';
import { X } from 'lucide-react';

type TerminalDetailPanelProps = {
  terminal: any | null;
  onClose: () => void;
};

export default function TerminalDetailPanel({ terminal, onClose }: TerminalDetailPanelProps) {
  if (!terminal) return null;

  const latest = terminal.sensorReadings?.[0];
  const isBroken = latest?.pump_status === 'BROKEN';
  const isDegraded = latest?.pump_status === 'DEGRADED';
  const statusColor = isBroken ? 'bg-red-50 text-red-700 border-red-200' : isDegraded ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  // Prepare chart data (reverse to chronological order)
  const chartData = (terminal.sensorReadings || []).map((reading: any) => ({
    time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    flow: reading.flow_rate,
    energy: reading.energy_use,
  })).reverse();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute top-4 right-4 bottom-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[500] flex flex-col overflow-hidden"
      >
        <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{terminal.community_name}</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">ID: {terminal.id.split('-')[0].toUpperCase()}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {/* Header Info */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Current Status</span>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                {latest?.pump_status || 'UNKNOWN'}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Steward Assigned</span>
              <span className="text-sm font-semibold text-slate-700">
                {terminal.stewards?.[0]?.name || 'None'}
              </span>
            </div>
          </div>

          {/* IoT Telemetry */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
              Live Telemetry History
            </h3>

            {/* Flow Rate Chart */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-bold text-slate-600">Flow Rate</span>
                <span className="text-lg font-bold text-indigo-600">{latest?.flow_rate.toFixed(1)} <span className="text-xs font-normal text-slate-400">L/min</span></span>
              </div>
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                      itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                      formatter={(val: number) => [`${val.toFixed(1)} L/m`, 'Flow']}
                      labelStyle={{ display: 'none' }}
                    />
                    <Line type="monotone" dataKey="flow" stroke="#4f46e5" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Energy Use Chart */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-bold text-slate-600">Energy Consumption</span>
                <span className="text-lg font-bold text-amber-500">{latest?.energy_use.toFixed(1)} <span className="text-xs font-normal text-slate-400">W</span></span>
              </div>
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                      itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                      formatter={(val: number) => [`${val.toFixed(1)} W`, 'Energy']}
                      labelStyle={{ display: 'none' }}
                    />
                    <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quality Analysis */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <span className="text-sm font-bold text-slate-600 block mb-2">Water Quality Check</span>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${latest?.water_quality === 'FAIL' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                <span className={`font-semibold ${latest?.water_quality === 'FAIL' ? 'text-red-700' : 'text-emerald-700'}`}>
                  {latest?.water_quality === 'PASS' ? 'Safe (Potable)' : 'Contamination Detected'}
                </span>
              </div>
            </div>

            {/* AI Summary */}
            <div className="mt-6 border-t border-slate-100 pt-6">
               <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">AI Diagnostics</h3>
               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                 {isBroken 
                   ? "Terminal requires immediate physical maintenance. Flow rate is consistently zero." 
                   : isDegraded 
                   ? "Predictive maintenance warning: Anomalous energy spikes detected relative to flow rate. Filter may be clogged."
                   : "Terminal is operating within optimal parameters. No anomalies detected."}
               </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
