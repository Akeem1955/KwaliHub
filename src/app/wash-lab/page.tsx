import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function WashLabReview() {
  const proposals = await prisma.proposal.findMany({
    include: { terminal: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Kwali WASH Lab</h1>
            <p className="text-slate-500 mt-1 font-medium">Community Stakeholder Panel Review Interface</p>
          </div>
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Switch User</Link>
        </div>

        {proposals.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
            <span className="block text-4xl mb-4">📭</span>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No Proposals Pending</h3>
            <p className="text-slate-500">The digital twin has not generated any new AI proposals to review at this time.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {proposals.map(proposal => (
              <div key={proposal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md mb-3 ${proposal.type === 'business_model' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {proposal.type.replace('_', ' ')}
                    </span>
                    <h2 className="text-xl font-bold text-slate-800">{proposal.terminal.community_name} Terminal</h2>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Generated: {new Date(proposal.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 font-bold tracking-wide rounded-full text-xs uppercase">
                    {proposal.status}
                  </div>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl"></div>
                  <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                    Generative AI Engine Output
                  </h3>
                  <p className="text-slate-700 leading-relaxed font-medium">{proposal.generated_content}</p>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Panel Feedback (Mocked)</h3>
                  {/* Simulated comments view */}
                  <div className="space-y-3 mb-6 text-sm">
                    {Math.random() > 0.5 ? (
                      <div className="bg-slate-50 p-3 rounded-lg text-slate-600 border border-slate-100">
                        <span className="font-bold text-slate-700 block text-xs mb-1">Community Rep</span>
                        "The women's group prefers the bulk delivery model. They say it saves time for farming."
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-3 rounded-lg text-slate-600 border border-slate-100">
                        <span className="font-bold text-slate-700 block text-xs mb-1">Ward Chief</span>
                        "Pricing seems too high for the dry season. We need a cooperative approach."
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold py-2.5 rounded-xl hover:bg-emerald-100 transition-colors">Approve Model</button>
                    <button className="flex-1 bg-white text-slate-700 border border-slate-300 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors">Request Changes</button>
                    <button className="flex-1 bg-red-50 text-red-700 border border-red-200 font-bold py-2.5 rounded-xl hover:bg-red-100 transition-colors">Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
