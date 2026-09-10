import React from 'react';
import { Card } from '../../components/card/Card';
import { Badge } from '../../components/badge/Badge';
import { Button } from '../../components/button/Button';
import { Pagination } from '../../components/pagination/Pagination';
import type { School } from '../../rests/useSchools';
import {
  School as SchoolIcon,
  Phone,
  Mail,
  MapPin,
  Pencil,
  Trash2,
  Loader2,
  Lock,
} from 'lucide-react';

export interface SchoolTableProps {
  schools: School[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  refetch: () => void;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEditSchool: (school: School) => void;
  onDeleteSchool: (school: School) => void;
}

export const SchoolTable: React.FC<SchoolTableProps> = ({
  schools,
  isLoading,
  isError,
  error,
  refetch,
  searchTerm,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEditSchool,
  onDeleteSchool,
}) => {
  return (
    <Card className="overflow-hidden p-0">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-sm">Memuat data sekolah dari server...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center">
          <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold mb-2">
            Gagal memuat data sekolah: {error?.message || 'Terjadi kesalahan sistem'}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : schools.length === 0 ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
          <SchoolIcon className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-semibold">Tidak Ada Data Sekolah</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {searchTerm ? 'Tidak ada sekolah yang cocok dengan pencarian.' : 'Belum ada sekolah yang terdaftar.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="py-3 px-4 font-semibold">Nama Sekolah</th>
                <th className="py-3 px-4 font-semibold">Kontak</th>
                <th className="py-3 px-4 font-semibold">Alamat</th>
                <th className="py-3 px-4 font-semibold">Statistik</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {schools.map((sch) => {
                const isGlobalSystem =
                  sch.id === 0 ||
                  sch.uuid === '00000000-0000-0000-0000-000000000000' ||
                  sch.name?.trim().toLowerCase() === 'global system';

                return (
                  <tr key={sch.uuid} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm shrink-0">
                          {sch.logo ? (
                            <img src={sch.logo} alt={sch.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            sch.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">{sch.name}</p>
                            {isGlobalSystem && (
                              <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                System
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">UUID: {sch.uuid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5 text-xs text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" /> {sch.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" /> {sch.phone}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1 line-clamp-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        {sch.address || '-'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="info" size="sm">
                          {sch.students_count ?? 0} Siswa
                        </Badge>
                        <Badge variant="purple" size="sm">
                          {sch.classes_count ?? 0} Kelas
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isGlobalSystem ? (
                        <div className="flex items-center justify-end">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-800">
                            <Lock className="w-3 h-3" /> System Protected
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditSchool(sch)}
                            iconLeft={<Pencil className="w-3.5 h-3.5" />}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDeleteSchool(sch)}
                            iconLeft={<Trash2 className="w-3.5 h-3.5" />}
                          >
                            Hapus
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {schools.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
};
