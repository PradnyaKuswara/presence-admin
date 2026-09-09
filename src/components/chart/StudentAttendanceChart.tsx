import React, { useState } from 'react';
import { Card } from '../card/Card';
import { GraduationCap } from 'lucide-react';

interface SchoolLevelStat {
  level: string;
  totalStudents: number;
  onTime: number;
  late: number;
  absent: number;
}

const levelStats: SchoolLevelStat[] = [
  { level: 'SD (Sekolah Dasar)', totalStudents: 3200, onTime: 2950, late: 180, absent: 70 },
  { level: 'SMP (Sekolah Menengah Pertama)', totalStudents: 5400, onTime: 4980, late: 290, absent: 130 },
  { level: 'SMA / SMK (Sekolah Menengah Kejuruan)', totalStudents: 9850, onTime: 9100, late: 520, absent: 230 },
];

export const StudentAttendanceChart: React.FC = () => {
  const [activeView, setActiveView] = useState<'today' | 'weekly'>('today');

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Statistik Kehadiran Siswa per Jenjang
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monitoring kehadiran siswa SD, SMP, & SMA/SMK nasional</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-md border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveView('today')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeView === 'today'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setActiveView('weekly')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeView === 'weekly'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Minggu Ini
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mb-4 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-600"></span>
            <span>Hadir Tepat Waktu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
            <span>Terlambat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-600"></span>
            <span>Izin / Sakit / Alpa</span>
          </div>
        </div>

        {/* Bars per School Level */}
        <div className="space-y-4">
          {levelStats.map((item, idx) => {
            const onTimePct = (item.onTime / item.totalStudents) * 100;
            const latePct = (item.late / item.totalStudents) * 100;
            const absentPct = (item.absent / item.totalStudents) * 100;

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.level}</span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">{item.onTime.toLocaleString()} Hadir ({onTimePct.toFixed(1)}%)</span>
                    <span>•</span>
                    <span className="text-amber-700 dark:text-amber-400">{item.late} Lambat</span>
                  </div>
                </div>
                <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-950 rounded-sm overflow-hidden flex border border-slate-200 dark:border-slate-800">
                  <div
                    style={{ width: `${onTimePct}%` }}
                    className="h-full bg-emerald-600 transition-all duration-300"
                    title={`Hadir: ${item.onTime}`}
                  />
                  <div
                    style={{ width: `${latePct}%` }}
                    className="h-full bg-amber-500 transition-all duration-300"
                    title={`Terlambat: ${item.late}`}
                  />
                  <div
                    style={{ width: `${absentPct}%` }}
                    className="h-full bg-rose-600 transition-all duration-300"
                    title={`Tidak Hadir: ${item.absent}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default StudentAttendanceChart;
