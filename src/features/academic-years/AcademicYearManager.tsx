import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../rests/queryClient';
import {
  useAcademicYearsQuery,
  useDeletedAcademicYearsQuery,
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
  useDeleteAcademicYearMutation,
  useSetActiveAcademicYearMutation,
  type AcademicYear,
} from '../../rests/useAcademicYears';
import { useSchoolsQuery, type School } from '../../rests/useSchools';
import { toast } from '../../hooks/useToast';
import { AcademicYearHeader } from './AcademicYearHeader';
import { AcademicYearTable } from './AcademicYearTable';
import { AcademicYearFormModal } from './AcademicYearFormModal';
import { DeleteAcademicYearModal } from './DeleteAcademicYearModal';
import { DeletedAcademicYearsModal } from './DeletedAcademicYearsModal';
import type { AcademicYearFormData } from './types';

const AcademicYearManagerContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | undefined>(
    undefined,
  );

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState<boolean>(false);
  const [editingAcademicYear, setEditingAcademicYear] =
    useState<AcademicYear | null>(null);
  const [deletingAcademicYear, setDeletingAcademicYear] =
    useState<AcademicYear | null>(null);
  const [activatingId, setActivatingId] = useState<number | null>(null);

  // Queries
  const {
    data: academicYearsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAcademicYearsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
    school_id: selectedSchoolId,
  });

  const { data: deletedData } = useDeletedAcademicYearsQuery({
    limit: 1,
    school_id: selectedSchoolId,
  });
  const deletedCount = !Array.isArray(deletedData)
    ? (deletedData as any)?.meta?.total
    : undefined;

  // Fetch schools for filter & form dropdowns
  const { data: schoolsData } = useSchoolsQuery({ limit: 100 });
  const schoolList: School[] = Array.isArray(schoolsData)
    ? schoolsData
    : (schoolsData as any)?.data || [];

  // Mutations
  const createMutation = useCreateAcademicYearMutation();
  const updateMutation = useUpdateAcademicYearMutation();
  const deleteMutation = useDeleteAcademicYearMutation();
  const setActiveMutation = useSetActiveAcademicYearMutation();

  const handleOpenCreateModal = () => {
    setEditingAcademicYear(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AcademicYear) => {
    setEditingAcademicYear(item);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (item: AcademicYear) => {
    setDeletingAcademicYear(item);
  };

  const handleSubmitForm = async (data: AcademicYearFormData) => {
    try {
      if (editingAcademicYear) {
        await updateMutation.mutateAsync({
          id: editingAcademicYear.id,
          ...data,
        });
        toast.success(`Tahun ajaran ${data.name} berhasil diperbarui`);
      } else {
        await createMutation.mutateAsync(data);
        toast.success(`Tahun ajaran ${data.name} berhasil ditambahkan`);
      }
      setIsModalOpen(false);
      setEditingAcademicYear(null);
    } catch (err: any) {
      toast.error(err?.message || 'Gagal menyimpan data tahun ajaran');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingAcademicYear) return;

    try {
      await deleteMutation.mutateAsync(deletingAcademicYear.id);
      toast.success(
        `Tahun ajaran ${deletingAcademicYear.name} berhasil dihapus`,
      );
      setDeletingAcademicYear(null);
    } catch (err: any) {
      toast.error(err?.message || 'Gagal menghapus tahun ajaran');
    }
  };

  const handleSetActive = async (item: AcademicYear) => {
    try {
      setActivatingId(item.id);
      await setActiveMutation.mutateAsync(item.id);
      toast.success(
        `Tahun ajaran ${item.name} berhasil diaktifkan untuk sekolah ini`,
      );
    } catch (err: any) {
      toast.error(err?.message || 'Gagal mengaktifkan tahun ajaran');
    } finally {
      setActivatingId(null);
    }
  };

  // Process response data
  const rawList: AcademicYear[] = Array.isArray(academicYearsData)
    ? academicYearsData
    : (academicYearsData as any)?.data || [];

  const meta = !Array.isArray(academicYearsData)
    ? (academicYearsData as any)?.meta
    : null;

  // Fallback client filter if backend not paginated
  const filteredList = rawList.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(term) ||
      (item.school?.name && item.school.name.toLowerCase().includes(term));
    const matchesSchool =
      selectedSchoolId === undefined || item.school_id === selectedSchoolId;
    return matchesSearch && matchesSchool;
  });

  const totalItems =
    meta?.total ?? (searchTerm ? filteredList.length : rawList.length);
  const totalPages =
    (meta?.last_page ?? Math.ceil(totalItems / itemsPerPage)) || 1;
  const displayItems = meta
    ? rawList
    : filteredList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      );

  return (
    <div className="space-y-5">
      <AcademicYearHeader
        searchTerm={searchTerm}
        onSearchChange={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        selectedSchoolId={selectedSchoolId}
        onSchoolChange={(id) => {
          setSelectedSchoolId(id);
          setCurrentPage(1);
        }}
        schools={schoolList}
        totalItems={totalItems}
        onOpenCreateModal={handleOpenCreateModal}
        onOpenDeletedModal={() => setIsDeletedModalOpen(true)}
        deletedCount={deletedCount}
      />

      <AcademicYearTable
        academicYears={displayItems}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        searchTerm={searchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        onItemsPerPageChange={(limit) => {
          setItemsPerPage(limit);
          setCurrentPage(1);
        }}
        onEditAcademicYear={handleOpenEditModal}
        onDeleteAcademicYear={handleOpenDeleteModal}
        onSetActiveAcademicYear={handleSetActive}
        isActivatingId={activatingId}
      />

      <AcademicYearFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAcademicYear(null);
        }}
        editingAcademicYear={editingAcademicYear}
        schools={schoolList}
        defaultSchoolId={selectedSchoolId}
        onSubmit={handleSubmitForm}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteAcademicYearModal
        academicYear={deletingAcademicYear}
        onClose={() => setDeletingAcademicYear(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />

      <DeletedAcademicYearsModal
        isOpen={isDeletedModalOpen}
        onClose={() => setIsDeletedModalOpen(false)}
      />
    </div>
  );
};

export const AcademicYearManager: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AcademicYearManagerContent />
    </QueryClientProvider>
  );
};

export default AcademicYearManager;
