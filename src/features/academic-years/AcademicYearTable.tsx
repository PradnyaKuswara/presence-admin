import React from 'react';
import { Card } from '../../components/card/Card';
import { Badge } from '../../components/badge/Badge';
import { Button } from '../../components/button/Button';
import { Pagination } from '../../components/pagination/Pagination';
import type { AcademicYear } from '../../types/academicYear';
import {
  Calendar,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  Archive,
  Building2,
  Check,
} from 'lucide-react';

export interface AcademicYearTableProps {
  academicYears: AcademicYear[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  refetch: () => void;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  onEditAcademicYear: (item: AcademicYear) => void;
  onDeleteAcademicYear: (item: AcademicYear) => void;
  onSetActiveAcademicYear: (item: AcademicYear) => void;
  isActivatingId?: number | null;
}

export const AcademicYearTable: React.FC<AcademicYearTableProps> = ({
  academicYears,
  isLoading,
  isError,
  error,
  refetch,
  searchTerm,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onEditAcademicYear,
  onDeleteAcademicYear,
  onSetActiveAcademicYear,
  isActivatingId,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="overflow-hidden p-0">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-sm">Memuat data tahun ajaran dari server...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center">
          <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold mb-2">
            Gagal memuat data tahun ajaran: {error?.message || 'Terjadi kesalahan sistem'}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : academicYears.length === 0 ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
          <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-semibold">Tidak Ada Data Tahun Ajaran</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {searchTerm
              ? 'Tidak ada tahun ajaran yang cocok dengan pencarian.'
              : 'Belum ada data tahun ajaran yang dibuat.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="py-3 px-4 font-semibold">Sekolah / Tenant</th>
                <th className="py-3 px-4 font-semibold">Tahun Ajaran</th>
                <th className="py-3 px-4 font-semibold">Periode Efektif KBM</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {academicYears.map((ay) => {
                const schoolName = ay.school?.name || `Sekolah ID: ${ay.school_id}`;
                const isActivating = isActivatingId === ay.id;

                return (
                  <tr
                    key={ay.id}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* School Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0 overflow-hidden">
                          {ay.school?.logo ? (
                            <img
                              src={ay.school.logo}
                              alt={schoolName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                            {schoolName}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            ID: {ay.school_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Year Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 font-mono">
                          {ay.name}
                        </span>
                        {ay.is_active && (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 px-1.5 py-0.5 rounded">
                            Berjalan
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Effective Dates */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {formatDate(ay.start_date)} – {formatDate(ay.end_date)}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {ay.is_active ? (
                        <Badge variant="success" size="sm">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif
                          </span>
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Archive className="w-3 h-3" /> Arsip
                          </span>
                        </Badge>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!ay.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            isLoading={isActivating}
                            onClick={() => onSetActiveAcademicYear(ay)}
                            iconLeft={<Check className="w-3.5 h-3.5 text-emerald-600" />}
                            className="hover:text-emerald-600 hover:border-emerald-300 dark:hover:border-emerald-800"
                          >
                            Set Aktif
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditAcademicYear(ay)}
                          iconLeft={<Pencil className="w-3.5 h-3.5" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDeleteAcademicYear(ay)}
                          iconLeft={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {academicYears.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      )}
    </Card>
  );
};

export default AcademicYearTable;
