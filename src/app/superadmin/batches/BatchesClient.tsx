'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import SuperadminSidebar from '../SuperadminSidebar';
import { createBatchAction, updateBatchAction, deleteBatchAction } from '../../actions/batch-actions';

interface BatchData {
  id: number;
  batch_name: string;
  year: number;
  city_id: number;
  city?: { id: number; city_name: string };
  _count?: { students: number; classes: number };
}

interface CityData {
  id: number;
  city_name: string;
}

export default function BatchesClient({ 
  initialBatches, 
  cities 
}: { 
  initialBatches: BatchData[], 
  cities: CityData[] 
}) {
  const [isDark, setIsDark] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Filters
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [yearFilter, setYearFilter] = useState('Year');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [deleteBatchParams, setDeleteBatchParams] = useState<{ id: number, name: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    id: 0,
    batch_name: '',
    year: new Date().getFullYear().toString(),
    city_id: ''
  });

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

  // Dynamic Year Dropdown Logic based on selected City
  const availableYears = useMemo(() => {
    let relevantBatches = initialBatches;
    if (cityFilter !== 'All Cities') {
      relevantBatches = initialBatches.filter(b => b.city?.city_name === cityFilter);
    }
    const years = relevantBatches.map(b => b.year).filter(Boolean);
    return Array.from(new Set(years)).sort((a,b) => b-a);
  }, [initialBatches, cityFilter]);

  // Reset year filter if it falls out of scope
  useEffect(() => {
    if (yearFilter !== 'Year' && !availableYears.includes(Number(yearFilter))) {
      setYearFilter('Year');
    }
  }, [cityFilter, availableYears, yearFilter]);

  // Filter batches for Table
  const filteredBatches = useMemo(() => {
    return initialBatches.filter(batch => {
      const matchSearch = search.trim() === '' || 
        batch.batch_name.toLowerCase().includes(search.toLowerCase()) || 
        batch.city?.city_name.toLowerCase().includes(search.toLowerCase());
      
      const matchCity = cityFilter === 'All Cities' || batch.city?.city_name === cityFilter;
      const matchYear = yearFilter === 'Year' || batch.year.toString() === yearFilter;
      
      return matchSearch && matchCity && matchYear;
    });
  }, [initialBatches, search, cityFilter, yearFilter]);

  // Handlers
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: 0, batch_name: '', year: new Date().getFullYear().toString(), city_id: '' });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (batch: BatchData) => {
    setModalMode('edit');
    setFormData({ 
      id: batch.id, 
      batch_name: batch.batch_name, 
      year: batch.year.toString(), 
      city_id: batch.city_id.toString() 
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.batch_name || !formData.year || !formData.city_id) return;

    setErrorMsg('');
    startTransition(async () => {
      let res;
      const payload = {
        batch_name: formData.batch_name.trim(),
        year: parseInt(formData.year),
        city_id: parseInt(formData.city_id)
      };

      if (modalMode === 'create') {
        res = await createBatchAction(payload);
      } else {
        res = await updateBatchAction(formData.id, payload);
      }

      if (res.success) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        setErrorMsg(res.message || 'Error saving batch');
      }
    });
  };

  const handleDeleteParams = () => {
    if (!deleteBatchParams) return;
    
    setErrorMsg('');
    startTransition(async () => {
      const res = await deleteBatchAction(deleteBatchParams.id);
      if (res.success) {
        setDeleteBatchParams(null);
        router.refresh();
      } else {
        setErrorMsg(res.message || 'Error deleting batch');
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-background text-on-surface transition-colors duration-300">
      
      <SuperadminSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TopNavBar Component */}
        <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/20 flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-on-surface transition-colors">menu_open</span>
            <h2 className="font-headline font-semibold text-on-surface">Batch Management</h2>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsDark(!isDark)} className="text-outline hover:text-on-surface transition-colors opacity-80 hover:opacity-100">
              <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8 space-y-12 max-w-7xl mx-auto w-full relative">
          
          {isPending && (
            <div className="absolute inset-0 bg-surface/10 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined animate-spin text-primary-container text-4xl">refresh</span>
            </div>
          )}

          {/* Hero Header Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tighter">Batch Management</h1>
              <p className="text-on-surface-variant text-lg max-w-xl">Manage all batches · each batch belongs to a city and year. Centralized control for academic cycle deployment.</p>
            </div>
            <button onClick={openCreateModal} className="bg-primary-container text-on-primary-container px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary-container/20">
              <span className="material-symbols-outlined">add</span>
              Create Batch
            </button>
          </section>

          {/* Filters Section */}
          <section className="bg-surface-container-low p-6 rounded-lg flex flex-wrap gap-4 items-center border border-outline-variant/30 shadow-sm">
            <div className="flex-1 min-w-[300px] relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-surface-container-high border-none rounded-lg py-3 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all" 
                placeholder="Search batch name or city..." 
                type="text" 
              />
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="bg-surface-container-high border-none rounded-lg py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary-container min-w-[160px]"
              >
                <option value="All Cities">All Cities</option>
                {cities.map(c => <option key={c.id} value={c.city_name}>{c.city_name}</option>)}
              </select>
              
              <select 
                value={yearFilter}
                onChange={e => setYearFilter(e.target.value)}
                className="bg-surface-container-high border-none rounded-lg py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary-container min-w-[120px]"
              >
                <option value="Year">Year</option>
                {availableYears.map(y => <option key={y} value={y.toString()}>{y}</option>)}
              </select>
              
              <button 
                onClick={() => { setSearch(''); setCityFilter('All Cities'); setYearFilter('Year'); }}
                className="flex items-center gap-2 text-outline hover:text-on-surface px-4 py-2 transition-colors rounded hover:bg-surface-variant"
              >
                <span className="material-symbols-outlined">filter_list_off</span>
                Clear
              </button>
            </div>
          </section>

          {/* Table Section */}
          <section className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm border border-outline-variant/30 relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high">
                    <th className="px-6 py-5 font-headline text-xs uppercase tracking-widest text-outline">Batch Name</th>
                    <th className="px-6 py-5 font-headline text-xs uppercase tracking-widest text-outline">Year</th>
                    <th className="px-6 py-5 font-headline text-xs uppercase tracking-widest text-outline">City</th>
                    <th className="px-6 py-5 font-headline text-xs uppercase tracking-widest text-outline">Students</th>
                    <th className="px-6 py-5 font-headline text-xs uppercase tracking-widest text-outline text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredBatches.length > 0 ? filteredBatches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-8 bg-primary-container rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span className="font-bold text-on-surface">{batch.batch_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="bg-secondary-container text-on-secondary-container text-[11px] font-mono font-bold px-2.5 py-1 rounded">
                          {batch.year}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-on-surface-variant">{batch.city?.city_name || '-'}</td>
                      <td className="px-6 py-6 font-mono text-sm text-on-surface-variant">{batch._count?.students || 0}</td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => openEditModal(batch)} className="p-2 hover:bg-surface-variant rounded-full text-primary-container hover:brightness-110 transition-all active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => setDeleteBatchParams({ id: batch.id, name: batch.batch_name })} className="p-2 hover:bg-error-container/20 rounded-full text-error hover:text-error transition-all active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant font-medium">No batches found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination / Summary Status */}
            <div className="px-6 py-5 flex items-center justify-between bg-surface-container-highest/20 border-t border-outline-variant/10">
              <p className="text-sm text-outline font-medium">
                Showing <span className="text-on-surface font-bold">{filteredBatches.length > 0 ? 1 : 0} - {filteredBatches.length}</span> of <span className="text-on-surface font-bold">{initialBatches.length}</span> batches
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Create / Edit Modal (Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-xl shadow-2xl border border-outline-variant/20 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10">
                <h3 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container">groups</span>
                    {modalMode === 'create' ? 'Create New Batch' : 'Edit Batch'}
                </h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
                {errorMsg && <div className="p-3 bg-error/10 text-error rounded-lg text-sm font-semibold border border-error/20">{errorMsg}</div>}
                
                <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-outline font-bold">Batch Name</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.batch_name} 
                      onChange={e => setFormData({ ...formData, batch_name: e.target.value })} 
                      className="w-full bg-surface-container-low border-none rounded-lg py-3.5 text-on-surface focus:ring-1 focus:ring-primary-container transition-all" 
                      placeholder="e.g. Masterclass Q1..." 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-outline font-bold">Year</label>
                      <input 
                        required 
                        type="number" 
                        min="2000"
                        max="2100"
                        value={formData.year} 
                        onChange={e => setFormData({ ...formData, year: e.target.value })} 
                        className="w-full bg-surface-container-low border-none rounded-lg py-3.5 text-on-surface focus:ring-1 focus:ring-primary-container transition-all" 
                      />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-outline font-bold">City</label>
                      <select 
                        required 
                        value={formData.city_id} 
                        onChange={e => setFormData({ ...formData, city_id: e.target.value })} 
                        className="w-full bg-surface-container-low border-none rounded-lg py-3.5 text-on-surface focus:ring-1 focus:ring-primary-container transition-all"
                      >
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c.id} value={c.id.toString()}>{c.city_name}</option>)}
                      </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-3 rounded-lg bg-surface-container border border-outline-variant/20 text-on-surface font-semibold hover:bg-surface-variant transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isPending} className="flex-1 px-5 py-3 bg-primary-container text-on-primary-container rounded-lg font-bold hover:brightness-105 transition-colors disabled:opacity-50">
                        {isPending ? 'Saving...' : 'Save Batch'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Warning Modal (Overlay) */}
      {deleteBatchParams && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-low max-w-md w-full rounded-xl shadow-2xl border border-outline-variant/15 p-8 space-y-6">
            
            {errorMsg && <div className="p-3 bg-error/10 text-error rounded-lg text-sm font-semibold border border-error/20">{errorMsg}</div>}
            
            <div className="flex items-center gap-4 text-error">
              <span className="material-symbols-outlined text-4xl bg-error/10 p-2 rounded-full">warning</span>
              <h3 className="text-2xl font-bold font-headline">Delete Batch?</h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed text-sm">
                This action is permanent. Deleting <span className="text-on-surface font-bold font-mono bg-white/5 py-0.5 px-2 rounded">{deleteBatchParams.name}</span> will irrevocably break associated student records and leaderboards attached to this batch.
            </p>
            <div className="flex gap-4 pt-4">
              <button disabled={isPending} onClick={() => { setDeleteBatchParams(null); setErrorMsg(''); }} className="flex-1 px-6 py-3 rounded-lg bg-surface-container-high text-on-surface font-semibold hover:bg-surface-variant transition-colors disabled:opacity-50">
                  Cancel
              </button>
              <button disabled={isPending} onClick={handleDeleteParams} className="flex-1 px-6 py-3 rounded-lg bg-error text-on-error font-semibold hover:brightness-110 transition-all disabled:opacity-50">
                  {isPending ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
