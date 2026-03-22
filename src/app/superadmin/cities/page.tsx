"use client";

import React, { useEffect, useState } from 'react';
import { getAllCities, createCity, deleteCity, updateCity, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from '@/components/Modal';
import { Pagination } from '@/components/Pagination';
import { ActionButtons } from '@/components/ActionButtons';
import { DeleteModal } from '@/components/DeleteModal';
import { TableSkeleton } from '@/components/TableSkeleton';
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Building2, Trash2, Edit } from 'lucide-react';

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  
  // Modals
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDelOpen, setDelOpen] = useState(false);
  const [targetCity, setTargetCity] = useState<City | null>(null);

  // Forms
  const [cityName, setCityName] = useState('');
  const [editCityName, setEditCityName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const respCities = await getAllCities();
      const respBatches = await getAllBatches();
      setCities(Array.isArray(respCities) ? respCities : []);
      setAllBatches(Array.isArray(respBatches) ? respBatches : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!cityName) return;
    setSubmitting(true);
    try {
      await createCity({ city_name: cityName });
      setCreateOpen(false);
      setCityName('');
      fetchData();
    } catch (err) {
      alert("Failed to create city");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (city: City) => {
    setTargetCity(city);
    setEditCityName(city.city_name);
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!targetCity || !editCityName) return;
    setSubmitting(true);
    try {
      await updateCity(targetCity.id, { city_name: editCityName });
      setEditOpen(false);
      setTargetCity(null);
      setEditCityName('');
      fetchData();
    } catch (err) {
      alert("Failed to update city");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!targetCity) return;
    setSubmitting(true);
    try {
      await deleteCity(targetCity.id);
      setDelOpen(false);
      setTargetCity(null);
      fetchData();
    } catch (err) {
      alert("Failed to delete city. It may have linked batches.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCities = cities.filter(c => c.city_name.toLowerCase().includes(search.toLowerCase()));
  const paginatedCities = filteredCities.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-1">City Management</h2>
        <p className="text-sm text-muted-foreground">Manage operating cities and their associated batches.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full sm:max-w-xs group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <Input 
            placeholder="Search cities by name..."
            className="w-full pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
          <Building2 className="w-4 h-4 mr-2" />
          Create City
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City Name</TableHead>
              <TableHead>Total Batches</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton row={
                <TableRow>
                  <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[90px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[90px] rounded-full" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              } />
            ) : filteredCities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No cities found.</TableCell>
              </TableRow>
            ) : (
              paginatedCities.map((city) => {
                const batchesInCity = allBatches.filter(b => b.city_id === city.id);
                const batchesCount = batchesInCity.length;
                const studentsCount = batchesInCity.reduce((sum, b) => sum + (b._count?.students || 0), 0);
                
                return (
                  <TableRow key={city.id}>
                    <TableCell className="font-semibold">{city.city_name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {batchesCount} batches
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {studentsCount} students
                      </span>
                    </TableCell>
                    <TableCell className="text-right flex justify-end">
                      <ActionButtons 
                        onEdit={() => openEdit(city)} 
                        onDelete={() => { setTargetCity(city); setDelOpen(true); }} 
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        <Pagination 
          currentPage={currentPage} 
          totalItems={filteredCities.length} 
          limit={limit} 
          onPageChange={setCurrentPage}
          onLimitChange={setLimit}
          showLimitSelector={true}
          loading={loading}
        />
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} title="Create New City" subtitle="City will be available for batch assignment immediately." icon={<Building2 className="text-primary w-8 h-8" />}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">City Name *</label>
            <Input 
              placeholder="e.g. Hyderabad"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={submitting || !cityName}>Confirm</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditOpen} 
        onClose={() => setEditOpen(false)} 
        title="Edit City" 
        subtitle="Update city name. This will reflect across all associated batches." 
        icon={<Building2 className="text-primary w-8 h-8" />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">City Name *</label>
            <Input 
              placeholder="e.g. Hyderabad"
              value={editCityName}
              onChange={(e) => setEditCityName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={submitting || !editCityName}>Update City</Button>
          </div>
        </div>
      </Modal>

      <DeleteModal
        isOpen={isDelOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={handleDelete}
        submitting={submitting}
        title="Delete City"
        itemName={targetCity?.city_name}
        warningText="Deleting a city will fail if there are active associated batches attached to it."
      />

    </div>
  );
}
