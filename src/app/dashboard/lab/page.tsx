import { prisma } from '@/lib/prisma';
import { BrainCircuit, MailWarning, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WashLabReview() {
  const proposals = await prisma.proposal.findMany({
    include: { terminal: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="h-full w-full p-8 overflow-y-auto bg-dot-matrix relative">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#0B0C10] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">AI Intelligence Lab</h1>
            <p className="text-slate-400 mt-1 font-medium">Review Digital Twin Generative AI Anomalies & Proposals</p>
          </div>
        </div>

        {proposals.length === 0 ? (
          <div className="bg-slate-900/60 backdrop-blur-md p-12 text-center rounded-2xl border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <span className="block text-4xl mb-4 opacity-50">📭</span>
            <h3 className="text-lg font-bold text-slate-300 mb-1">No AI Intelligence Generated</h3>
            <p className="text-slate-500">The digital twin has not detected any anomalies or generated new models to review.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {proposals.map(proposal => {
              const isFailed = proposal.generated_content.includes("Failed to generate");
              const glowClass = isFailed ? 'glow-red' : 'glow-blue';
              const badgeClass = proposal.type === 'business_model' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
              
              return (
                <div key={proposal.id} className={`bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 transition-shadow ${glowClass}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border mb-3 ${badgeClass}`}>
                        {proposal.type === 'business_model' ? <FileText size={12} className="mr-2"/> : <MailWarning size={12} className="mr-2"/>}
                        {proposal.type.replace('_', ' ')}
                      </span>
                      <h2 className="text-xl font-bold text-white tracking-tight">{proposal.terminal.community_name} Terminal</h2>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-mono">Timestamp: {new Date(proposal.createdAt).toISOString()}</p>
                    </div>
                    <div className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold tracking-wide rounded-full text-[10px] uppercase">
                      {proposal.status}
                    </div>
                  </div>
                  
                  <div className={`p-5 rounded-xl border relative mb-6 ${isFailed ? 'bg-red-950/30 border-red-900/50' : 'bg-slate-950/50 border-slate-800'}`}>
                    <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${isFailed ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center ${isFailed ? 'text-red-400' : 'text-blue-400'}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${isFailed ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                      Gemini 2.5 Output Node
                    </h3>
                    <p className={`leading-relaxed text-sm ${isFailed ? 'text-red-300/80 font-mono' : 'text-slate-300'}`}>{proposal.generated_content}</p>
                  </div>

                  <div className="border-t border-slate-800 pt-5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Stakeholder Feedback Simulation</h3>
                    {/* Simulated comments view */}
                    <div className="space-y-3 mb-6 text-sm">
                      {!isFailed ? (
                        Math.random() > 0.5 ? (
                          <div className="bg-slate-950/50 p-4 rounded-lg text-slate-300 border border-slate-800">
                            <span className="font-bold text-emerald-400 block text-xs mb-1">Community Rep Node</span>
                            "The women's group prefers the bulk delivery model. They say it saves time for farming."
                          </div>
                        ) : (
                          <div className="bg-slate-950/50 p-4 rounded-lg text-slate-300 border border-slate-800">
                            <span className="font-bold text-amber-400 block text-xs mb-1">Ward Chief Node</span>
                            "Pricing seems too high for the dry season. We need a cooperative approach."
                          </div>
                        )
                      ) : (
                         <div className="bg-red-950/20 p-4 rounded-lg text-red-400/80 border border-red-900/30 font-mono text-xs">
                            <span className="font-bold block mb-1">SYSTEM WARNING</span>
                            Generation failed due to API limits or context errors. Retrying next cycle.
                         </div>
                      )}
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button className="flex-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold py-2.5 rounded-xl hover:bg-emerald-500/20 transition-colors text-sm">Approve Node</button>
                      <button className="flex-1 bg-slate-800 text-slate-300 border border-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-700 transition-colors text-sm">Recalibrate</button>
                      <button className="flex-1 bg-red-500/10 text-red-400 border border-red-500/30 font-bold py-2.5 rounded-xl hover:bg-red-500/20 transition-colors text-sm">Reject Node</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
