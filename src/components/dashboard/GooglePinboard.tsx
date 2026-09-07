"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

export default function GooglePinboard({ 
  points, 
  isDark, 
  selectedPoint, 
  setSelectedPoint 
}: { 
  points: any[]; 
  isDark: boolean; 
  selectedPoint: any; 
  setSelectedPoint: (p: any) => void; 
}) {
  const defaultCenter = { lat: 8.8772, lng: 7.0267 }; // Kwali, FCT
  const [aqi, setAqi] = useState<any>(null);
  const [pollen, setPollen] = useState<any>(null);

  useEffect(() => {
    const fetchEnvironmentData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) return;

        // Fetch Air Quality
        const aqRes = await fetch(`https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: { latitude: defaultCenter.lat, longitude: defaultCenter.lng }
          })
        });
        if (aqRes.ok) {
          const aqData = await aqRes.json();
          if (aqData.indexes && aqData.indexes.length > 0) {
            setAqi(aqData.indexes[0]);
          }
        }

        // Fetch Pollen (requires specific parameters)
        const pollenRes = await fetch(`https://pollen.googleapis.com/v1/forecast:lookup?key=${apiKey}&location.longitude=${defaultCenter.lng}&location.latitude=${defaultCenter.lat}&days=1`);
        if (pollenRes.ok) {
          const pollenData = await pollenRes.json();
          if (pollenData.dailyInfo && pollenData.dailyInfo.length > 0) {
            const today = pollenData.dailyInfo[0];
            const maxPollenInfo = today.pollenTypeInfo?.reduce((max: any, current: any) => 
              (current.indexInfo.value > (max?.indexInfo?.value || 0)) ? current : max
            , null);
            setPollen(maxPollenInfo);
          }
        }
      } catch (e) {
        console.error("Environment API error", e);
      }
    };
    fetchEnvironmentData();
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={11}
          mapId="DEMO_MAP_ID"
          disableDefaultUI={true}
          gestureHandling="greedy"
          colorScheme={isDark ? "DARK" : "LIGHT"}
        >
          {points.map((point) => {
            if (!point.latitude || !point.longitude) return null;
            const isSelected = selectedPoint?.id === point.id;
            const isCritical = point.status === "CRITICAL" || point.urgency === "HIGH";
            const isWarning = point.status === "WARNING" || point.urgency === "MEDIUM";
            const isSanitation = point.type === "SANITATION_HAZARD" || point.category; // Category is for citizen_reports
            
            return (
              <AdvancedMarker
                key={point.id}
                position={{ lat: Number(point.latitude), lng: Number(point.longitude) }}
                onClick={() => setSelectedPoint(point)}
                className="group z-10"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg border transition-transform hover:scale-125 cursor-pointer ${
                    isSelected ? "scale-125 ring-4 ring-[#1fcfab]/40" : ""
                  } ${
                    isCritical
                      ? "bg-red-500 border-red-300 text-white animate-pulse"
                      : isWarning
                      ? "bg-amber-500 border-amber-300 text-white"
                      : isSanitation
                      ? "bg-emerald-600 border-emerald-300 text-white"
                      : "bg-sky-500 border-sky-300 text-white"
                  }`}
                >
                  {isSanitation ? "🗑️" : "💧"}
                </div>
                
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap px-2 py-1 rounded-md text-[10px] font-semibold border pointer-events-none shadow-md z-30 ${
                    isDark ? "bg-[#071528] text-white border-white/20" : "bg-white text-slate-900 border-slate-300"
                  }`}
                >
                  {point.name || point.description}
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>

      {/* Environment Data Widget */}
      {(aqi || pollen) && (
        <div className={`absolute top-4 right-4 p-3 rounded-xl border shadow-sm flex flex-col gap-2 pointer-events-none z-10 ${
          isDark ? "bg-[#071528]/90 border-white/10 backdrop-blur-md text-white" : "bg-white/90 border-slate-200 backdrop-blur-md text-slate-900"
        }`}>
          {aqi && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-sm">🌬️</span>
              <div>
                <p className="opacity-60 text-[9px] uppercase tracking-wider">Air Quality</p>
                <p className="font-bold">{aqi.category}</p>
              </div>
            </div>
          )}
          {pollen && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-sm">🌼</span>
              <div>
                <p className="opacity-60 text-[9px] uppercase tracking-wider">Local Pollen</p>
                <p className="font-bold">{pollen.displayName}: {pollen.indexInfo.category}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
