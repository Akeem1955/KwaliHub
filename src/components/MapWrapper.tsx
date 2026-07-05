'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import TerminalDetailPanel from './TerminalDetailPanel';

// Dynamically import the map component with SSR disabled
const WashMap = dynamic(() => import('./WashMap'), { ssr: false });

type MapWrapperProps = {
  terminals: any[];
};

export default function MapWrapper({ terminals }: MapWrapperProps) {
  const [selectedTerminal, setSelectedTerminal] = useState<any | null>(null);

  return (
    <div className="relative h-full w-full">
      <WashMap 
        terminals={terminals} 
        onSelectTerminal={(t) => setSelectedTerminal(t)} 
      />
      
      <TerminalDetailPanel 
        terminal={selectedTerminal} 
        onClose={() => setSelectedTerminal(null)} 
      />
    </div>
  );
}
