import React, { useState } from 'react';
import { Button } from '../../components/button/Button';
import { Input } from '../../components/input';
import { Pagination } from '../../components/pagination/Pagination';
import {
  useDeletedSchoolsQuery,
  useRestoreSchoolMutation,
  type School,
} from '../../rests/useSchools';
import { toast } from '../../hooks/useToast';
import {
  Trash2,
  RotateCcw,
  Search,
  X,
  Loader2,
  Mail,
  Phone,
  Calendar,
  Building2,
  Inbox,
} from 'lucide-react';

export interface DeletedSchoolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeletedSchoolsModal: React.FC<DeletedSchoolsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [restoringUuid, setRestoringUuid] = useState<string | null>(null);

  const {
    data: deletedSchoolsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useDeletedSchoolsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
  });

  const restoreMutation = useRestoreSchoolMutation();

  if (!isOpen) return null;

  // Process data from API response
  const schoolList: School[] = Array.isArray(deletedSchoolsData)
    ? deletedSchoolsData
    : (deletedSchoolsData as any)?.data || [];

  const meta = !Array.isArray(deletedSchoolsData)
    ? (deletedSchoolsData as any)?.meta
    : null;

  // Fallback client-side filter
  const filteredSchools = schoolList.filter((sch) => {
    const term = searchTerm.toLowerCase();
    return (
      sch.name.toLowerCase().includes(term) ||
      sch.email.toLowerCase().includes(term) ||
      (sch.address && sch.address.toLowerCase().includes(term)) ||
      sch.phone.includes(term)
    );
  });

  const totalItems =
    meta?.total ?? (searchTerm ? filteredSchools.length : schoolList.length);
  const totalPages =
    (meta?.last_page ?? Math.ceil(totalItems / itemsPerPage)) || 1;
  const displaySchools = meta
    ? schoolList
    : filteredSchools.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      );

  const handleRestore = async (school: School) => {
    try {
      setRestoringUuid(school.uuid);
      await restoreMutation.mutateAsync(school.uuid);
      toast.success(`Sekolah "${school.name}" berhasil dipulihkan`);
    } catch (err: any) {
      toast.error(err?.message || 'Gagal memulihkan sekolah');
    } finally {
      setRestoringUuid(null);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Daftar Sekolah Terhapus
                </h3>
                <span className="text-[11px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-full">
                  {totalItems} Terhapus
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Data sekolah berstatus soft-deleted yang dapat dipulihkan kembali ke sistem.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
          <div className="w-full sm:w-80">
            <Input
              id="search-deleted-school"
              placeholder="Cari sekolah yang terhapus..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <p className="text-xs">Memuat daftar sekolah terhapus...</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold mb-2">
                Gagal memuat data: {error?.message || 'Terjadi kesalahan sistem'}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Coba Lagi
              </Button>
            </div>
          ) : displaySchools.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Inbox className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Tidak Ada Sekolah Terhapus
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? 'Tidak ada sekolah terhapus yang cocok dengan kata kunci pencarian.'
                  : 'Saat ini belum ada data sekolah yang dihapus di sistem.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displaySchools.map((sch) => {
                const isRestoring = restoringUuid === sch.uuid;

                return (
                  <div
                    key={sch.uuid}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm shrink-0 overflow-hidden mt-0.5">
                        {sch.logo ? (
                          <img
                            src={sch.logo}
                            alt={sch.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                            {sch.name}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="flex items-center gap-1 text-[11px] truncate">
                            <Mail className="w-3 h-3 shrink-0" />
                            {sch.email}
                          </span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <Phone className="w-3 h-3 shrink-0" />
                            {sch.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-rose-500 dark:text-rose-400 mt-1 font-medium">
                          <Calendar className="w-3 h-3 shrink-0" />
                          Dihapus: {formatDate(sch.deleted_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <Button
                        variant="outline"
                        size="sm"
                        isLoading={isRestoring}
                        disabled={restoringUuid !== null}
                        onClick={() => handleRestore(sch)}
                        iconLeft={<RotateCcw className="w-3.5 h-3.5 text-emerald-600" />}
                        className="hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs w-full sm:w-auto"
                      >
                        Pulihkan
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Pagination & Close Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto">
            {totalItems > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeletedSchoolsModal;
