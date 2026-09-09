import React, { useState } from 'react';
import { Card } from '../../components/card/Card';
import { Button } from '../../components/button/Button';
import { Input, Select } from '../../components/input';
import { SchoolTenant, AcademicYear, mockClasses } from '../../data/mockSaaSData';
import { Clock, Plus } from 'lucide-react';

interface AddScheduleModalProps {
  school: SchoolTenant;
  academicYear: AcademicYear;
  onClose: () => void;
  onSubmit: (scheduleData: {
    scheduleName: string;
    targetType: 'all_classes' | 'specific_class';
    targetClassName?: string;
    dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Semua Hari Kerja';
    checkInStart: string;
    checkInDeadline: string;
    lateToleranceLimit: string;
    checkOutStart: string;
    checkOutEnd: string;
  }) => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  school,
  academicYear,
  onClose,
  onSubmit,
}) => {
  const schoolClasses = mockClasses.filter((c) => c.schoolId === school.id);

  const [scheduleName, setScheduleName] = useState<string>('Jadwal Presensi Reguler');
  const [targetType, setTargetType] = useState<'all_classes' | 'specific_class'>('all_classes');
  const [targetClassName, setTargetClassName] = useState<string>(schoolClasses[0]?.name || 'XII RPL 1');
  const [dayName, setDayName] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Semua Hari Kerja'>('Semua Hari Kerja');

  // Times
  const [checkInStart, setCheckInStart] = useState<string>('06:15');
  const [checkInDeadline, setCheckInDeadline] = useState<string>('07:00');
  const [lateToleranceLimit, setLateToleranceLimit] = useState<string>('07:15');
  const [checkOutStart, setCheckOutStart] = useState<string>('15:30');
  const [checkOutEnd, setCheckOutEnd] = useState<string>('17:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleName) return;

    onSubmit({
      scheduleName,
      targetType,
      targetClassName: targetType === 'all_classes' ? 'Semua Rombel (Global)' : targetClassName,
      dayName,
      checkInStart: `${checkInStart} WIB`,
      checkInDeadline: `${checkInDeadline} WIB`,
      lateToleranceLimit: `${lateToleranceLimit} WIB`,
      checkOutStart: `${checkOutStart} WIB`,
      checkOutEnd: `${checkOutEnd} WIB`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Buat Aturan Jam Presensi Baru
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Sekolah: <strong className="text-amber-600 dark:text-amber-400">{school.name}</strong> • TA {academicYear.year} ({academicYear.semester})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <Input
            label="Nama Aturan Jam Presensi"
            id="schedule-name"
            placeholder="misal: Reguler Masuk Pagi, Shift Siang Lab, Hari Jumat"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Penerapan Rombel
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="all_classes">Semua Rombel (Global Sekolah)</option>
                <option value="specific_class">Spesifik Rombel / Kelas</option>
              </select>
            </div>

            {targetType === 'specific_class' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Rombel / Kelas
                </label>
                <select
                  value={targetClassName}
                  onChange={(e) => setTargetClassName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  {schoolClasses.length === 0 ? (
                    <option value="XII RPL 1">XII RPL 1</option>
                  ) : (
                    schoolClasses.map((c) => (
                      <option key={c.id} value={c.name}>
                        Kelas {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hari Efektif
                </label>
                <select
                  value={dayName}
                  onChange={(e) => setDayName(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  <option value="Semua Hari Kerja">Semua Hari Kerja (Senin - Kamis)</option>
                  <option value="Senin">Senin Only</option>
                  <option value="Selasa">Selasa Only</option>
                  <option value="Rabu">Rabu Only</option>
                  <option value="Kamis">Kamis Only</option>
                  <option value="Jumat">Jumat Only</option>
                  <option value="Sabtu">Sabtu Only</option>
                </select>
              </div>
            )}
          </div>

          {/* Times Config Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
            <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs border-b border-slate-200 dark:border-slate-800 pb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Aturan Waktu Tap RFID Masuk & Pulang
            </p>

            <div className="grid grid-cols-3 gap-2">
              <Input
                label="Buka Jam Tap Masuk"
                id="check-in-start"
                type="time"
                value={checkInStart}
                onChange={(e) => setCheckInStart(e.target.value)}
                required
              />
              <Input
                label="Jam Masuk Normal"
                id="check-in-deadline"
                type="time"
                value={checkInDeadline}
                onChange={(e) => setCheckInDeadline(e.target.value)}
                required
              />
              <Input
                label="Toleransi Terlambat"
                id="late-tolerance"
                type="time"
                value={lateToleranceLimit}
                onChange={(e) => setLateToleranceLimit(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <Input
                label="Jam Mulai Tap Pulang"
                id="check-out-start"
                type="time"
                value={checkOutStart}
                onChange={(e) => setCheckOutStart(e.target.value)}
                required
              />
              <Input
                label="Jam Selesai Tap Pulang"
                id="check-out-end"
                type="time"
                value={checkOutEnd}
                onChange={(e) => setCheckOutEnd(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-amber-600 hover:bg-amber-700 border-amber-600">
              Simpan Aturan Jam Presensi
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
