import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button/Button';
import type { AcademicYear } from '../../types/academicYear';
import type { School } from '../../rests/useSchools';
import type { AcademicYearFormData } from './types';
import { Calendar, X, Building2 } from 'lucide-react';

export interface AcademicYearFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAcademicYear: AcademicYear | null;
  schools: School[];
  defaultSchoolId?: number;
  onSubmit: (data: AcademicYearFormData) => Promise<void>;
  isLoading: boolean;
}

export const AcademicYearFormModal: React.FC<AcademicYearFormModalProps> = ({
  isOpen,
  onClose,
  editingAcademicYear,
  schools,
  defaultSchoolId,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AcademicYearFormData>();

  useEffect(() => {
    if (isOpen) {
      if (editingAcademicYear) {
        // Format ISO date strings to YYYY-MM-DD for date input
        const sDate = editingAcademicYear.start_date
          ? editingAcademicYear.start_date.split('T')[0]
          : '';
        const eDate = editingAcademicYear.end_date
          ? editingAcademicYear.end_date.split('T')[0]
          : '';

        reset({
          school_id: editingAcademicYear.school_id,
          name: editingAcademicYear.name,
          start_date: sDate,
          end_date: eDate,
          is_active: editingAcademicYear.is_active,
        });
      } else {
        const initialSchoolId =
          defaultSchoolId || (schools.length > 0 ? schools[0].id : 0);

        reset({
          school_id: initialSchoolId,
          name: '2026/2027',
          start_date: '',
          end_date: '',
          is_active: true,
        });
      }
    }
  }, [isOpen, editingAcademicYear, schools, defaultSchoolId, reset]);

  const handleFormSubmit = (data: AcademicYearFormData) => {
    return onSubmit({
      ...data,
      school_id: Number(data.school_id),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {editingAcademicYear ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran Baru'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* Pilih Sekolah */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Sekolah / Tenant <span className="text-rose-500">*</span>
            </label>
            <select
              {...register('school_id', { required: 'Sekolah wajib dipilih' })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {schools.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.name}
                </option>
              ))}
            </select>
            {errors.school_id && (
              <p className="text-xs text-rose-500 mt-1">{errors.school_id.message}</p>
            )}
          </div>

          {/* Nama Tahun Ajaran */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Nama Tahun Ajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              maxLength={9}
              placeholder="Contoh: 2026/2027"
              {...register('name', {
                required: 'Nama tahun ajaran wajib diisi',
                maxLength: {
                  value: 9,
                  message: 'Maksimal 9 karakter (contoh: 2026/2027)',
                },
              })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Format umum: <strong>YYYY/YYYY</strong> (maks. 9 karakter)
            </p>
            {errors.name && (
              <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Rentang Tanggal KBM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Tanggal Mulai KBM <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                {...register('start_date', {
                  required: 'Tanggal mulai wajib diisi',
                })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.start_date && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Tanggal Selesai KBM <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                {...register('end_date', {
                  required: 'Tanggal selesai wajib diisi',
                })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.end_date && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          {/* Jadikan Aktif */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                {...register('is_active')}
                className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="text-xs font-medium">
                Jadikan Tahun Ajaran Aktif untuk Sekolah ini
              </span>
            </label>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 ml-6.5 mt-0.5">
              Jika dicentang, tahun ajaran aktif lain pada sekolah yang sama akan otomatis dinonaktifkan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button variant="primary" type="submit" isLoading={isLoading}>
              {editingAcademicYear ? 'Simpan Perubahan' : 'Tambah Tahun Ajaran'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcademicYearFormModal;
