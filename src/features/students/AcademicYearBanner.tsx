import React from 'react';
import { Calendar, AlertCircle, Plus } from 'lucide-react';
import { mockAcademicYears, SchoolTenant } from '../../data/mockSaaSData';

interface AcademicYearBannerProps {
  activeAcademicYear: string;
  onAcademicYearChange: (val: string) => void;
  selectedSchool?: SchoolTenant | null;
}

export const AcademicYearBanner: React.FC<AcademicYearBannerProps> = ({
  activeAcademicYear,
  onAcademicYearChange,
  selectedSchool,
}) => {
  // Filter academic years specific to selected school if present, otherwise all
  const availableAcademicYears = selectedSchool
    ? mockAcademicYears.filter((ay) => ay.schoolId === selectedSchool.id)
    : mockAcademicYears;

  const hasConfiguredAcademicYear = availableAcademicYears.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50 dark:bg-blue-950/40 p-4 rounded-lg border border-blue-200 dark:border-blue-800/60">
        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Tahun Ajaran Aktif Platform:</span>
          <span className="font-bold text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
            {activeAcademicYear}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Ganti Tahun Ajaran:</span>
          <select
            value={activeAcademicYear}
            onChange={(e) => onAcademicYearChange(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium cursor-pointer"
          >
            {mockAcademicYears.map((ay) => (
              <option key={ay.id} value={`${ay.year} ${ay.semester}`}>
                {ay.schoolName ? `[${ay.schoolName}] ` : ''}{ay.year} - Semester {ay.semester} {ay.isActive ? '(Aktif)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Warning Notice if Selected School has no Academic Year configured */}
      {selectedSchool && !hasConfiguredAcademicYear && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Master Tahun Ajaran Belum Ada Dikonfigurasi
              </p>
              <p className="text-amber-700 dark:text-amber-400 mt-0.5">
                Sekolah <strong className="underline">{selectedSchool.name}</strong> belum memiliki Master Tahun Pelajaran. Harap input master tahun ajaran terlebih dahulu sebelum mendaftarkan siswa.
              </p>
            </div>
          </div>

          <a
            href="/academic-years"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md shadow-xs transition-colors shrink-0 text-xs"
          >
            <Plus className="w-4 h-4" />
            Input Master Tahun Ajaran
          </a>
        </div>
      )}
    </div>
  );
};
