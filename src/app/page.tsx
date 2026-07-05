"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin')) router.push('/internal-app/admin');
    else if (email.includes('panel')) router.push('/wash-lab');
    else if (email.includes('steward')) router.push('/internal-app/steward');
    else alert('Unknown role for email');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">WASH-AI Nexus Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@kwali.gov.ng"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
              value="password"
              readOnly
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Sign In
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-500">
          <p>Demo accounts (auto-routes based on email keyword):</p>
          <ul className="list-disc ml-5">
            <li>admin@kwali.gov.ng</li>
            <li>panel@kwali.gov.ng</li>
            <li>steward.bako@kwali.gov.ng</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
