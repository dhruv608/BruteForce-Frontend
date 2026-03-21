'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createAdminAction, updateAdminAction, deleteAdminAction, getBatchesByCityAction } from '../../actions/admin-actions';
import SuperadminSidebar from '../SuperadminSidebar';

interface AdminData {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  city?: { id: number; city_name: string };
  batch?: { id: number; batch_name: string };
}

interface CityData {
  id: number;
  city_name: string;
}

interface BatchData {
  id: number;
  batch_name: string;
  year?: number;
}

export default function AdminsClient({ 
  initialAdmins, 
  cities, 
  batches 
}: { 
  initialAdmins: AdminData[], 
  cities: CityData[], 
  batches: BatchData[] 
}) {
  const [isDark, setIsDark] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [batchFilter, setBatchFilter] = useState('All Batches');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  const [isPending, startTransition] = useTransition();

  // Modals Setup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create'|'edit'>('create');
  const [deleteAdminId, setDeleteAdminId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Cascading Dropdown States
  const [formCityName, setFormCityName] = useState('');
  const [formYear, setFormYear] = useState('');
  const [fetchedBatches, setFetchedBatches] = useState<BatchData[]>([]);
  const [isFetchingBatches, setIsFetchingBatches] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    email: '',
    password: '',
    role: 'TEACHER',
    city_id: '',
    batch_id: ''
  });

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

  // Next.js hot-reloads initialAdmins after a Server Action triggers revalidatePath.
  const filteredAdmins = useMemo(() => {
    return initialAdmins.filter(admin => {
      const matchSearch = search.trim() === '' || 
        admin.name?.toLowerCase().includes(search.toLowerCase()) || 
        admin.email?.toLowerCase().includes(search.toLowerCase());
      
      const matchCity = cityFilter === 'All Cities' || admin.city?.city_name === cityFilter;
      const matchBatch = batchFilter === 'All Batches' || admin.batch?.batch_name === batchFilter;
      const matchRole = roleFilter === 'All Roles' || admin.role === roleFilter;

      return matchSearch && matchCity && matchBatch && matchRole;
    });
  }, [initialAdmins, search, cityFilter, batchFilter, roleFilter]);

  const resetFilters = () => {
    setSearch('');
    setCityFilter('All Cities');
    setBatchFilter('All Batches');
    setRoleFilter('All Roles');
  };

  const updateFilters = (filterType: string, value: string) => {
    switch(filterType) {
      case 'search': setSearch(value); break;
      case 'city': setCityFilter(value); break;
      case 'batch': setBatchFilter(value); break;
      case 'role': setRoleFilter(value); break;
    }
  };

  const roles = ['TEACHER', 'SUPERADMIN'];

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // CASCADING LOGIC
  const availableYears = useMemo(() => {
    if (!fetchedBatches) return [];
    const years = fetchedBatches.map(b => b.year).filter(Boolean);
    return Array.from(new Set(years)).sort();
  }, [fetchedBatches]);

  const batchesForYear = useMemo(() => {
    if (!formYear) return [];
    return fetchedBatches.filter(b => b.year === Number(formYear));
  }, [fetchedBatches, formYear]);

  const handleCityChange = async (cityName: string) => {
    setFormCityName(cityName);
    setFormYear('');
    setFetchedBatches([]);
    setFormData(prev => ({ ...prev, city_id: '', batch_id: '' }));

    if (!cityName) return;

    const cityObj = cities.find(c => c.city_name === cityName);
    if (cityObj) {
      setFormData(prev => ({ ...prev, city_id: cityObj.id.toString() }));
    }

    setIsFetchingBatches(true);
    try {
        const batchesData = await getBatchesByCityAction(cityName);
        setFetchedBatches(batchesData);
    } finally {
        setIsFetchingBatches(false);
    }
  };

  const handleYearChange = (year: string) => {
    setFormYear(year);
    setFormData(prev => ({ ...prev, batch_id: '' }));
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: 0, name: '', email: '', password: '', role: 'TEACHER', city_id: '', batch_id: '' });
    setFormCityName('');
    setFormYear('');
    setFetchedBatches([]);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = async (admin: AdminData) => {
    setModalMode('edit');
    setErrorMsg('');
    const cityName = admin.city?.city_name || '';
    
    setFormCityName(cityName);
    setFormYear('');
    setFetchedBatches([]);

    setFormData({ 
      id: admin.id, 
      name: admin.name, 
      email: admin.email, 
      password: '', 
      role: admin.role, 
      city_id: admin.city?.id?.toString() || '', 
      batch_id: admin.batch?.id?.toString() || '' 
    });
    
    setIsModalOpen(true);

    if (cityName) {
        setIsFetchingBatches(true);
        const batchesData = await getBatchesByCityAction(cityName);
        setFetchedBatches(batchesData);
        setIsFetchingBatches(false);

        if (admin.batch?.id) {
            const foundBatch = batchesData.find((b: BatchData) => b.id === admin.batch?.id);
            if (foundBatch && foundBatch.year) {
                setFormYear(foundBatch.year.toString());
            }
        }
    }
  };

  // Prevent submission unless Batch is selected IF City is selected and Batches exist
  const isSubmitDisabled = isPending || (formCityName ? (formYear ? !formData.batch_id : true) : false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setErrorMsg('');
    startTransition(async () => {
        let res;
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            city_id: formData.city_id || undefined,
            batch_id: formData.batch_id || undefined,
        };

        if(modalMode === 'create') {
            res = await createAdminAction(payload);
        } else {
            res = await updateAdminAction(formData.id, payload);
        }

        if(res.success) {
            setIsModalOpen(false);
            router.refresh(); // Fetch latest from server organically
        } else {
            setErrorMsg(res.message || 'Error saving admin');
        }
    });
  };

  const handleDelete = async () => {
    if(!deleteAdminId) return;
    startTransition(async () => {
        const res = await deleteAdminAction(deleteAdminId);
        if(res.success) {
            setDeleteAdminId(null);
            router.refresh();
        } else {
            alert(res.message || 'Error deleting admin');
        }
    });
  };

  return (
    <div className="flex min-h-screen bg-background text-on-surface transition-colors duration-300">
      <SuperadminSidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-background text-on-surface">
        <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/20">
          <div className="flex justify-between items-center px-8 py-4 w-full">
            <div className="flex items-center gap-4">
              <span className="text-on-surface font-headline font-semibold text-lg">Admin Management</span>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => setIsDark(!isDark)} className="text-outline hover:text-on-surface transition-colors opacity-80 hover:opacity-100">
                <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
              </button>
            </div>
          </div>
        </header>

        <section className="p-8 space-y-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight">
                Teachers<span style={{ fontSize: '2.25rem', letterSpacing: '-0.025em' }}>&nbsp;Management</span>
              </h2>
              <p className="text-on-surface-variant font-body">Manage all administrators · assign cities and batches</p>
            </div>
            <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded font-semibold transition-transform active:scale-95 shadow-lg shadow-primary-container/20">
              <span className="material-symbols-outlined text-xl">add</span>
              <span>Create Admin</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-6 bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-sm">
            <div className="lg:col-span-1">
              <label className="block text-[10px] uppercase tracking-widest text-outline font-bold mb-2">Search</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                <input 
                  value={search}
                  onChange={(e) => updateFilters('search', e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-lg pl-10 py-3 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-primary-container" 
                  placeholder="Name or email..." 
                  type="text" 
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-outline font-bold mb-2">City</label>
              <select 
                value={cityFilter}
                onChange={(e) => updateFilters('city', e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-lg py-3 text-on-surface focus:ring-1 focus:ring-primary-container"
              >
                <option>All Cities</option>
                {cities.map(c => <option key={c.id} value={c.city_name}>{c.city_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-outline font-bold mb-2">Batch</label>
              <select 
                value={batchFilter}
                onChange={(e) => updateFilters('batch', e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-lg py-3 text-on-surface focus:ring-1 focus:ring-primary-container"
              >
                <option>All Batches</option>
                {batches.map(b => <option key={b.id} value={b.batch_name}>{b.batch_name}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-[10px] uppercase tracking-widest text-outline font-bold mb-2">Role</label>
                <select 
                  value={roleFilter}
                  onChange={(e) => updateFilters('role', e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-lg py-3 text-on-surface focus:ring-1 focus:ring-primary-container"
                >
                  <option>All Roles</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button 
                onClick={resetFilters}
                className="bg-surface-variant text-on-surface-variant p-3 rounded-lg hover:text-on-surface transition-colors h-[48px] flex items-center justify-center"
              >
                <span className="material-symbols-outlined">filter_list_off</span>
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/30 shadow-sm relative">
            {isPending && (
                <div className="absolute inset-0 bg-surface/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
                    <span className="material-symbols-outlined animate-spin text-primary-container text-4xl">refresh</span>
                </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high sticky top-0 z-10">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-outline font-extrabold">Name</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-outline font-extrabold">Email</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-outline font-extrabold">Role</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-outline font-extrabold">City</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-outline font-extrabold">Batch</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-outline font-extrabold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredAdmins.length > 0 ? filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container font-bold text-xs">
                            {getInitials(admin.name)}
                          </div>
                          <span className="font-semibold text-on-surface">{admin.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-mono text-sm">{admin.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center min-w-[100px] px-3 py-1 rounded-full bg-secondary-container/30 text-secondary text-[10px] font-bold uppercase tracking-wider">
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant text-sm">{admin.city?.city_name || '-'}</td>
                      <td className="px-6 py-4 text-on-surface-variant text-sm">{admin.batch?.batch_name || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(admin)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-container/30 text-primary-container hover:bg-primary-container hover:text-on-primary-container transition-all text-[11px] font-bold uppercase">
                            <span className="material-symbols-outlined text-sm">edit</span>
                            <span>Edit</span>
                          </button>
                          <button onClick={() => setDeleteAdminId(admin.id)} className="p-2 text-error hover:bg-error/10 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">No admins found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant/10">
              <p className="text-xs text-outline font-medium">
                Showing <span className="text-on-surface">{filteredAdmins.length > 0 ? 1 : 0}-{filteredAdmins.length}</span> of <span className="text-on-surface">{initialAdmins.length}</span> admins
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-2xl border border-outline-variant/20 overflow-hidden">
                  <div className="p-6 border-b border-outline-variant/10">
                      <h3 className="text-xl font-headline font-bold text-on-surface">
                          {modalMode === 'create' ? 'Create New Admin' : 'Edit Admin'}
                      </h3>
                  </div>
                  <form onSubmit={handleSave} className="p-6 space-y-6">
                      {errorMsg && <div className="p-3 bg-error/10 text-error rounded-lg text-sm font-semibold">{errorMsg}</div>}
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-[11px] uppercase tracking-wider text-outline font-bold">Full Name</label>
                              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-container-low border-none rounded-lg py-3 text-on-surface focus:ring-1 focus:ring-primary-container" />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[11px] uppercase tracking-wider text-outline font-bold">Email Address</label>
                              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-surface-container-low border-none rounded-lg py-3 text-on-surface focus:ring-1 focus:ring-primary-container" />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-[11px] uppercase tracking-wider text-outline font-bold">Role</label>
                              <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-surface-container-low border-none rounded-lg py-3 text-on-surface focus:ring-1 focus:ring-primary-container">
                                  <option value="TEACHER">TEACHER</option>
                                  <option value="SUPERADMIN">SUPERADMIN</option>
                              </select>
                          </div>
                          <div className="space-y-1">
                              <label className="text-[11px] uppercase tracking-wider text-outline font-bold">
                                  Password {modalMode === 'edit' && <span className="lowercase text-outline opacity-70">(leave blank to keep current)</span>}
                              </label>
                              <input required={modalMode === 'create'} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-surface-container-low border-none rounded-lg py-3 text-on-surface focus:ring-1 focus:ring-primary-container" />
                          </div>
                      </div>

                      {/* Cascading Assignment */}
                      <div className="border border-outline-variant/20 rounded-lg p-5 bg-surface-container-low space-y-4">
                          <h4 className="font-headline font-semibold text-sm mb-2 text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-lg">account_tree</span>
                              Cascading Assignment 
                          </h4>
                          
                          <div className="space-y-1">
                              <label className="text-[11px] uppercase tracking-wider text-outline font-bold">1. Select City (Optional)</label>
                              <select value={formCityName} onChange={e => handleCityChange(e.target.value)} disabled={isFetchingBatches} className="w-full bg-surface-container-lowest border-none rounded-lg py-3 text-on-surface focus:ring-1 focus:ring-primary-container">
                                  <option value="">None</option>
                                  {cities.map(c => <option key={c.id} value={c.city_name}>{c.city_name}</option>)}
                              </select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1 relative">
                                  <label className="text-[11px] uppercase tracking-wider text-outline font-bold">2. Select Year</label>
                                  <select value={formYear} onChange={e => handleYearChange(e.target.value)} disabled={!formCityName || isFetchingBatches || availableYears.length === 0} className="w-full bg-surface-container-lowest border-none rounded-lg py-3 text-on-surface focus:ring-1 focus:ring-primary-container disabled:opacity-50">
                                      <option value="">{isFetchingBatches ? 'Loading...' : (availableYears.length === 0 && formCityName ? 'No Batches Found' : 'Select Year')}</option>
                                      {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                  </select>
                              </div>
                              
                              <div className="space-y-1">
                                  <label className="text-[11px] uppercase tracking-wider text-outline font-bold">3. Select Batch</label>
                                  <select value={formData.batch_id} onChange={e => setFormData({...formData, batch_id: e.target.value})} disabled={!formYear || batchesForYear.length === 0} className="w-full bg-surface-container-lowest border-none rounded-lg py-3 text-on-surface focus:ring-1 focus:ring-primary-container disabled:opacity-50">
                                      <option value="">Select Batch</option>
                                      {batchesForYear.map(b => <option key={b.id} value={b.id}>{b.batch_name}</option>)}
                                  </select>
                              </div>
                          </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-on-surface font-semibold hover:bg-surface-container transition-colors">Cancel</button>
                          <button type="submit" disabled={isSubmitDisabled} className="px-6 py-2.5 bg-primary-container text-on-primary-container rounded-lg font-bold hover:brightness-105 transition-colors disabled:opacity-50 shadow-sm border border-transparent">
                              {isPending ? 'Saving...' : 'Save Admin'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteAdminId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest w-full max-w-sm rounded-xl shadow-2xl border border-outline-variant/20 overflow-hidden text-center p-6 space-y-6">
                <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl">warning</span>
                </div>
                <div>
                    <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Delete Admin?</h3>
                    <p className="text-on-surface-variant text-sm">This action cannot be undone. Are you sure you want to completely remove this administrator from the system?</p>
                </div>
                <div className="flex justify-center gap-3">
                    <button disabled={isPending} onClick={() => setDeleteAdminId(null)} className="px-5 py-2.5 rounded-lg text-on-surface font-semibold hover:bg-surface-container transition-colors">Cancel</button>
                    <button disabled={isPending} onClick={handleDelete} className="px-5 py-2.5 bg-error text-on-error rounded-lg font-bold hover:brightness-105 transition-colors disabled:opacity-50">
                        {isPending ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}
