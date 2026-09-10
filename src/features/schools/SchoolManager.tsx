import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../rests/queryClient';
import {
  useSchoolsQuery,
  useDeletedSchoolsQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
  type School,
} from '../../rests/useSchools';
import { toast } from '../../hooks/useToast';
import { SchoolHeader } from './SchoolHeader';
import { SchoolTable } from './SchoolTable';
import { SchoolFormModal } from './SchoolFormModal';
import { DeleteSchoolModal } from './DeleteSchoolModal';
import { DeletedSchoolsModal } from './DeletedSchoolsModal';
import type { SchoolFormData } from './types';

const SchoolManagerContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState<boolean>(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);

  // Queries & Mutations
  const {
    data: schoolsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useSchoolsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
  });

  const { data: deletedSchoolsData } = useDeletedSchoolsQuery({ limit: 1 });
  const deletedCount = !Array.isArray(deletedSchoolsData)
    ? (deletedSchoolsData as any)?.meta?.total
    : undefined;

  const createMutation = useCreateSchoolMutation();
  const updateMutation = useUpdateSchoolMutation();
  const deleteMutation = useDeleteSchoolMutation();

  const handleOpenCreateModal = () => {
    setEditingSchool(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (school: School) => {
    if (
      school.id === 0 ||
      school.uuid === '00000000-0000-0000-0000-000000000000' ||
      school.name?.trim().toLowerCase() === 'global system'
    ) {
      toast.error('Entitas Global System tidak dapat diubah');
      return;
    }

    setEditingSchool(school);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (school: School) => {
    if (
      school.id === 0 ||
      school.uuid === '00000000-0000-0000-0000-000000000000' ||
      school.name?.trim().toLowerCase() === 'global system'
    ) {
      toast.error('Entitas Global System tidak dapat dihapus');
      return;
    }

    setDeletingSchool(school);
  };

  const handleSubmitForm = async (data: SchoolFormData) => {
    try {
      if (editingSchool) {
        await updateMutation.mutateAsync({
          uuid: editingSchool.uuid,
          ...data,
        });
        toast.success(`Sekolah ${data.name} berhasil diperbarui`);
      } else {
        await createMutation.mutateAsync(data);
        toast.success(`Sekolah ${data.name} berhasil ditambahkan`);
      }
      setIsModalOpen(false);
      setEditingSchool(null);
    } catch (err: any) {
      toast.error(err?.message || 'Gagal menyimpan data sekolah');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSchool) return;

    try {
      await deleteMutation.mutateAsync(deletingSchool.uuid);
      toast.success(`Sekolah ${deletingSchool.name} berhasil dihapus`);
      setDeletingSchool(null);
    } catch (err: any) {
      toast.error(err?.message || 'Gagal menghapus sekolah');
    }
  };

  // Process response data
  const schoolList: School[] = Array.isArray(schoolsData)
    ? schoolsData
    : (schoolsData as any)?.data || [];

  const meta = !Array.isArray(schoolsData) ? (schoolsData as any)?.meta : null;

  // Fallback client filter
  const filteredSchools = schoolList.filter((sch) => {
    const term = searchTerm.toLowerCase();
    return (
      sch.name.toLowerCase().includes(term) ||
      sch.email.toLowerCase().includes(term) ||
      (sch.address && sch.address.toLowerCase().includes(term)) ||
      sch.phone.includes(term)
    );
  });

  const totalItems = meta?.total ?? (searchTerm ? filteredSchools.length : schoolList.length);
  const totalPages = (meta?.last_page ?? Math.ceil(totalItems / itemsPerPage)) || 1;
  const displaySchools = meta
    ? schoolList
    : filteredSchools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-5">
      <SchoolHeader
        searchTerm={searchTerm}
        onSearchChange={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        totalItems={totalItems}
        onOpenCreateModal={handleOpenCreateModal}
        onOpenDeletedModal={() => setIsDeletedModalOpen(true)}
        deletedCount={deletedCount}
      />

      <SchoolTable
        schools={displaySchools}
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
        onEditSchool={handleOpenEditModal}
        onDeleteSchool={handleOpenDeleteModal}
      />

      <SchoolFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSchool(null);
        }}
        editingSchool={editingSchool}
        onSubmit={handleSubmitForm}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteSchoolModal
        school={deletingSchool}
        onClose={() => setDeletingSchool(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />

      <DeletedSchoolsModal
        isOpen={isDeletedModalOpen}
        onClose={() => setIsDeletedModalOpen(false)}
      />
    </div>
  );
};

export const SchoolManager: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SchoolManagerContent />
    </QueryClientProvider>
  );
};

export default SchoolManager;
