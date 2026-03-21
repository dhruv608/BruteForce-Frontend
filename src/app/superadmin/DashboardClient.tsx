'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SuperadminSidebar from './SuperadminSidebar';

interface StatData {
  totalCities: number;
  totalBatches: number;
  totalAdmins: number;
}

interface CityData {
  id: number;
  city_name: string;
  created_at: string;
  total_batches: number;
  total_students: number;
}

export default function DashboardClient({ stats, cities }: { stats: StatData, cities: CityData[] }) {
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/superadmin/login');
      router.refresh();
    } catch(e) {
      console.error(e);
    }
  }

  const maxBatches = cities.length > 0 ? Math.max(...cities.map(c => c.total_batches)) : 1;

  return (
    <div className="flex min-h-screen bg-background text-on-surface transition-colors duration-300">
      <SuperadminSidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-background text-on-surface">
        <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/20">
          <div className="flex justify-between items-center px-8 py-4 w-full">
            <div className="flex items-center gap-4">
              <h2 className="font-headline font-bold text-lg text-on-background">DashBoard</h2>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => setIsDark(!isDark)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-10 space-y-12 max-w-7xl mx-auto w-full">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/30 hover:border-primary-container/40 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>location_city</span>
                </div>
              </div>
              <p className="text-3xl font-headline font-bold text-on-surface">{stats.totalCities}</p>
              <p className="text-label text-outline font-medium tracking-wide">Total Cities</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/30 hover:border-primary-container/40 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>groups</span>
                </div>
              </div>
              <p className="text-3xl font-headline font-bold text-on-surface">{stats.totalBatches}</p>
              <p className="text-label text-outline font-medium tracking-wide">Total Batches</p>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/30 hover:border-primary-container/40 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>admin_panel_settings</span>
                </div>
              </div>
              <p className="text-3xl font-headline font-bold text-on-surface">{stats.totalAdmins}</p>
              <p className="text-label text-outline font-medium tracking-wide">Total Admins</p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-headline font-semibold text-xl text-on-surface">City Batch Distribution</h3>
                  <button className="text-primary-container text-sm font-bold flex items-center gap-1 hover:underline">
                    View Detailed Report <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
                <div className="space-y-6">
                  {cities.length > 0 ? cities.map((city) => (
                    <div className="space-y-2" key={city.id}>
                      <div className="flex justify-between items-end">
                        <span className="font-headline font-medium text-on-surface">{city.city_name}</span>
                        <span className="font-mono text-sm text-outline">{city.total_batches} Batches</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-container rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.max((city.total_batches / maxBatches) * 100, 2)}%` }}></div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-outline text-sm">No cities data available.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-md border border-outline-variant/20">
                <h3 className="font-headline font-bold text-lg mb-6 border-b border-outline-variant/10 pb-4 text-on-surface">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-primary-container text-on-primary-container rounded-lg font-bold hover:brightness-105 active:scale-[0.98] transition-all shadow-sm">
                    <span>+ Add Admin</span>
                    <span className="material-symbols-outlined">person_add</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 border border-outline-variant text-on-surface rounded-lg font-semibold hover:bg-surface-container transition-colors">
                    <span>+ Add City</span>
                    <span className="material-symbols-outlined">add_location_alt</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 border border-outline-variant text-on-surface rounded-lg font-semibold hover:bg-surface-container transition-colors">
                    <span>+ Add Batch</span>
                    <span className="material-symbols-outlined">group_add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
