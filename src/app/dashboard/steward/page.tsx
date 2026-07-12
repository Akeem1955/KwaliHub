import { prisma } from '@/lib/prisma';
import RevenueChart from '@/components/RevenueChart';

export const dynamic = 'force-dynamic';

export default async function StewardDashboard() {
  const steward = await prisma.steward.findFirst({
    include: {
      terminal: {
        include: {
          sensorReadings: { orderBy: { timestamp: 'desc' }, take: 5 },
          stewardActivities: { orderBy: { timestamp: 'desc' }, take: 7 }
        }
      }
    }
  });

  if (!steward) {
    return <div className="p-8 text-slate-500 font-mono">NO_STEWARD_DATA_FOUND. RUN_BACKFILL_SEQUENCE.</div>;
  }

  const latestReading = steward.terminal.sensorReadings[0];
  const isBroken = latestReading?.pump_status === "BROKEN";
  const isDegraded = latestReading?.pump_status === "DEGRADED";
  
  const statusColor = isBroken ? 'bg-red-500/10 text-red-400 border-red-500/30' : isDegraded ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  const statusGlow = isBroken ? 'glow-red' : isDegraded ? 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'glow-blue';

  const chartData = steward.terminal.stewardActivities.map(act => ({
    date: new Date(act.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
    revenue: act.revenue
  }));

  const totalWeeklyRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="h-full w-full p-8 overflow-y-auto bg-dot-matrix relative">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#0B0C10] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Steward Telemetry</h1>
            <p className="text-slate-400 mt-1 font-medium">{steward.terminal.community_name} Terminal Data Stream</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sensor Widget */}
          <div className={`bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 ${statusGlow}`}>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
              Live IoT Sensors
              <span className={`px-2 py-0.5 rounded-md border text-[10px] uppercase font-bold tracking-widest ${statusColor}`}>
                {latestReading?.pump_status || 'UNKNOWN'}
              </span>
            </h2>
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                <span className="text-sm font-medium text-slate-400">Flow Rate</span>
                <span className="font-black text-2xl text-white">{latestReading?.flow_rate.toFixed(1)} <span className="text-xs font-medium text-slate-500">L/min</span></span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                <span className="text-sm font-medium text-slate-400">Energy Use</span>
                <span className="font-black text-2xl text-white">{latestReading?.energy_use.toFixed(1)} <span className="text-xs font-medium text-slate-500">W</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-slate-400">Water Quality</span>
                <span className={`font-bold text-lg ${latestReading?.water_quality === 'FAIL' ? 'text-red-400' : 'text-blue-400'}`}>
                  {latestReading?.water_quality}
                </span>
              </div>
            </div>
          </div>

          {/* Action & Trends Widget */}
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Weekly Revenue</h2>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">₦{totalWeeklyRevenue}</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">7 Day Delta</span>
              </div>
              {chartData.length > 0 ? (
                <RevenueChart data={chartData} />
              ) : (
                <div className="h-24 flex items-center justify-center text-slate-600 text-sm font-mono uppercase tracking-widest">No data available</div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800">
              <button className="w-full bg-slate-800 text-slate-300 border border-slate-700 font-bold py-3 rounded-xl shadow-md hover:bg-slate-700 hover:text-white transition-colors text-sm uppercase tracking-widest">
                + Upload Action Log
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Historical Activity Log</h2>
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden">
          <ul className="divide-y divide-slate-800/50">
            {steward.terminal.stewardActivities.map((act) => {
              const hasIssue = !!act.reported_issue;
              return (
                <li key={act.id} className="p-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-300 mb-1 font-mono text-sm">
                      {new Date(act.timestamp).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
                    </span>
                    {hasIssue ? (
                      <span className="text-xs font-medium text-red-400 flex items-center uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
                        {act.reported_issue}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-500 flex items-center uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 shadow-[0_0_5px_rgba(59,130,246,0.8)]"></span>
                        Nominal Operation
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-lg text-emerald-400">₦{act.revenue}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{act.transactions_count} TXNs</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
