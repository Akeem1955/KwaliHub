'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Sparkles, Cpu, AlertTriangle, Droplets, CheckCircle } from 'lucide-react';

export type CommunityNode = {
  id: string;
  name: string;
  lga: string;
  latitude: number;
  longitude: number;
  population: number;
  baseline_source: string;
  health_index: number;
  water_point_id: string;
  water_point_name: string;
  water_point_type: string;
  water_point_status: string;
  flow_rate_lpm: number;
  water_quality_score: number;
  ph: number;
  turbidity_ntu: number;
  tds_ppm: number;
};

export type CitizenReport = {
  id: string;
  community_id: string;
  community_name: string;
  reporter_name: string;
  category: string;
  description: string;
  urgency: string;
  latitude: number;
  longitude: number;
  status: string;
  reported_at: string;
};

type GoogleWASHMapProps = {
  communities: CommunityNode[];
  reports: CitizenReport[];
  selectedCommunity: CommunityNode | null;
  onSelectCommunity: (comm: CommunityNode) => void;
  onDiagnoseCommunity: (comm: CommunityNode) => void;
  onSimulateCommunity: (comm: CommunityNode) => void;
};

export default function GoogleWASHMap({
  communities,
  reports,
  selectedCommunity,
  onSelectCommunity,
  onDiagnoseCommunity,
  onSimulateCommunity,
}: GoogleWASHMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setLoadError('Google Maps API Key is not defined in environment variables.');
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    });

    loader
      .importLibrary('maps')
      .then(() => {
        if (!mapRef.current) return;
        const gMap = new google.maps.Map(mapRef.current, {
          center: { lat: 8.8450, lng: 7.0250 }, // Kwali LGA center
          zoom: 11,
          mapTypeId: 'roadmap',
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: false,
          styles: [
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          ],
        });

        infoWindowRef.current = new google.maps.InfoWindow();
        setMap(gMap);
        setMapsLoaded(true);
      })
      .catch((err) => {
        console.error('Google Maps Load Error:', err);
        setLoadError('Failed to load Google Maps JavaScript API.');
      });
  }, []);

  // Update Markers when communities or reports change
  useEffect(() => {
    if (!map || !mapsLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // 1. Render Community Water Point Markers
    communities.forEach((c) => {
      const isDegraded = c.water_point_status === 'DEGRADED';
      const isCritical = c.water_point_status === 'CRITICAL' || c.water_point_status === 'OFFLINE';
      
      const pinColor = isCritical ? '#ea4335' : isDegraded ? '#fbbc04' : '#34a853';

      const marker = new google.maps.Marker({
        position: { lat: Number(c.latitude), lng: Number(c.longitude) },
        map,
        title: `${c.name} - ${c.water_point_status}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: pinColor,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        onSelectCommunity(c);
        if (infoWindowRef.current) {
          const contentString = `
            <div style="font-family: Arial, sans-serif; padding: 6px; min-width: 220px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <h4 style="margin: 0; font-size: 14px; font-weight: bold; color: #1f2937;">${c.name}</h4>
                <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 9999px; background: ${
                  isCritical ? '#fee2e2; color: #dc2626' : isDegraded ? '#fef3c7; color: #b45309' : '#dcfce7; color: #15803d'
                };">${c.water_point_status}</span>
              </div>
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #4b5563;">
                <b>Flow:</b> ${c.flow_rate_lpm} L/min • <b>Quality:</b> ${c.water_quality_score}% • <b>Turbidity:</b> ${c.turbidity_ntu} NTU
              </p>
              <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">
                Population: ${c.population.toLocaleString()} | Health Index: ${c.health_index}/100
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(contentString);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current.push(marker);
    });

    // 2. Render Citizen Incident Markers
    reports.forEach((r) => {
      const marker = new google.maps.Marker({
        position: { lat: Number(r.latitude), lng: Number(r.longitude) },
        map,
        title: `Citizen Report: ${r.category} (${r.community_name})`,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 5,
          fillColor: r.urgency === 'CRITICAL' ? '#dc2626' : r.urgency === 'HIGH' ? '#ea580c' : '#2563eb',
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
        },
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="font-family: Arial, sans-serif; padding: 4px; max-width: 200px;">
              <b style="color: #dc2626; font-size: 12px;">Citizen Report: ${r.category.replace('_', ' ')}</b>
              <p style="font-size: 11px; margin: 4px 0; color: #374151;">"${r.description}"</p>
              <span style="font-size: 10px; color: #9ca3af;">Urgency: ${r.urgency} • ${r.community_name}</span>
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current.push(marker);
    });
  }, [map, mapsLoaded, communities, reports, onSelectCommunity]);

  // Center on selected community if changed from sidebar
  useEffect(() => {
    if (map && selectedCommunity) {
      map.panTo({
        lat: Number(selectedCommunity.latitude),
        lng: Number(selectedCommunity.longitude),
      });
      map.setZoom(13);
    }
  }, [map, selectedCommunity]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-xs">
      
      {/* Map Container */}
      <div ref={mapRef} className="h-full w-full min-h-[480px]" />

      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-10 rounded-lg border border-gray-200 bg-white/95 p-3 shadow-sm backdrop-blur-xs text-xs text-gray-700 space-y-2">
        <div className="font-semibold text-gray-900 border-b border-gray-100 pb-1">
          WASH Digital Twin Layers
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500 border border-white" />
          <span>Operational Point (&gt;15 LPM)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-amber-400 border border-white" />
          <span>Degraded / Weak Pressure</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-red-500 border border-white" />
          <span>Critical Anomaly / Offline</span>
        </div>
        <div className="flex items-center space-x-2 pt-1 border-t border-gray-100">
          <span className="h-3 w-3 inline-block bg-orange-600 rounded-xs" />
          <span>Citizen Reported Incident</span>
        </div>
      </div>

      {/* Selected Community Quick Actions Bar */}
      {selectedCommunity && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-10 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-gray-900 text-sm">{selectedCommunity.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  selectedCommunity.water_point_status === 'OPERATIONAL' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {selectedCommunity.water_point_status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedCommunity.water_point_name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 my-3 py-2 border-y border-gray-100 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Flow</div>
              <div className="text-xs font-semibold text-gray-800">{selectedCommunity.flow_rate_lpm} L/min</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Turbidity</div>
              <div className="text-xs font-semibold text-gray-800">{selectedCommunity.turbidity_ntu} NTU</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Quality Index</div>
              <div className="text-xs font-semibold text-gray-800">{selectedCommunity.water_quality_score}%</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDiagnoseCommunity(selectedCommunity)}
              className="flex-1 flex items-center justify-center space-x-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Synthesize</span>
            </button>
            <button
              onClick={() => onSimulateCommunity(selectedCommunity)}
              className="flex-1 flex items-center justify-center space-x-1.5 rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Pre-Simulate</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading or Error Overlay */}
      {!mapsLoaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-xs">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
            <p className="mt-2 text-xs font-medium text-gray-600">Connecting to Google Maps Platform...</p>
          </div>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50/90 p-4">
          <div className="max-w-md text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-500" />
            <p className="mt-2 text-xs font-semibold text-red-700">{loadError}</p>
          </div>
        </div>
      )}

    </div>
  );
}
