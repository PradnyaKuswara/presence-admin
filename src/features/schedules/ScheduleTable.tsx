import React from 'react';
import { Card } from '../../components/card/Card';
import { Badge } from '../../components/badge/Badge';
import { AttendanceSchedule } from '../../data/mockSaaSData';
import { Clock, CheckCircle2, XCircle, AlertCircle, Calendar, Layers } from 'lucide-react';
import { ACCOUNT_STATUS } from '../../constants';

interface ScheduleTableProps {
  schedules: AttendanceSchedule[];
  onToggleStatus: (id: string) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, onToggleStatus }) => {
  return (
    <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4">Nama Aturan Jadwal</th>
              <th className="py-3.5 px-4">Target Rombel / Kelas</th>
              <th className="py-3.5 px-4">Hari Efektif</th>
              <th className="py-3.5 px-4">Batas Jam Tap Masuk</th>
              <th className="py-3.5 px-4">Toleransi Terlambat</th>
              <th className="py-3.5 px-4">Batas Jam Pulang</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Belum ada aturan jam presensi yang sesuai dengan kriteria filter.
                </td>
              </tr>
            ) : (
              schedules.map((schd) => (
                <tr key={schd.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Nama Aturan */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{schd.scheduleName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {schd.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Target Rombel */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      schd.targetType === 'all_classes'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                        : 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                    }`}>
                      <Layers className="w-3 h-3" />
                      {schd.targetClassName || 'Semua Rombel'}
                    </span>
                  </td>

                  {/* Hari Efektif */}
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{schd.dayName}</span>
                    </div>
                  </td>

                  {/* Jam Masuk Normal */}
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    {schd.checkInDeadline}
                    <span className="block text-[10px] text-slate-400 font-normal">Buka: {schd.checkInStart}</span>
                  </td>

                  {/* Toleransi Terlambat */}
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                    {schd.lateToleranceLimit}
                    <span className="block text-[10px] text-slate-400 font-normal">Auto Notif Bot</span>
                  </td>

                  {/* Jam Pulang */}
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                    {schd.checkOutStart}
                    <span className="block text-[10px] text-slate-400 font-normal">Tutup: {schd.checkOutEnd}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onToggleStatus(schd.id)}
                      className="cursor-pointer inline-block"
                      title="Klik untuk ubah status aturan jadwal"
                    >
                      {schd.status === ACCOUNT_STATUS.ACTIVE ? (
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
                    <button className="px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
