import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button/Button';
import { toast } from '../../hooks/useToast';
import type { School } from '../../rests/useSchools';
import type { SchoolFormData } from './types';
import { Building2, X, Upload, Image as ImageIcon } from 'lucide-react';

export interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSchool: School | null;
  onSubmit: (data: SchoolFormData) => Promise<void>;
  isLoading: boolean;
}

export const SchoolFormModal: React.FC<SchoolFormModalProps> = ({
  isOpen,
  onClose,
  editingSchool,
  onSubmit,
  isLoading,
}) => {
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SchoolFormData>();

  useEffect(() => {
    if (isOpen) {
      setLogoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (editingSchool) {
        setLogoPreview(editingSchool.logo || '');
        reset({
          name: editingSchool.name,
          address: editingSchool.address || '',
          email: editingSchool.email,
          phone: editingSchool.phone,
          logo: editingSchool.logo || '',
          logoFile: null,
        });
      } else {
        setLogoPreview('');
        reset({
          name: '',
          address: '',
          email: '',
          phone: '',
          logo: '',
          logoFile: null,
        });
      }
    }
  }, [isOpen, editingSchool, reset]);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Format file harus berupa gambar (PNG, JPG, JPEG, WEBP, SVG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file logo maksimal 2MB');
      return;
    }

    setLogoFile(file);
    setValue('logo', ''); // Kosongkan URL manual saat memilih file

    // Buat URL object untuk preview instan tanpa membebani memori dengan base64
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setValue('logo', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = (data: SchoolFormData) => {
    return onSubmit({
      ...data,
      logoFile,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            {editingSchool ? 'Edit Data Sekolah' : 'Tambah Sekolah Baru'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Kolom Kiri: Informasi Identitas & Kontak */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Nama Sekolah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SMAN 1 Semarapura"
                  {...register('name', { required: 'Nama sekolah wajib diisi' })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Email Official <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="sekretariat@sman1semarapura.sch.id"
                  {...register('email', {
                    required: 'Email wajib diisi',
                    pattern: { value: /^\S+@\S+$/i, message: 'Format email tidak valid' },
                  })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Nomor Telepon / Kontak <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="0366123456"
                  {...register('phone', { required: 'Nomor telepon wajib diisi' })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Kolom Kanan: Alamat & Upload Logo */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Alamat Lengkap <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Jl. Flamboyan No. 1, Semarapura"
                  {...register('address', { required: 'Alamat wajib diisi' })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
                {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>}
              </div>

              {/* Upload Logo Sekolah */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Logo Sekolah (Opsional)
                </label>
                <div className="flex items-center gap-3.5 p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50/60 dark:bg-slate-900/50">
                  <div className="w-16 h-16 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-xs relative">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="logo-upload-input"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-750 shadow-2xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        {logoPreview ? 'Ganti Logo' : 'Upload File Logo'}
                      </label>
                      <input
                        ref={fileInputRef}
                        id="logo-upload-input"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={handleLogoFileChange}
                      />
                      {logoPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    {logoFile ? (
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1.5 truncate max-w-60">
                        📁 {logoFile.name} ({(logoFile.size / 1024).toFixed(1)} KB)
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                        PNG, JPG, WEBP, atau SVG (Maks. 2MB)
                      </p>
                    )}
                  </div>
                </div>

                {/* Input manual URL alternatif */}
                <div className="mt-2">
                  <details className="text-xs text-slate-500 group">
                    <summary className="cursor-pointer text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 select-none">
                      Atau masukkan URL logo secara manual
                    </summary>
                    <input
                      type="text"
                      placeholder="https://example.com/logo.png"
                      {...register('logo')}
                      value={logoPreview}
                      onChange={(e) => {
                        setLogoPreview(e.target.value);
                        setValue('logo', e.target.value);
                      }}
                      className="mt-1.5 w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </details>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" type="submit" isLoading={isLoading}>
              {editingSchool ? 'Simpan Perubahan' : 'Tambah Sekolah'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
