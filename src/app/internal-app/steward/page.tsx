import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import RevenueChart from '@/components/RevenueChart';

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
    return <div className="p-8 text-slate-500">No steward found. Please run the backfill script first.</div>;
  }

  const latestReading = steward.terminal.sensorReadings[0];
  const isBroken = latestReading?.pump_status === "BROKEN";
  const isDegraded = latestReading?.pump_status === "DEGRADED";
  
  const statusColor = isBroken ? 'bg-red-100 text-red-700 border-red-200' : isDegraded ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';

  const chartData = steward.terminal.stewardActivities.map(act => ({
    date: new Date(act.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
    revenue: act.revenue
  }));

  const totalWeeklyRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="p-8 min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Steward Dashboard</h1>
            <p className="text-slate-500 mt-1 font-medium">{steward.terminal.community_name} Terminal</p>
          </div>
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Switch User</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sensor Widget */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              Live IoT Sensors
              <span className={`px-2 py-0.5 rounded-md border font-bold ${statusColor}`}>
                {latestReading?.pump_status || 'UNKNOWN'}
              </span>
            </h2>
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <span className="text-sm font-medium text-slate-500">Flow Rate</span>
                <span className="font-bold text-xl text-slate-800">{latestReading?.flow_rate.toFixed(1)} <span className="text-sm font-normal text-slate-400">L/min</span></span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <span className="text-sm font-medium text-slate-500">Energy Use</span>
                <span className="font-bold text-xl text-slate-800">{latestReading?.energy_use.toFixed(1)} <span className="text-sm font-normal text-slate-400">W</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-slate-500">Water Quality</span>
                <span className={`font-bold text-lg ${latestReading?.water_quality === 'FAIL' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {latestReading?.water_quality}
                </span>
              </div>
            </div>
          </div>

          {/* Action & Trends Widget */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Weekly Revenue Trend</h2>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-slate-800">₦{totalWeeklyRevenue}</span>
                <span className="text-sm font-medium text-slate-400">last 7 days</span>
              </div>
              {chartData.length > 0 ? (
                <RevenueChart data={chartData} />
              ) : (
                <div className="h-24 flex items-center justify-center text-slate-400 text-sm">No data available</div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-sm hover:bg-indigo-700 transition-colors">
                + Log Daily Activity
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-800 mb-4">Activity Log</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {steward.terminal.stewardActivities.map((act) => {
              const hasIssue = !!act.reported_issue;
              return (
                <li key={act.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 mb-1">
                      {new Date(act.timestamp).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                    {hasIssue ? (
                      <span className="text-sm font-medium text-red-600 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        {act.reported_issue}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-slate-500 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                        Routine Operations (Clear)
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-lg text-emerald-600">₦{act.revenue}</span>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{act.transactions_count} Transactions</span>
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
