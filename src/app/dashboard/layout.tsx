'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Map, Users, BrainCircuit, TerminalSquare, Settings, Activity, BookOpen } from 'lucide-react';
import { GuideProvider, GuideOverlay, useGuide } from '@/components/GuideOverlay';

const MENU_ITEMS = [
  { name: 'Activity Map', href: '/dashboard/map', icon: Map },
  { name: 'Intelligence Lab', href: '/dashboard/lab', icon: BrainCircuit },
  { name: 'Steward Network', href: '/dashboard/steward', icon: Users },
  { name: 'Simulation Control', href: '/dashboard/control', icon: TerminalSquare },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isGuideActive, setGuideActive } = useGuide();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0C10] text-slate-200 font-sans">
      
      {/* Sidebar Navigation */}
      <nav className="w-72 bg-[#0B0C10] border-r border-slate-800/50 flex flex-col z-50 shrink-0">
        
        {/* Brand / Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center glow-blue">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-tight">WASH-AI Nexus</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">Command Center</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-2">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="block relative">
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-xl bg-slate-800/60 border border-slate-700/50 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative px-4 py-3 flex items-center space-x-3 rounded-xl transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}>
                  <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-blue-400' : ''} />
                  <span className={`text-sm font-medium ${isActive ? 'font-semibold tracking-tight' : ''}`}>
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Guide Toggle & Footer */}
        <div className="p-6 space-y-4 border-t border-slate-800/50">
          <button 
            onClick={() => setGuideActive(!isGuideActive)}
            className={`flex items-center space-x-3 w-full transition-colors ${isGuideActive ? 'text-blue-400' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <BookOpen size={16} />
            <span className="text-xs uppercase tracking-widest font-medium">
              {isGuideActive ? 'Guide: ON' : 'Guide: OFF'}
            </span>
          </button>
          <Link href="/" className="flex items-center space-x-3 text-slate-500 hover:text-slate-300 transition-colors">
            <Settings size={16} />
            <span className="text-xs uppercase tracking-widest font-medium">Exit Console</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-[#0B0C10]">
        {children}
        <GuideOverlay pathname={pathname} />
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuideProvider>
      <DashboardShell>{children}</DashboardShell>
    </GuideProvider>
  );
}
