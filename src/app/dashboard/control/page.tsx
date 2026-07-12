'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Database, Cpu, Activity, Play, Zap,
  CheckCircle2, Circle, Loader2, ArrowRight, RotateCcw,
  Sparkles, ChevronRight, Sliders, ToggleLeft, ToggleRight,
  TrendingDown, ShieldAlert
} from 'lucide-react';

/* ─────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────── */
type LogEntry = {
  time: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'loading' | 'ai';
};

type Phase = 'idle' | 'wipe' | 'seed' | 'backfill' | 'twin' | 'complete';

type TwinStatus = {
  totalTerminals: number;
  processedTerminals: number;
  remainingTerminals: number;
  totalProposals: number;
  totalNudges: number;
};

const COMMUNITIES = [
  "Kwali Central", "Bako", "Bukpe", "Dafa", "Gumbo", 
  "Kigbe", "Kilankwa", "Pai", "Sheda", "Wako", 
  "Yangoji", "Yebu", "Koroko", "Giri", "Awawa"
];

/* ─────────────────────────────────────────────
   PHASE DEFINITIONS
   ───────────────────────────────────────────── */
const PHASES: {
  id: Phase;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  glow: string;
}[] = [
  {
    id: 'wipe',
    title: 'Phase 1: System Reset',
    subtitle: 'Clear the Simulation',
    description: 'Wipe the entire database. Remove all terminals, sensor data, steward activity, proposals, and nudges. Start from absolute zero.',
    icon: Database,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
  },
  {
    id: 'seed',
    title: 'Phase 2: Build the Ecosystem',
    subtitle: 'Deploy Infrastructure',
    description: 'Create 15 water terminal communities across Kwali, assign stewards, and register households — the entire WASH infrastructure in one click.',
    icon: Cpu,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]',
  },
  {
    id: 'backfill',
    title: 'Phase 3: Simulate Time',
    subtitle: 'Step-by-Step / Configurable Days',
    description: 'Advance time daily or in batches. IoT sensors generate flow rates, water quality, and energy. Configure dynamic anomalies or adjust revenue below before running.',
    icon: Activity,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
  },
  {
    id: 'twin',
    title: 'Phase 4: Activate the AI',
    subtitle: 'One Terminal at a Time',
    description: 'This is the magic moment. Each click sends ONE terminal\'s anomaly data to Gemini. The AI generates a tailored business model proposal. Click again for the next terminal.',
    icon: Sparkles,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
  },
];

