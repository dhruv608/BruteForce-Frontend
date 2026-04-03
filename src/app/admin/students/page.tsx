"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import {
  getAdminStudents,
  createAdminStudent,
  updateAdminStudent,
  deleteAdminStudent
} from '@/services/admin.service';
import { AdminStudent } from '@/types/student';
import { handleToastError, showSuccess, showDeleteSuccess } from "@/utils/toast-system";
import { Users } from 'lucide-react';
import StudentsHeader from '@/components/admin/students/StudentsHeader';
import StudentsFilter from '@/components/admin/students/StudentsFilter';
import StudentsTable from '@/components/admin/students/StudentsTable';
import StudentsModals from '@/components/admin/students/StudentsModals';

export default function AdminStudentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedBatch, isLoadingContext } = useAdminStore();

  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // URL State
  const [sSearch, setSSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isDownloadReportOpen, setIsDownloadReportOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formEnrollmentId, setFormEnrollmentId] = useState('');
  const [formLeetcodeId, setFormLeetcodeId] = useState('');
  const [formGfgId, setFormGfgId] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Pagination
  const [limit, setLimit] = useState(10);
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (sSearch) params.set('search', sSearch);
    if (page > 1) params.set('page', page.toString());
    router.replace(`/admin/students?${params.toString()}`);
  }, [sSearch, page, router]);

  const fetchStudents = useCallback(async () => {
    if (!selectedBatch) return;
    setLoading(true);
    try {
      const p: any = { page, limit, batchSlug: selectedBatch.slug };
      if (sSearch) p.search = sSearch;

      const res = await getAdminStudents(p);
      setStudents(res.students);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
    } catch (err) {
      handleToastError(err);
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  }, [sSearch, page, limit, selectedBatch]);

  useEffect(() => {
    updateUrl();
    if (!isLoadingContext) {
      fetchStudents();
    }
  }, [updateUrl, fetchStudents, isLoadingContext]);

  // Whenever context changes, naturally reset pagination
  useEffect(() => {
    setPage(1);
  }, [selectedBatch?.id]);

  // Form Handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setSubmitting(true);
    try {
      await createAdminStudent({
        name: formName,
        email: formEmail,
        username: formUsername,
        password: formPassword || undefined,
        enrollment_id: formEnrollmentId,
        batch_id: selectedBatch?.id,
        leetcode_id: formLeetcodeId || undefined,
        gfg_id: formGfgId || undefined
      });
      setIsCreateOpen(false);
      resetForms();
      fetchStudents();
    } catch (err: any) {
      handleToastError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setFormError(''); setSubmitting(true);
    try {
      await updateAdminStudent(selectedStudent.id, {
        name: formName,
        email: formEmail,
        username: formUsername,
        enrollment_id: formEnrollmentId,
        leetcode_id: formLeetcodeId || undefined,
        gfg_id: formGfgId || undefined
      });
      setIsEditOpen(false);
      resetForms();
      fetchStudents();
    } catch (err: any) {
      handleToastError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedStudent) return;
    setFormError(''); setSubmitting(true);
    try {
      await deleteAdminStudent(selectedStudent.id);
      setIsDeleteOpen(false);
      resetForms();
      fetchStudents();
    } catch (err: any) {
      handleToastError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForms = () => {
    setFormName('');
    setFormEmail('');
    setFormUsername('');
    setFormPassword('');
    setFormEnrollmentId('');
    setFormLeetcodeId('');
    setFormGfgId('');
    setFormError('');
  };

  const handleBulkUploadSuccess = (result: any) => {
    // Show success message or refresh data
    fetchStudents();
  };

  const openEdit = (s: AdminStudent) => {
    setSelectedStudent(s);
    setFormName(s.name);
    setFormEmail(s.email);
    setFormUsername(s.username);
    setFormEnrollmentId(s.enrollment_id || '');
    setFormLeetcodeId(s.leetcode_id || '');
    setFormGfgId(s.gfg_id || '');
    setFormError('');
    setIsEditOpen(true);
  };

  const openDelete = (s: AdminStudent) => {
    setSelectedStudent(s);
    setIsDeleteOpen(true);
  };

  if (isLoadingContext) return <Skeletons />;

  if (!selectedBatch) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl">
        <Users className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Batch Context</h3>
        <p className="text-muted-foreground text-sm max-w-sm">Please select a Batch to view its enrolled students.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <StudentsHeader totalRecords={totalRecords} selectedBatch={selectedBatch} />
      
      <StudentsFilter
        sSearch={sSearch}
        setSSearch={setSSearch}
        setIsCreateOpen={setIsCreateOpen}
        setIsBulkUploadOpen={setIsBulkUploadOpen}
        setIsDownloadReportOpen={setIsDownloadReportOpen}
        resetForms={resetForms}
        setPage={setPage}
      />

      <StudentsTable
        students={students}
        loading={loading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalRecords={totalRecords}
        setPage={setPage}
        setLimit={setLimit}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <StudentsModals
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        isBulkUploadOpen={isBulkUploadOpen}
        setIsBulkUploadOpen={setIsBulkUploadOpen}
        isDownloadReportOpen={isDownloadReportOpen}
        setIsDownloadReportOpen={setIsDownloadReportOpen}
        selectedStudent={selectedStudent}
        formName={formName}
        setFormName={setFormName}
        formEmail={formEmail}
        setFormEmail={setFormEmail}
        formUsername={formUsername}
        setFormUsername={setFormUsername}
        formPassword={formPassword}
        setFormPassword={setFormPassword}
        formEnrollmentId={formEnrollmentId}
        setFormEnrollmentId={setFormEnrollmentId}
        formLeetcodeId={formLeetcodeId}
        setFormLeetcodeId={setFormLeetcodeId}
        formGfgId={formGfgId}
        setFormGfgId={setFormGfgId}
        formError={formError}
        setFormError={setFormError}
        submitting={submitting}
        handleCreateSubmit={handleCreateSubmit}
        handleEditSubmit={handleEditSubmit}
        handleDeleteSubmit={handleDeleteSubmit}
        handleBulkUploadSuccess={handleBulkUploadSuccess}
        selectedBatch={selectedBatch}
      />
    </div>
  );
}

function Skeletons() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded-md shrink-0"></div>
          <div className="h-5 w-48 bg-muted/60 rounded-md shrink-0 mt-2"></div>
        </div>
        <div className="h-10 w-32 bg-muted rounded-md shrink-0"></div>
      </div>
      <div className="h-150 w-full bg-card border border-border rounded-xl"></div>
    </div>
  );
}

