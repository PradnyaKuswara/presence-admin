import React, { useState } from 'react';
import { Card } from './Card';
import { mockSchools, SchoolTenant } from '../../data/mockSaaSData';
import { School, Radio } from 'lucide-react';

export const SchoolOverviewCard: React.FC = () => {
  const [schools] = useState<SchoolTenant[]>(mockSchools);

  return (
    <Card className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Sekolah Terdaftar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ringkasan status sekolah & mesin RFID Tap</p>
          </div>
          <a
            href="/schools"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
          >
            Lihat Semua &rarr;
          </a>
        </div>

        <div className="space-y-2.5">
          {schools.map(sch => (
            <div
              key={sch.id}
              className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{sch.name}</p>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-medium">
                    {sch.level}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  NPSN: <span className="font-mono text-slate-700 dark:text-slate-300">{sch.npsn}</span> • {sch.city} ({sch.totalStudents} Siswa)
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                  sch.rfidDeviceStatus === 'online' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  <Radio className="w-3 h-3" />
                  {sch.rfidDeviceStatus === 'online' ? 'Tap RFID Active' : 'Offline'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SchoolOverviewCard;