/* ─────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────── */
export default function SimulationControlPage() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('idle');
  const [completedPhases, setCompletedPhases] = useState<Set<Phase>>(new Set());
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: ts(), message: '◈ WASH-AI Simulation Engine v2.1 — Ready', type: 'info' },
    { time: ts(), message: '  Configure parameters below and execute step-by-step.', type: 'info' },
  ]);

  // Twin-specific state
  const [twinStatus, setTwinStatus] = useState<TwinStatus | null>(null);
  const [lastAiResult, setLastAiResult] = useState<{ terminal: string; content: string } | null>(null);

  // Dynamic simulation overrides
  const [forceFailure, setForceFailure] = useState<string>('none');
  const [failureType, setFailureType] = useState<string>('DEGRADED');
  const [waterQualityFail, setWaterQualityFail] = useState<boolean>(false);
  const [revenueMultiplier, setRevenueMultiplier] = useState<number>(1.0);
  const [simulateDays, setSimulateDays] = useState<number>(1);
  const [simulatedDaysCount, setSimulatedDaysCount] = useState<number>(0);

  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  function ts() {
    return new Date().toLocaleTimeString('en-GB', { hour12: false });
  }

  function addLog(message: string, type: LogEntry['type'] = 'info') {
    setLogs(prev => [...prev, { time: ts(), message, type }]);
  }

  // Determine which phase the user should click next
  function getActivePhase(): Phase {
    if (!completedPhases.has('wipe')) return 'wipe';
    if (!completedPhases.has('seed')) return 'seed';
    // Backfill state is completed if we simulated at least some days
    if (simulatedDaysCount === 0) return 'backfill';
    if (!completedPhases.has('twin')) return 'twin';
    return 'complete';
  }

  function getPhaseState(phaseId: Phase): 'locked' | 'active' | 'done' {
    if (phaseId === 'backfill' && simulatedDaysCount > 0) return 'done';
    if (completedPhases.has(phaseId)) return 'done';
    if (getActivePhase() === phaseId) return 'active';
    return 'locked';
  }

  /* ── Execute a phase ────────────────────── */
  async function executePhase(phaseId: Phase) {
    if (loading) return;
    if (getPhaseState(phaseId) === 'locked') return;

    setLoading(true);
    setCurrentPhase(phaseId);

    try {
      switch (phaseId) {
        case 'wipe':
          addLog('▸ Executing System Reset...', 'loading');
          const wipeRes = await fetch('/api/simulate/wipe', { method: 'POST' });
          const wipeData = await wipeRes.json();
          addLog(`✓ ${wipeData.message}`, 'success');
          setCompletedPhases(prev => new Set(prev).add('wipe'));
          setSimulatedDaysCount(0);
          break;

        case 'seed':
          addLog('▸ Deploying ecosystem infrastructure...', 'loading');
          const seedRes = await fetch('/api/simulate/seed', { method: 'POST' });
          const seedData = await seedRes.json();
          addLog(`✓ ${seedData.message}`, 'success');
          setCompletedPhases(prev => new Set(prev).add('seed'));
          break;

        case 'backfill':
          addLog(`▸ Simulating ${simulateDays} Day(s) of custom IoT telemetry...`, 'loading');
          
          const tickRes = await fetch('/api/simulate/tick', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              days: simulateDays,
              forceFailure: forceFailure !== 'none' ? forceFailure : undefined,
              failureType: forceFailure !== 'none' ? failureType : undefined,
              waterQualityFail: forceFailure !== 'none' ? waterQualityFail : undefined,
              revenueMultiplier: revenueMultiplier,
            }),
          });
          
          const tickData = await tickRes.json();
          if (tickRes.ok) {
            addLog(`✓ ${tickData.message}`, 'success');
            if (forceFailure !== 'none') {
              addLog(`  [Override Alert] Forced ${failureType} pump status on: ${forceFailure}`, 'info');
              if (waterQualityFail) {
                addLog(`  [Override Alert] Forced water quality FAILURE on: ${forceFailure}`, 'info');
              }
            }
            addLog(`  Revenue multiplier applied: ${revenueMultiplier}x`, 'info');
            setSimulatedDaysCount(prev => prev + simulateDays);
            // Fetch initial twin status
            await refreshTwinStatus();
          } else {
            addLog(`✗ Failed to run tick: ${tickData.error}`, 'error');
          }
          break;

        case 'twin':
          await processOneTerminal();
          break;
      }
    } catch (err: any) {
      addLog(`✗ Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
      setCurrentPhase('idle');
    }
  }

  async function processOneTerminal() {
    addLog('▸ Sending ONE terminal to Gemini AI...', 'loading');
    const res = await fetch('/api/twin/process-one', { method: 'POST' });
    const data = await res.json();

    if (!res.ok) {
      addLog(`✗ ${data.error || 'AI processing failed.'}`, 'error');
      return;
    }

    if (data.complete) {
      addLog('✓ All terminals have been processed by the AI!', 'success');
      addLog(`  Total proposals generated: ${twinStatus?.totalProposals ?? '—'}`, 'info');
      setCompletedPhases(prev => new Set(prev).add('twin'));
    } else {
      addLog(`✓ AI processed: ${data.terminal}`, 'success');
      addLog(`  "${data.content?.substring(0, 120)}..."`, 'ai');
      addLog(`  Remaining: ${data.remaining} of ${data.total} terminals`, 'info');
      setLastAiResult({ terminal: data.terminal, content: data.content });
    }

    await refreshTwinStatus();
  }

  async function refreshTwinStatus() {
    try {
      const res = await fetch('/api/twin/status');
      if (res.ok) {
        const data = await res.json();
        setTwinStatus(data);
      }
    } catch { /* silent */ }
  }

  function resetAll() {
    setCompletedPhases(new Set());
    setCurrentPhase('idle');
    setTwinStatus(null);
    setLastAiResult(null);
    setSimulatedDaysCount(0);
    setForceFailure('none');
    setRevenueMultiplier(1.0);
    setSimulateDays(1);
    setLogs([
      { time: ts(), message: '◈ Simulation reset. Ready for a new run.', type: 'info' },
    ]);
  }

  const activePhase = getActivePhase();
  const allDone = activePhase === 'complete';

  /* ── RENDER ─────────────────────────────── */
  return (
    <div className="h-full w-full overflow-y-auto bg-dot-matrix relative">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#0B0C10] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto p-8 space-y-8 relative z-10">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Interactive Simulation
            </h1>
            <p className="text-slate-400 mt-1 font-medium">
              Execute each phase hands-on. Customize parameters in real-time.
            </p>
          </div>
          {completedPhases.size > 0 && (
            <button
              onClick={resetAll}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2">
          {PHASES.map((phase, idx) => {
            const state = getPhaseState(phase.id);
            return (
              <div key={phase.id} className="flex items-center flex-1">
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  state === 'done' ? 'bg-emerald-500' :
                  state === 'active' ? 'bg-blue-500 animate-pulse' :
                  'bg-slate-800'
                }`} />
                {idx < PHASES.length - 1 && <div className="w-2" />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Phase Cards & Dynamic Config ────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* The Phases */}
            <div className="space-y-4">
              {PHASES.map((phase) => {
                const state = getPhaseState(phase.id);
                const isActive = state === 'active';
                const isDone = state === 'done';
                const isLocked = state === 'locked';
                const isRunning = loading && currentPhase === phase.id;

                return (
                  <motion.div
                    key={phase.id}
                    layout
                    className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                      isDone
                        ? 'bg-slate-900/30 border-emerald-500/20 opacity-60'
                        : isActive
                          ? `bg-slate-900/80 backdrop-blur-md ${phase.border} ${phase.glow}`
                          : 'bg-slate-900/20 border-slate-800/30 opacity-40'
                    }`}
                  >
                    <div className="flex items-start space-x-5">
                      {/* Status Icon */}
                      <div className={`mt-1 shrink-0 ${isDone ? 'text-emerald-500' : isActive ? phase.color : 'text-slate-700'}`}>
                        {isDone ? (
                          <CheckCircle2 size={28} />
                        ) : isRunning ? (
                          <Loader2 size={28} className="animate-spin" />
                        ) : (
                          <phase.icon size={28} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h2 className={`text-lg font-bold tracking-tight ${isDone ? 'text-slate-500 line-through' : isActive ? 'text-white' : 'text-slate-600'}`}>
                            {phase.title}
                          </h2>
                          {isDone && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              {phase.id === 'backfill' ? `${simulatedDaysCount} Days Simulated` : 'Complete'}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm leading-relaxed ${isActive ? 'text-slate-400' : 'text-slate-600'}`}>
                          {phase.description}
                        </p>

                        {/* Twin-specific progress */}
                        {phase.id === 'twin' && isActive && twinStatus && (
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>Terminals Processed</span>
                              <span className="font-mono text-slate-300">{twinStatus.processedTerminals} / {twinStatus.totalTerminals}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(twinStatus.processedTerminals / twinStatus.totalTerminals) * 100}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            {lastAiResult && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 mt-3"
                              >
                                <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-2">
                                  Last AI Output — {lastAiResult.terminal}
                                </p>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                  {lastAiResult.content}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0">
                        {isActive && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isRunning}
                            onClick={() => executePhase(phase.id)}
                            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                              isRunning
                                ? 'bg-slate-800 text-slate-500 cursor-wait'
                                : phase.id === 'twin'
                                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                                  : 'bg-slate-200 hover:bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                            }`}
                          >
                            {isRunning ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Running...</span>
                              </>
                            ) : phase.id === 'twin' ? (
                              <>
                                <Zap size={16} />
                                <span>Process Next</span>
                              </>
                            ) : (
                              <>
                                <Play size={16} />
                                <span>Execute</span>
                              </>
                            )}
                          </motion.button>
                        )}
                        {isDone && phase.id === 'backfill' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isRunning}
                            onClick={() => executePhase('backfill')}
                            className="flex items-center space-x-2 px-4 py-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                          >
                            <span>Simulate More</span>
                          </motion.button>
                        )}
                        {isLocked && (
                          <div className="px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-700 border border-slate-800 border-dashed">
                            Locked
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Dynamic Configurator Panel */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-6"
            >
              <div className="flex items-center space-x-2 text-slate-200">
                <Sliders size={20} className="text-blue-400" />
                <h3 className="text-md font-bold uppercase tracking-widest text-slate-200">
                  Dynamic Parameter Configurator
                </h3>
              </div>
              <p className="text-xs text-slate-500 -mt-3">
                Configure these options before clicking "Execute" on Phase 3: Simulate Time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Custom Days to Advance */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Days to Advance Time
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={simulateDays}
                    onChange={(e) => setSimulateDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#0B0C10] border border-slate-850 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Force Anomaly Dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Force Telemetry Anomaly on
                  </label>
                  <select
                    value={forceFailure}
                    onChange={(e) => setForceFailure(e.target.value)}
                    className="w-full bg-[#0B0C10] border border-slate-850 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="none">No Forced Anomalies (Default Probabilistic)</option>
                    {COMMUNITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Failure Severity Options */}
                {forceFailure !== 'none' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-2"
                  >
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Forced Pump Anomaly Severity
                    </label>
                    <div className="flex space-x-2">
                      {['DEGRADED', 'BROKEN', 'OPERATIONAL'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFailureType(type)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border uppercase tracking-wider transition-all ${
                            failureType === type
                              ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                              : 'bg-[#0B0C10] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Water Quality Toggle */}
                {forceFailure !== 'none' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-2"
                  >
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Force Water Quality Failure
                    </label>
                    <button
                      onClick={() => setWaterQualityFail(!waterQualityFail)}
                      className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl border flex items-center justify-between transition-all ${
                        waterQualityFail
                          ? 'bg-red-500/10 border-red-500/30 text-red-400'
                          : 'bg-[#0B0C10] border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="uppercase tracking-wider">
                        {waterQualityFail ? 'Forced Bad Quality (Fail)' : 'Standard Quality (Random)'}
                      </span>
                      {waterQualityFail ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                  </motion.div>
                )}

                {/* Revenue Multiplier Slider */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Daily Steward Revenue Level (Multiplier)
                    </label>
                    <span className="font-mono text-sm font-bold text-blue-400">
                      {revenueMultiplier.toFixed(1)}x
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0.1"
                      max="3.0"
                      step="0.1"
                      value={revenueMultiplier}
                      onChange={(e) => setRevenueMultiplier(parseFloat(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* All Done Banner */}
            <AnimatePresence>
              {allDone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center shadow-[0_0_40px_rgba(52,211,153,0.1)]"
                >
                  <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-black text-white tracking-tight mb-2">Simulation Complete</h2>
                  <p className="text-slate-400 max-w-md mx-auto">
                    All terminals have been processed. Navigate to the <strong className="text-white">Activity Map</strong> and <strong className="text-white">Intelligence Lab</strong> to explore the results.
                  </p>
                  <div className="flex justify-center gap-4 mt-6">
                    <a href="/dashboard/map" className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-colors">
                      <span>View Map</span>
                      <ChevronRight size={14} />
                    </a>
                    <a href="/dashboard/lab" className="flex items-center space-x-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-colors">
                      <span>Intelligence Lab</span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Live Console ──────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-[#0B0C10] rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border border-slate-800 relative group sticky top-8 h-[650px]">
              {/* Scanline */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-0 pointer-events-none opacity-20 group-hover:opacity-10 transition-opacity" />

              <div className="bg-slate-900/80 backdrop-blur p-4 flex items-center border-b border-slate-800 relative z-10">
                <Terminal size={16} className="text-slate-500 mr-2" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Live Console</span>
                <div className="ml-auto flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
              </div>

              <div ref={logRef} className="flex-1 p-5 font-mono text-xs overflow-y-auto space-y-2 relative z-10">
                {logs.map((log, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className="flex items-start space-x-2"
                  >
                    <span className="text-slate-700 shrink-0">[{log.time}]</span>
                    <span className={`leading-relaxed ${
                      log.type === 'info' ? 'text-slate-400' :
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'loading' ? 'text-blue-400 animate-pulse' :
                      log.type === 'ai' ? 'text-purple-300 italic' :
                      'text-slate-300'
                    }`}>
                      {log.message}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Status bar */}
              {twinStatus && (
                <div className="bg-slate-900/80 border-t border-slate-800 p-3 relative z-10">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    <span>Proposals: {twinStatus.totalProposals}</span>
                    <span>Nudges: {twinStatus.totalNudges}</span>
                    <span>{twinStatus.processedTerminals}/{twinStatus.totalTerminals} done</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
