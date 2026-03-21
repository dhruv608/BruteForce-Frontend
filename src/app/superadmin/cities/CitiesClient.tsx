'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createCityAction, deleteCityAction } from '../../actions/city-actions';
import SuperadminSidebar from '../SuperadminSidebar';

interface CityData {
  id: number;
  city_name: string;
  total_batches: number;
  total_students: number;
}

export default function CitiesClient({ initialCities }: { initialCities: CityData[] }) {
  const [isDark, setIsDark] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Modals Setup
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteCityParams, setDeleteCityParams] = useState<{ id: number, name: string } | null>(null);
  
  const [cityName, setCityName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  // Calculate top-level metrics
  const topMetrics = useMemo(() => {
    const totalBatches = initialCities.reduce((acc, c) => acc + (c.total_batches || 0), 0);
    const totalStudents = initialCities.reduce((acc, c) => acc + (c.total_students || 0), 0);
    return {
      cities: initialCities.length,
      batches: totalBatches,
      students: totalStudents
    };
  }, [initialCities]);

  // Handlers
  const handleCreateCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim()) return;

    setErrorMsg('');
    startTransition(async () => {
      const res = await createCityAction({ city_name: cityName.trim() });
      if (res.success) {
        setIsCreateModalOpen(false);
        setCityName('');
        router.refresh(); // Fetch new list naturally via Next.js RSC
      } else {
        setErrorMsg(res.message || 'Error creating city');
      }
    });
  };

  const handleDeleteCity = () => {
    if (!deleteCityParams) return;
    
    setErrorMsg('');
    startTransition(async () => {
      const res = await deleteCityAction(deleteCityParams.id);
      if (res.success) {
        setDeleteCityParams(null);
        router.refresh(); 
      } else {
        setErrorMsg(res.message || 'Error deleting city');
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-background text-on-surface transition-colors duration-300">
      
      {/* SideNavBar Component */}
      <SuperadminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* TopNavBar Component */}
        <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/20 flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-4">
            <span className="text-on-surface font-headline font-semibold text-lg">City Management</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsDark(!isDark)} className="text-outline hover:text-on-surface transition-colors opacity-80 hover:opacity-100">
              <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-12 max-w-7xl mx-auto w-full relative">
          
          {isPending && (
              <div className="absolute inset-0 bg-surface/10 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-lg">
                  <span className="material-symbols-outlined animate-spin text-primary-container text-4xl">refresh</span>
              </div>
          )}
          
          {/* Page Header Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-5xl font-bold font-headline tracking-tight text-on-surface">City Management</h2>
              <p className="text-on-surface-variant text-lg">Manage all cities · each city hosts multiple batches and students</p>
            </div>
            <button onClick={() => { setIsCreateModalOpen(true); setErrorMsg(''); setCityName(''); }} className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-4 rounded-lg font-semibold hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-primary-container/20">
              <span className="material-symbols-outlined">add</span>
              Create City
            </button>
          </section>

          {/* Metrics Bento Grid (High-End Pattern) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-8 rounded-lg border-l-4 border-primary-container shadow-sm">
              <p className="text-sm font-label text-outline uppercase tracking-widest mb-2">Total Cities</p>
              <p className="text-4xl font-headline font-bold text-on-surface">{topMetrics.cities}</p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-lg border-l-4 border-tertiary-container shadow-sm">
              <p className="text-sm font-label text-outline uppercase tracking-widest mb-2">Total Batches</p>
              <p className="text-4xl font-headline font-bold text-on-surface">{topMetrics.batches}</p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-lg border-l-4 border-secondary-container shadow-sm">
              <p className="text-sm font-label text-outline uppercase tracking-widest mb-2">Total Students</p>
              <p className="text-4xl font-headline font-bold text-on-surface">{topMetrics.students.toLocaleString()}</p>
            </div>
          </section>

          {/* Table Section */}
          <section className="bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/30 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high text-outline text-xs uppercase tracking-[0.15em] font-semibold">
                    <th className="px-8 py-6">City Name</th>
                    <th className="px-8 py-6">Total Batches</th>
                    <th className="px-8 py-6">Total Students</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {initialCities.length > 0 ? initialCities.map((city, index) => (
                    <tr key={city.id} className={`${index % 2 !== 0 ? 'bg-surface/30' : ''} hover:bg-surface-container transition-colors group`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-container border border-outline-variant/10">
                            <span className="material-symbols-outlined">location_on</span>
                          </div>
                          <span className="text-on-surface font-semibold text-lg font-headline">{city.city_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">
                          {(city.total_batches || 0).toString().padStart(2, '0')} Batches
                        </span>
                      </td>
                      <td className="px-8 py-6 text-on-surface-variant font-mono">{city.total_students || 0} Students</td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={() => setDeleteCityParams({ id: city.id, name: city.city_name })} className="p-2 text-outline hover:text-error transition-colors rounded-full hover:bg-error/10 active:scale-95">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-8 text-center text-on-surface-variant">No cities found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Create City Modal (Overlay) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-surface-dim/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-xl shadow-2xl border border-outline-variant/20 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10">
                <h3 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container">location_on</span>
                    Create New City
                </h3>
            </div>
            <form onSubmit={handleCreateCity} className="p-6 space-y-6">
                {errorMsg && <div className="p-3 bg-error/10 text-error rounded-lg text-sm font-semibold border border-error/20">{errorMsg}</div>}
                
                <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-outline font-bold">City Name</label>
                    <input 
                      required 
                      type="text" 
                      value={cityName} 
                      onChange={e => setCityName(e.target.value)} 
                      className="w-full bg-surface-container-low border-none rounded-lg py-3.5 text-on-surface focus:ring-1 focus:ring-primary-container transition-all" 
                      placeholder="e.g. San Francisco..." 
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-5 py-3 rounded-lg bg-surface-container border border-outline-variant/20 text-on-surface font-semibold hover:bg-surface-variant transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isPending} className="flex-1 px-5 py-3 bg-primary-container text-on-primary-container rounded-lg font-bold hover:brightness-105 transition-colors disabled:opacity-50">
                        {isPending ? 'Creating...' : 'Create City'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Warning Modal (Overlay) */}
      {deleteCityParams && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-surface-dim/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-low max-w-md w-full rounded-xl shadow-2xl border border-outline-variant/15 p-8 space-y-6">
            
            {errorMsg && <div className="p-3 bg-error/10 text-error rounded-lg text-sm font-semibold border border-error/20">{errorMsg}</div>}
            
            <div className="flex items-center gap-4 text-error">
              <span className="material-symbols-outlined text-4xl bg-error/10 p-2 rounded-full">warning</span>
              <h3 className="text-2xl font-bold font-headline">Delete City?</h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed text-sm">
                This action is permanent. Deleting <span className="text-on-surface font-bold font-mono bg-surface-container/5 py-0.5 px-2 rounded">{deleteCityParams.name}</span> will also permanently remove all associated batch data and student records linked to this location.
            </p>
            <div className="flex gap-4 pt-4">
              <button disabled={isPending} onClick={() => { setDeleteCityParams(null); setErrorMsg(''); }} className="flex-1 px-6 py-3 rounded-lg bg-surface-container-high text-on-surface font-semibold hover:bg-surface-variant transition-colors disabled:opacity-50">
                  Cancel
              </button>
              <button disabled={isPending} onClick={handleDeleteCity} className="flex-1 px-6 py-3 rounded-lg bg-error text-on-error font-semibold hover:brightness-110 transition-all disabled:opacity-50">
                  {isPending ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
