import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function HouseholdsLogPage() {
  const nudges = await prisma.nudge.findMany({
    include: {
      household: {
        include: {
          terminal: true,
          contact: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const households = await prisma.household.findMany({
    include: { terminal: true }
  });

  return (
    <div className="p-8 min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link href="/internal-app/admin" className="text-indigo-600 mb-6 inline-flex items-center hover:text-indigo-800 font-medium transition-colors">
          <span className="mr-2">&larr;</span> Back to Admin Dashboard
        </Link>
        
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Households Log</h1>
            <p className="text-slate-500 mt-1 font-medium">Monitor NDPR-compliant consent flags and generative SMS nudges.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Household Records</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 h-[600px] overflow-y-auto">
              {households.map(h => (
                <div key={h.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800 text-sm">{h.community_name} HH</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${h.consent_logged ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {h.consent_logged ? 'CONSENT YES' : 'CONSENT NO'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></span>
                    Barrier: <span className="font-semibold text-slate-700 ml-1">{h.stated_barrier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Generative Nudges Dispatch Log</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-5 w-1/4">Recipient (Anon ID)</th>
                    <th className="p-5 w-1/2">Generated Message (SMS)</th>
                    <th className="p-5">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {nudges.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-slate-500 font-medium">
                        <span className="block text-2xl mb-2">📱</span>
                        No nudges generated yet. Run the Digital Twin process to dispatch messages.
                      </td>
                    </tr>
                  ) : nudges.map(nudge => (
                    <tr key={nudge.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5 align-top">
                        <div className="font-mono text-xs text-slate-400 mb-1.5 bg-slate-100 inline-block px-1.5 py-0.5 rounded">{nudge.householdId.slice(0, 8)}</div>
                        <div className="font-bold text-slate-700 text-xs uppercase tracking-wider">{nudge.household.community_name}</div>
                      </td>
                      <td className="p-5">
                        <div className="bg-indigo-50 border border-indigo-100 text-indigo-900 p-4 rounded-xl relative shadow-sm">
                          {/* Chat bubble tail */}
                          <span className="absolute -left-1.5 top-5 w-3 h-3 bg-indigo-50 border-l border-b border-indigo-100 transform rotate-45"></span>
                          <p className="font-medium leading-relaxed">{nudge.message_text}</p>
                        </div>
                      </td>
                      <td className="p-5 align-top">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] tracking-wider uppercase rounded-md">
                          {nudge.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm flex items-start shadow-sm">
              <span className="text-amber-500 mr-3 text-lg leading-none">💡</span>
              <div>
                <strong className="block mb-1 text-amber-900">Simulation Note:</strong> 
                <span className="opacity-90">Generative nudges are strictly tied to <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono text-xs">Household.consent_logged</code>. If you inspect the list above, you will only see nudges for households that have CONSENT YES.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
