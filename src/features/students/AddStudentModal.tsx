import React, { useState } from 'react';
import { Button } from '../../components/button/Button';
import { Input, Select } from '../../components/input';
import { mockAcademicYears, SchoolTenant } from '../../data/mockSaaSData';
import { AlertTriangle, Plus, ExternalLink } from 'lucide-react';

interface AddStudentModalProps {
  school: SchoolTenant;
  activeAcademicYear: string;
  onClose: () => void;
  onSubmit: (studentData: {
    name: string;
    nisn: string;
    className: string;
    rfidCardId: string;
    parentName: string;
    parentTelegramChatId: string;
    academicYear: string;
  }) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  school,
  activeAcademicYear,
  onClose,
  onSubmit,
}) => {
  // Check if school has academic years registered
  const schoolAcademicYears = mockAcademicYears.filter((ay) => ay.schoolId === school.id);
  const hasAcademicYear = schoolAcademicYears.length > 0;

  const [newStudent, setNewStudent] = useState({
    name: '',
    nisn: '',
    className: 'XII RPL 1',
    rfidCardId: '',
    parentName: '',
    parentTelegramChatId: '',
    academicYear: activeAcademicYear,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAcademicYear) return;
    onSubmit(newStudent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 w-full max-w-md shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Tambah Siswa Baru
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Sekolah: <strong className="text-blue-600 dark:text-blue-400">{school.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* NOTICE IF NO ACADEMIC YEAR FOUND */}
        {!hasAcademicYear ? (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-lg space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                Master Tahun Ajaran Belum Ada
              </div>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                Sekolah <strong>{school.name}</strong> belum memiliki data Master Tahun Pelajaran. Sesuai prosedur, Anda <strong>harus menginput data Master Tahun Ajaran terlebih dahulu</strong> sebelum mendaftarkan siswa baru.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Tutup
              </Button>
              <a
                href="/academic-years"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Input Master Tahun Ajaran
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        ) : (
          /* REGULAR FORM */
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tahun Ajaran & Semester Siswa
              </label>
              <select
                value={newStudent.academicYear}
                onChange={(e) => setNewStudent({ ...newStudent, academicYear: e.target.value })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                {schoolAcademicYears.map((ay) => (
                  <option key={ay.id} value={`${ay.year} ${ay.semester}`}>
                    {ay.year} - Semester {ay.semester} {ay.isActive ? '(Aktif)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Nama Lengkap Siswa"
              id="add-name"
              placeholder="Masukkan nama siswa..."
              required
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            />

            <Input
              label="NISN"
              id="add-nisn"
              placeholder="10 Digit NISN..."
              required
              value={newStudent.nisn}
              onChange={(e) => setNewStudent({ ...newStudent, nisn: e.target.value })}
            />

            <Select
              label="Rombel / Kelas"
              id="add-class"
              value={newStudent.className}
              onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
              options={[
                { value: 'XII RPL 1', label: 'XII RPL 1' },
                { value: 'XII TKJ 2', label: 'XII TKJ 2' },
                { value: 'IX A', label: 'IX A' },
                { value: 'V B', label: 'V B' },
              ]}
            />

            <Input
              label="ID Kartu RFID Tap (Opsional)"
              id="add-rfid"
              placeholder="RFID-XXXXXX"
              value={newStudent.rfidCardId}
              onChange={(e) => setNewStudent({ ...newStudent, rfidCardId: e.target.value })}
            />

            <Input
              label="Nama Orang Tua / Wali"
              id="add-parent"
              placeholder="Nama orang tua..."
              value={newStudent.parentName}
              onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
            />

            <Input
              label="Telegram Chat ID Ortu / Username"
              id="add-telegram"
              placeholder="@username_ortu"
              value={newStudent.parentTelegramChatId}
              onChange={(e) => setNewStudent({ ...newStudent, parentTelegramChatId: e.target.value })}
            />

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Simpan Siswa
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
