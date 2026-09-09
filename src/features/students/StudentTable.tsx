import React from 'react';
import { Card } from '../../components/card/Card';
import { Badge } from '../../components/badge/Badge';
import { Pagination } from '../../components/pagination/Pagination';
import { Student } from '../../data/mockSaaSData';
import { ATTENDANCE_STATUS } from '../../constants';

interface StudentTableProps {
  students: Student[];
  totalFilteredCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  totalFilteredCount,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4">
              <th className="py-3 px-4 font-semibold">Nama Siswa & NISN</th>
              <th className="py-3 px-4 font-semibold">Rombel / Kelas</th>
              <th className="py-3 px-4 font-semibold">Tahun Ajaran</th>
              <th className="py-3 px-4 font-semibold">ID Kartu RFID Tap</th>
              <th className="py-3 px-4 font-semibold">Telegram Ortu / Guru</th>
              <th className="py-3 px-4 font-semibold">Status Presensi Today</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                  Belum ada data siswa ditemukan untuk kriteria pencarian ini.
                </td>
              </tr>
            ) : (
              students.map((std) => (
                <tr key={std.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">{std.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">NISN: {std.nisn}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-semibold">
                      {std.className}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                    {std.academicYear}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-2 py-0.5 rounded">
                      {std.rfidCardId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{std.parentName}</p>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">{std.parentTelegramChatId}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        std.todayStatus === ATTENDANCE_STATUS.HADIR
                          ? 'success'
                          : std.todayStatus === ATTENDANCE_STATUS.TERLAMBAT
                          ? 'warning'
                          : std.todayStatus === ATTENDANCE_STATUS.SAKIT || std.todayStatus === ATTENDANCE_STATUS.IZIN
                          ? 'info'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {std.todayStatus.toUpperCase()} ({std.checkInTime})
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reusable Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalFilteredCount}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        pageSizeOptions={[5, 10, 20]}
      />
    </Card>
  );
};
