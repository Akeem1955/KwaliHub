import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import MapWrapper from '@/components/MapWrapper';

export default async function AdminDashboard() {
  const terminals = await prisma.terminal.findMany({
    include: {
      sensorReadings: { orderBy: { timestamp: 'desc' }, take: 14 },
      stewards: true,
      stewardActivities: { orderBy: { timestamp: 'desc' }, take: 1 }
    }
  });

  const operationalCount = terminals.filter(t => t.sensorReadings?.[0]?.pump_status === 'OPERATIONAL').length;
  const brokenCount = terminals.filter(t => t.sensorReadings?.[0]?.pump_status === 'BROKEN').length;
  const degradedCount = terminals.filter(t => t.sensorReadings?.[0]?.pump_status === 'DEGRADED').length;

  return (
    <div className="p-8 min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">WASH Unit Operations</h1>
          <p className="text-slate-500 mt-1">Live spatial overview of Kwali Area Council terminals</p>
        </div>
        <div className="space-x-4">
          <Link href="/households" className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors font-medium">
            Household Logs
          </Link>
          <Link href="/internal-app/admin/stewards/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors font-medium">
            + Provision Steward
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <MapWrapper terminals={terminals} />
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">System Health</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600 font-medium text-sm">Operational</span>
                  <span className="font-bold text-emerald-600">{operationalCount}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(operationalCount/terminals.length)*100}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600 font-medium text-sm">Degraded</span>
                  <span className="font-bold text-amber-500">{degradedCount}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${(degradedCount/terminals.length)*100}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600 font-medium text-sm">Broken</span>
                  <span className="font-bold text-red-500">{brokenCount}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(brokenCount/terminals.length)*100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
