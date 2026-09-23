import React, { useState } from 'react';
import { Button } from '../../components/button/Button';
import { Input } from '../../components/input';
import { Pagination } from '../../components/pagination/Pagination';
import {
  useDeletedAcademicYearsQuery,
  useRestoreAcademicYearMutation,
  type AcademicYear,
} from '../../rests/useAcademicYears';
import { toast } from '../../hooks/useToast';
import {
  Trash2,
  RotateCcw,
  Search,
  X,
  Loader2,
  Calendar,
  Building2,
  Inbox,
} from 'lucide-react';

export interface DeletedAcademicYearsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeletedAcademicYearsModal: React.FC<DeletedAcademicYearsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [restoringId, setRestoringId] = useState<number | null>(null);

  const {
    data: deletedData,
    isLoading,
    isError,
    error,
    refetch,
  } = useDeletedAcademicYearsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
  });

  const restoreMutation = useRestoreAcademicYearMutation();

  if (!isOpen) return null;

  const academicYearList: AcademicYear[] = Array.isArray(deletedData)
    ? deletedData
    : (deletedData as any)?.data || [];

  const meta = !Array.isArray(deletedData)
    ? (deletedData as any)?.meta
    : null;

  const filteredList = academicYearList.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      (item.school?.name && item.school.name.toLowerCase().includes(term))
    );
  });

  const totalItems =
    meta?.total ?? (searchTerm ? filteredList.length : academicYearList.length);
  const totalPages =
    (meta?.last_page ?? Math.ceil(totalItems / itemsPerPage)) || 1;
  const displayList = meta
    ? academicYearList
    : filteredList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      );

  const handleRestore = async (item: AcademicYear) => {
    try {
      setRestoringId(item.id);
      await restoreMutation.mutateAsync(item.id);
      toast.success(`Tahun ajaran "${item.name}" berhasil dipulihkan`);
    } catch (err: any) {
      toast.error(err?.message || 'Gagal memulihkan tahun ajaran');
    } finally {
      setRestoringId(null);
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
                  Daftar Tahun Ajaran Terhapus
                </h3>
                <span className="text-[11px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-full">
                  {totalItems} Terhapus
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Data tahun ajaran soft-deleted yang dapat dipulihkan kembali ke sistem.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
          <div className="w-full sm:w-80">
            <Input
              id="search-deleted-ay"
              placeholder="Cari tahun ajaran terhapus..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Content List */}
        <div className="overflow-y-auto p-4 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <p className="text-xs">Memuat daftar tahun ajaran terhapus...</p>
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
          ) : displayList.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Inbox className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Tidak Ada Tahun Ajaran Terhapus
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? 'Tidak ada tahun ajaran terhapus yang cocok dengan kata kunci.'
                  : 'Saat ini belum ada data tahun ajaran yang berstatus terhapus.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayList.map((ay) => {
                const isRestoring = restoringId === ay.id;
                const schoolName = ay.school?.name || `Sekolah ID: ${ay.school_id}`;

                return (
                  <div
                    key={ay.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm shrink-0 overflow-hidden mt-0.5">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 font-mono">
                            {ay.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                            ({schoolName})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {ay.start_date?.split('T')[0]} s/d {ay.end_date?.split('T')[0]}
                          </span>
                        </div>
                        <div className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 font-medium">
                          Dihapus: {formatDate(ay.deleted_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <Button
                        variant="outline"
                        size="sm"
                        isLoading={isRestoring}
                        disabled={restoringId !== null}
                        onClick={() => handleRestore(ay)}
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

        {/* Footer */}
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

export default DeletedAcademicYearsModal;
