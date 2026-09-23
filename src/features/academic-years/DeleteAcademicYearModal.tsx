import React from 'react';
import { Button } from '../../components/button/Button';
import type { AcademicYear } from '../../types/academicYear';
import { Trash2 } from 'lucide-react';

export interface DeleteAcademicYearModalProps {
  academicYear: AcademicYear | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const DeleteAcademicYearModal: React.FC<DeleteAcademicYearModalProps> = ({
  academicYear,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!academicYear) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-rose-600" /> Hapus Tahun Ajaran
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Apakah Anda yakin ingin menghapus Tahun Ajaran{' '}
          <strong className="text-slate-900 dark:text-slate-100 font-mono">
            {academicYear.name}
          </strong>{' '}
          untuk sekolah{' '}
          <strong className="text-slate-900 dark:text-slate-100">
            {academicYear.school?.name || `ID ${academicYear.school_id}`}
          </strong>
          ? Data akan dipindahkan ke daftar terhapus (soft-delete) dan dapat dipulihkan kembali.
        </p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            Ya, Hapus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAcademicYearModal;
