import React from 'react';
import { Card } from '../../components/card/Card';
import { Button } from '../../components/button/Button';
import { Input } from '../../components/input';
import { Building2, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';

export interface SchoolHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalItems: number;
  onOpenCreateModal: () => void;
  onOpenDeletedModal: () => void;
  deletedCount?: number;
}

export const SchoolHeader: React.FC<SchoolHeaderProps> = ({
  searchTerm,
  onSearchChange,
  totalItems,
  onOpenCreateModal,
  onOpenDeletedModal,
  deletedCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Akses Khusus Super Admin Global
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> Master Data Sekolah
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen entitas sekolah terdaftar dalam platform PresenceSaaS.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenDeletedModal}
            iconLeft={<Trash2 className="w-4 h-4 text-rose-500" />}
          >
            Sekolah Terhapus
            {deletedCount !== undefined && deletedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-bold">
                {deletedCount}
              </span>
            )}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCreateModal}
            iconLeft={<Plus className="w-4 h-4" />}
          >
            Tambah Sekolah Baru
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4">
        <div className="w-full sm:w-80">
          <Input
            id="search-school"
            placeholder="Cari Nama, Email, Alamat..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          Total Sekolah: <span className="text-slate-900 dark:text-slate-100 font-bold">{totalItems}</span>
        </div>
      </Card>
    </div>
  );
};
