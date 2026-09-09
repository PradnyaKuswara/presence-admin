import React from 'react';
import { Card } from '../../components/card/Card';
import { Badge } from '../../components/badge/Badge';
import { Calendar, ArrowLeft, Plus, ChevronRight, AlertTriangle, Clock } from 'lucide-react';
import { AcademicYear, mockAcademicYears, mockSchedules, SchoolTenant } from '../../data/mockSaaSData';

interface ScheduleAcademicYearGridProps {
  school: SchoolTenant;
  onBackToSchools: () => void;
  onSelectAcademicYear: (ay: AcademicYear) => void;
}

export const ScheduleAcademicYearGrid: React.FC<ScheduleAcademicYearGridProps> = ({
  school,
  onBackToSchools,
  onSelectAcademicYear,
}) => {
  const schoolAcademicYears = mockAcademicYears.filter((ay) => ay.schoolId === school.id);
  const hasAcademicYears = schoolAcademicYears.length > 0;

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        <button
          onClick={onBackToSchools}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Pilih Sekolah
        </button>

        <span className="text-xs text-slate-500">
          Sekolah Terpilih: <strong className="text-slate-900 dark:text-slate-100">{school.name}</strong> ({school.npsn})
        </span>
      </div>

      {/* Step Title Header */}
      <Card className="p-4 bg-linear-to-r from-amber-50/50 via-orange-50/30 to-slate-50 dark:from-slate-900 dark:to-slate-900 border-amber-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Langkah 2: Pilih Periode Tahun Ajaran Jadwal Presensi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jadwal jam masuk & batas terlambat dikonfigurasi per periode Tahun Ajaran & Semester.
          </p>
        </div>

        <a
          href="/academic-years"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Master Tahun Ajaran
        </a>
      </Card>

      {/* Grid of Academic Years */}
      {!hasAcademicYears ? (
        <Card className="p-8 text-center space-y-4 border-dashed border-2 border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Belum Ada Master Tahun Ajaran
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Sekolah <strong className="text-slate-900 dark:text-slate-100">{school.name}</strong> belum memiliki data Master Tahun Pelajaran. Harap buat data master terlebih dahulu.
            </p>
          </div>

          <div>
            <a
              href="/academic-years"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" /> Input Master Tahun Ajaran Sekarang
            </a>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schoolAcademicYears.map((ay) => {
            const rulesInAy = mockSchedules.filter(
              (s) => s.schoolId === school.id && s.academicYear.includes(ay.year)
            ).length;

            return (
              <Card
                key={ay.id}
                className="hover:border-amber-500 dark:hover:border-amber-500 transition-all cursor-pointer group flex flex-col justify-between"
                onClick={() => onSelectAcademicYear(ay)}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                        Tahun Ajaran {ay.year}
                      </span>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Semester {ay.semester}</p>
                    </div>

                    <Badge variant={ay.isActive ? 'success' : 'neutral'} size="sm">
                      {ay.isActive ? 'AKTIF' : 'ARSIP'}
                    </Badge>
                  </div>

                  <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 my-3">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Aturan Jam Terpasang:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {rulesInAy > 0 ? `${rulesInAy} Aturan Jam` : 'Definisikan Baru'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                      <span>Periode KBM:</span>
                      <span className="font-mono text-[11px] font-medium text-slate-900 dark:text-slate-100">
                        {ay.startDate} - {ay.endDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">
                    Status: {ay.isActive ? 'Berjalan' : 'Selesai'}
                  </span>
                  <button className="text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Buka Matriks Jadwal <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
