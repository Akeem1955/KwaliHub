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
    <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="absolute top-4 left-4 z-[400] bg-white p-4 rounded-xl shadow-md space-y-3 border border-slate-100">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Map Layers</h3>
        <label className="flex items-center space-x-3 text-sm text-slate-700 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={showSensors} 
            onChange={e => setShowSensors(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
          />
          <span className="group-hover:text-indigo-700 font-medium transition-colors">IoT Sensor Layer</span>
        </label>
        <label className="flex items-center space-x-3 text-sm text-slate-700 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={showPredictions} 
            onChange={e => setShowPredictions(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
          />
          <span className="group-hover:text-indigo-700 font-medium transition-colors">Digital Twin Overlay</span>
        </label>
      </div>

      <MapContainer center={center} zoom={8} scrollWheelZoom={false} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {terminals.map(t => {
          const latest = t.sensorReadings?.[0];
          const isBroken = latest?.pump_status === 'BROKEN';
          const isDegraded = latest?.pump_status === 'DEGRADED';
          
          // Anomaly detection for prediction layer
          const revenueDrop = t.stewardActivities?.length ? t.stewardActivities[0].revenue < 1000 : false;
          const predictFailure = isDegraded || revenueDrop;

          let color = '#10b981'; // Emerald 500
          if (isBroken) color = '#ef4444'; // Red 500
          else if (isDegraded) color = '#f59e0b'; // Amber 500

          return (
            <div key={t.id}>
              {showSensors && (
                <CircleMarker 
                  center={[t.latitude, t.longitude]} 
                  radius={8} 
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.8, weight: 2 }}
                  eventHandlers={{
                    click: () => onSelectTerminal && onSelectTerminal(t),
                    mouseover: (e) => {
                      const layer = e.target;
                      layer.setStyle({ fillOpacity: 1, radius: 10 });
                    },
                    mouseout: (e) => {
                      const layer = e.target;
                      layer.setStyle({ fillOpacity: 0.8, radius: 8 });
                    }
                  }}
                />
              )}

              {showPredictions && predictFailure && !isBroken && (
                <CircleMarker 
                  center={[t.latitude, t.longitude]} 
                  radius={24} 
                  pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.15, dashArray: '4', weight: 2 }}
                />
              )}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
