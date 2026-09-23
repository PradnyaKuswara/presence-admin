import React from 'react';
import { Card } from '../../components/card/Card';
import { Button } from '../../components/button/Button';
import { Input } from '../../components/input';
import { Calendar, Plus, Search, ShieldCheck, Trash2, Building2 } from 'lucide-react';
import type { School } from '../../rests/useSchools';

export interface AcademicYearHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSchoolId: number | undefined;
  onSchoolChange: (schoolId: number | undefined) => void;
  schools: School[];
  totalItems: number;
  onOpenCreateModal: () => void;
  onOpenDeletedModal: () => void;
  deletedCount?: number;
}

export const AcademicYearHeader: React.FC<AcademicYearHeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedSchoolId,
  onSchoolChange,
  schools,
  totalItems,
  onOpenCreateModal,
  onOpenDeletedModal,
  deletedCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Konfigurasi Periode KBM
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Master Data Tahun Ajaran
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola periode Tahun Ajaran dan rentang waktu efektif KBM untuk presensi siswa per sekolah.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenDeletedModal}
            iconLeft={<Trash2 className="w-4 h-4 text-rose-500" />}
          >
            Tahun Ajaran Terhapus
            {deletedCount !== undefined && deletedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-bold">
                {deletedCount}
              </span>
            )}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCreateModal}
            iconLeft={<Plus className="w-4 h-4" />}
          >
            Tambah Tahun Ajaran
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="w-full sm:w-72">
            <Input
              id="search-academic-year"
              placeholder="Cari Tahun Ajaran atau Nama Sekolah..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="w-full sm:w-64">
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedSchoolId || ''}
                onChange={(e) =>
                  onSchoolChange(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium cursor-pointer"
              >
                <option value="">Semua Sekolah</option>
                {schools.map((sch) => (
                  <option key={sch.id} value={sch.id}>
                    {sch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0">
          Total Data: <span className="text-slate-900 dark:text-slate-100 font-bold">{totalItems}</span>
        </div>
      </Card>
    </div>
  );
};

export default AcademicYearHeader;
