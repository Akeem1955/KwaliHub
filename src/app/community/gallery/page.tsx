"use client";

import { useCommunity } from "../CommunityContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function CommunityGalleryPage() {
  const { isDark } = useCommunity();
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("aquawatch-gallery");
    if (saved) {
      try {
        setPhotos(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-8 pb-12"
    >
      <div className={`p-8 sm:p-10 rounded-[2.5rem] border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-sm transition-all min-h-[70vh] flex flex-col ${
        isDark ? "bg-[#071528] border-white/10" : "bg-white border-none shadow-sm"
      }`}>
        <div className="mb-8">
          <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Your Impact Gallery
          </h3>
          <p className={`text-sm sm:text-base mt-2 max-w-2xl ${isDark ? "text-white/60" : "text-slate-600"}`}>
            See how your vital contributions are actively used by Water Board and NGOs to deploy repairs and keep Kwali safe.
          </p>
        </div>

        {photos.length === 0 ? (
          <div className={`flex-1 flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed ${
            isDark ? "bg-white/5 border-white/20 text-white/50" : "bg-slate-50 border-slate-300 text-slate-500"
          }`}>
            <span className="text-6xl mb-6 opacity-50">🖼️</span>
            <h4 className={`text-lg font-bold ${isDark ? "text-white/80" : "text-slate-700"}`}>No Evidence Uploaded Yet</h4>
            <p className="text-sm max-w-md mt-3 leading-relaxed">
              When you upload photos of broken boreholes or sanitation hazards, they will appear here. The government uses this visual proof to prioritize repairs immediately.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((p) => (
              <div key={p.id} className={`rounded-xl overflow-hidden border ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                <img src={p.image} alt="Scout Upload" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    p.category === "WATER_POINT" 
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400" 
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {p.category.replace("_", " ")}
                  </span>
                  <p className={`mt-2 text-sm font-semibold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                    {p.description}
                  </p>
                  <p className={`mt-1 text-xs ${isDark ? "text-white/40" : "text-slate-500"}`}>
                    {new Date(p.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
