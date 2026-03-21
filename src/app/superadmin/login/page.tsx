'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        router.push('/superadmin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex items-center justify-center p-4 font-['Inter',sans-serif]">
      <div className="w-full max-w-md bg-[#1c1b1b] rounded-2xl shadow-xl p-8 border border-[#353534]/50">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#f3bc16] mb-2 tracking-tighter">BruteForce</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9b8f79]">Executive Portal</p>
        </div>
        
        {error && (
          <div className="bg-[#93000a]/20 text-[#ffb4ab] p-3 rounded-lg mb-6 text-sm border border-[#93000a]">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#d3c5ac] mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#131313] border border-[#353534] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f3bc16] focus:ring-1 focus:ring-[#f3bc16] transition-colors"
              placeholder="Enter email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#d3c5ac] mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#131313] border border-[#353534] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f3bc16] focus:ring-1 focus:ring-[#f3bc16] transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#f3bc16] hover:brightness-110 text-[#251a00] font-bold py-3 px-4 rounded-lg transition-all shadow-lg active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
