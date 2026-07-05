"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function NewStewardPage() {
  const [eligibilityChecked, setEligibilityChecked] = useState({
    nomination: false,
    vetted: false,
    training: false
  });

  const isEligible = Object.values(eligibilityChecked).every(Boolean);

  return (
    <div className="min-h-screen bg-gray-100 text-black p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/internal-app/admin" className="text-blue-600 mb-4 inline-block">&larr; Back to Dashboard</Link>
        <h1 className="text-3xl font-bold mb-6">Provision New Steward</h1>
        
        <form className="space-y-6 bg-white p-8 shadow-sm rounded-xl" onSubmit={(e) => { e.preventDefault(); alert('Steward Provisioned and Matched to Business Model!'); }}>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">1. Profile Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" required className="mt-1 block w-full border border-gray-300 rounded p-2" placeholder="e.g. Amina Musa" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address (Login ID)</label>
              <input type="email" required className="mt-1 block w-full border border-gray-300 rounded p-2" placeholder="e.g. amina@kwali.gov.ng" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assign Terminal</label>
              <select required className="mt-1 block w-full border border-gray-300 rounded p-2">
                <option value="">Select a community terminal...</option>
                <option value="1">Kwali Central (Lat: 8.1, Lng: 7.2)</option>
                <option value="2">Bako (Lat: 8.3, Lng: 7.4)</option>
                <option value="3">Sheda (Lat: 8.5, Lng: 7.1)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold border-b pb-2">2. Eligibility Checklist</h2>
            <p className="text-sm text-gray-500 mb-2">The candidate must pass all vetting criteria before an account can be created and a business model matched.</p>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 text-blue-600 rounded" 
                  checked={eligibilityChecked.nomination} 
                  onChange={e => setEligibilityChecked(p => ({...p, nomination: e.target.checked}))} />
                <span className="font-medium text-blue-900">Community Nomination Received & Verified</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 text-blue-600 rounded" 
                  checked={eligibilityChecked.vetted} 
                  onChange={e => setEligibilityChecked(p => ({...p, vetted: e.target.checked}))} />
                <span className="font-medium text-blue-900">Vetted by WASH Unit (No conflicts of interest)</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 text-blue-600 rounded" 
                  checked={eligibilityChecked.training} 
                  onChange={e => setEligibilityChecked(p => ({...p, training: e.target.checked}))} />
                <span className="font-medium text-blue-900">Completed Data Reporting & Maintenance Training</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!isEligible}
            className={`w-full p-4 rounded-lg text-white font-bold text-lg transition-colors ${isEligible ? 'bg-green-600 hover:bg-green-700 shadow-md' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Create Account & Request AI Business Model Match
          </button>
        </form>
      </div>
    </div>
  );
}
