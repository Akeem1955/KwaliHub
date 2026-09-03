'use client';

import React, { useState } from 'react';
import { X, MapPin, Send, AlertTriangle, CheckCircle2, Loader2, Navigation } from 'lucide-react';
import { CommunityNode } from './GoogleWASHMap';

type CitizenReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  communities: CommunityNode[];
  onReportSubmitted: () => void;
};

const CATEGORIES = [
  { id: 'NO_WATER', label: 'Taps Dry / No Water', icon: '🚱' },
  { id: 'DIRTY_WATER', label: 'Dirty / Contaminated Water', icon: '🟤' },
  { id: 'PUMP_LEAK', label: 'Pipe / Pump Leakage', icon: '💧' },
  { id: 'LOW_PRESSURE', label: 'Low Flow / Weak Pressure', icon: '⏱️' },
  { id: 'SANITATION_HAZARD', label: 'Sanitation / Drainage Hazard', icon: '⚠️' },
];

export default function CitizenReportModal({
  isOpen,
  onClose,
  communities,
  onReportSubmitted,
}: CitizenReportModalProps) {
  const [communityId, setCommunityId] = useState(communities[0]?.id || 'bako');
  const [reporterName, setReporterName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('NO_WATER');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation Error:', err);
        setGpsLoading(false);
        // Fallback to selected community's coordinates
        const selected = communities.find((c) => c.id === communityId);
        if (selected) {
          setCoords({ lat: selected.latitude, lng: selected.longitude });
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage('Please provide a brief description of the incident.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communityId,
          reporterName: reporterName.trim() || 'Anonymous Community Resident',
          phone: phone.trim() || 'Anonymous',
          category,
          description: description.trim(),
          urgency,
          latitude: coords?.lat,
          longitude: coords?.lng,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to record report.');
      }

      setSuccessMessage('Your report has been logged and integrated into the Kwali Digital Twin.');
      setTimeout(() => {
        onReportSubmitted();
        onClose();
        setSuccessMessage(null);
        setDescription('');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Community Incident Report</h3>
              <p className="text-xs text-gray-500">Citizen Crowdsourced WASH Telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 animate-bounce" />
            <p className="text-sm font-semibold text-gray-800">{successMessage}</p>
            <p className="text-xs text-gray-500">Digital Twin models updated with your observation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-sm">
            
            {/* Community select */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Affected Community / Settlement
              </label>
              <select
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Pop. {c.population.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Category selection chips */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Issue Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center space-x-2 rounded-lg border p-2 text-left text-xs font-medium transition-all ${
                      category === cat.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                        : 'border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Description of Observations
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Pump pressure dropped yesterday; water is cloudy with red silt..."
                className="w-full rounded-lg border border-gray-300 p-2.5 text-xs text-gray-800 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Urgency & Geolocation row */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Urgency Level
                </label>
                <div className="flex space-x-1">
                  {(['MEDIUM', 'HIGH', 'CRITICAL'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`flex-1 rounded-md py-1 text-[11px] font-bold uppercase transition-all ${
                        urgency === lvl
                          ? lvl === 'CRITICAL'
                            ? 'bg-red-600 text-white'
                            : lvl === 'HIGH'
                            ? 'bg-amber-500 text-white'
                            : 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Device GPS Location
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gpsLoading}
                  className="flex w-full items-center justify-center space-x-1.5 rounded-lg border border-gray-300 bg-gray-50 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Navigation className={`h-3.5 w-3.5 text-blue-600 ${gpsLoading ? 'animate-spin' : ''}`} />
                  <span>{coords ? 'GPS Captured ✓' : 'Pin My Location'}</span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-red-50 p-2 text-xs font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center space-x-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                <span>Submit to Twin</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
