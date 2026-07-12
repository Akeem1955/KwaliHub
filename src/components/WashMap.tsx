'use client';

import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

type WashMapProps = {
  terminals: any[];
  onSelectTerminal?: (terminal: any) => void;
};

export default function WashMap({ terminals, onSelectTerminal }: WashMapProps) {
  const [showSensors, setShowSensors] = useState(true);
  const [showPredictions, setShowPredictions] = useState(false);

  // Center around Kwali area roughly
  const center: [number, number] = [8.5, 7.5];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0B0C10]">
      {/* Layer Controls - Dark theme */}
      <div className="absolute top-6 left-6 z-[400] bg-slate-900/80 backdrop-blur-md p-4 rounded-xl shadow-2xl space-y-3 border border-slate-800">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overlay Controls</h3>
        <label className="flex items-center space-x-3 text-sm text-slate-300 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={showSensors} 
            onChange={e => setShowSensors(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500/50 transition-colors"
          />
          <span className="group-hover:text-blue-400 font-medium transition-colors">IoT Sensor Network</span>
        </label>
        <label className="flex items-center space-x-3 text-sm text-slate-300 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={showPredictions} 
            onChange={e => setShowPredictions(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-purple-500 focus:ring-purple-500/50 transition-colors"
          />
          <span className="group-hover:text-purple-400 font-medium transition-colors">Digital Twin Radar</span>
        </label>
      </div>

      <MapContainer center={center} zoom={8} scrollWheelZoom={false} className="h-full w-full z-0 bg-[#0B0C10]">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {terminals.map(t => {
          const latest = t.sensorReadings?.[0];
          const isBroken = latest?.pump_status === 'BROKEN';
          const isDegraded = latest?.pump_status === 'DEGRADED';
          
          // Anomaly detection for prediction layer
          const revenueDrop = t.stewardActivities?.length ? t.stewardActivities[0].revenue < 1000 : false;
          const predictFailure = isDegraded || revenueDrop;

          // Glowing Neon Colors
          let color = '#3b82f6'; // Electric Blue for operational
          let glowColor = 'rgba(59, 130, 246, 0.4)';
          if (isBroken) { color = '#ef4444'; glowColor = 'rgba(239, 68, 68, 0.4)'; }
          else if (isDegraded) { color = '#f59e0b'; glowColor = 'rgba(245, 158, 11, 0.4)'; }

          return (
            <div key={t.id}>
              {showSensors && (
                <>
                  {/* Outer glowing ring */}
                  <CircleMarker 
                    center={[t.latitude, t.longitude]} 
                    radius={16} 
                    pathOptions={{ color: 'transparent', fillColor: color, fillOpacity: 0.15 }}
                  />
                  {/* Inner core */}
                  <CircleMarker 
                    center={[t.latitude, t.longitude]} 
                    radius={6} 
                    pathOptions={{ color, fillColor: color, fillOpacity: 1, weight: 2 }}
                    eventHandlers={{
                      click: () => onSelectTerminal && onSelectTerminal(t),
                      mouseover: (e) => {
                        const layer = e.target;
                        layer.setStyle({ radius: 8 });
                      },
                      mouseout: (e) => {
                        const layer = e.target;
                        layer.setStyle({ radius: 6 });
                      }
                    }}
                  />
                </>
              )}

              {showPredictions && predictFailure && !isBroken && (
                <CircleMarker 
                  center={[t.latitude, t.longitude]} 
                  radius={30} 
                  pathOptions={{ color: '#a855f7', fillColor: '#a855f7', fillOpacity: 0.1, dashArray: '4', weight: 2 }}
                />
              )}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
