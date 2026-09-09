import React from 'react';
import { Card } from '../../components/card/Card';
import { Badge } from '../../components/badge/Badge';
import { Pagination } from '../../components/pagination/Pagination';
import { ClassRombel } from '../../data/mockSaaSData';
import { Users, Phone, DoorOpen, CheckCircle2, XCircle } from 'lucide-react';
import { ACCOUNT_STATUS } from '../../constants';

interface ClassTableProps {
  classes: ClassRombel[];
  totalFilteredCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  onToggleStatus: (id: string) => void;
}

export const ClassTable: React.FC<ClassTableProps> = ({
  classes,
  totalFilteredCount,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onToggleStatus,
}) => {
  return (
    <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4">Nama Kelas & Jurusan</th>
              <th className="py-3.5 px-4">Wali Kelas</th>
              <th className="py-3.5 px-4">Ruangan Kelas</th>
              <th className="py-3.5 px-4">Jumlah Siswa & Kuota</th>
              <th className="py-3.5 px-4">Status Rombel</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {classes.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Belum ada data kelas / rombel untuk kriteria pencarian ini.
                </td>
              </tr>
            ) : (
              classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Nama Kelas & Jurusan */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {cls.name.substring(0, 3)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{cls.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Tingkat {cls.level} • {cls.major || 'Umum'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Wali Kelas */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{cls.homeroomTeacher}</p>
                    <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {cls.homeroomPhone || '-'}
                    </p>
                  </td>

                  {/* Ruangan */}
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <DoorOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>{cls.roomName}</span>
                    </div>
                  </td>

                  {/* Siswa & Kuota */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 text-xs">
                      <Users className="w-3.5 h-3.5" />
                      <span>{cls.totalStudents} / {cls.capacity} Siswa</span>
                    </div>
                    <div className="w-24 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.round((cls.totalStudents / cls.capacity) * 100))}%` }}
                      />
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onToggleStatus(cls.id)}
                      className="cursor-pointer inline-block"
                      title="Klik untuk mengubah status rombel"
                    >
                      {cls.status === ACCOUNT_STATUS.ACTIVE ? (
                        <Badge variant="success" size="sm">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif
                          </span>
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          <span className="flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Non-Aktif
                          </span>
                        </Badge>
                      )}
                    </button>
                  </td>

                  {/* Aksi */}
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

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalFilteredCount}
          onItemsPerPageChange={onItemsPerPageChange}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>
    </Card>
  );
};
