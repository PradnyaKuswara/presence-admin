import React from 'react';
import { Card } from '../../components/card/Card';
import { Badge } from '../../components/badge/Badge';
import { Button } from '../../components/button/Button';
import { Input } from '../../components/input';
import { Building2, Search, Users, ChevronRight } from 'lucide-react';
import { User, SchoolTenant } from '../../data/mockSaaSData';

interface SchoolCardSelectionProps {
  schools: SchoolTenant[];
  users: User[];
  schoolSearchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectSchool: (school: SchoolTenant) => void;
  onSelectSuperAdmin: () => void;
  onViewAllGlobal: () => void;
}

export const SchoolCardSelection: React.FC<SchoolCardSelectionProps> = ({
  schools,
  users,
  schoolSearchTerm,
  onSearchChange,
  onSelectSchool,
  onSelectSuperAdmin,
  onViewAllGlobal
}) => {
  return (
    <div className="space-y-4">
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-linear-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:to-slate-900 border-blue-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Pilih Sekolah (Tenant)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pilih sekolah di bawah ini untuk melihat dan mengelola user/operator spesifik sekolah tersebut.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-full sm:w-64">
            <Input
              id="search-school-cards"
              placeholder="Cari Nama Sekolah / NPSN..."
              value={schoolSearchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAllGlobal}
            className="whitespace-nowrap text-xs text-indigo-600 border-indigo-200 dark:text-indigo-400 dark:border-indigo-800"
          >
            Lihat Semua User Global
          </Button>
        </div>
      </Card>

      {/* School Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Global / Super Admin Special Card */}
        <Card
          className="hover:border-purple-500 dark:hover:border-purple-500 transition-all cursor-pointer group flex flex-col justify-between border-dashed border-2 border-purple-200 dark:border-purple-900 bg-purple-50/20 dark:bg-purple-950/10"
          onClick={onSelectSuperAdmin}
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center font-bold text-white shadow-xs text-sm">
                  SA
                </div>
                <div>
                  <h3 className="font-bold text-sm text-purple-900 dark:text-purple-200 group-hover:text-purple-600 transition-colors">
                    Super Admin Platform
                  </h3>
                  <p className="text-xs text-purple-600/70 dark:text-purple-400 font-mono">Global Access • System Wide</p>
                </div>
              </div>

              <Badge variant="purple" size="sm">
                Super Admin
              </Badge>
            </div>

            <div className="my-3 p-3 rounded-md bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-950 text-xs">
              <p className="text-slate-500 text-[10px] uppercase font-semibold">Jumlah Pengguna</p>
              <p className="font-bold text-purple-700 dark:text-purple-300 text-sm flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                {users.filter(u => u.role === 'super_admin').length} User Super Admin
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-purple-100 dark:border-purple-900/60 flex items-center justify-between">
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Pengelola Pusat Platform</span>
            <button className="text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Lihat User <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {schools.map(sch => {
          const schoolUserCount = users.filter(u => u.schoolId === sch.id).length;
          const adminUser = users.find(u => u.schoolId === sch.id && u.role === 'admin');

          return (
            <Card
              key={sch.id}
              className="hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between"
              onClick={() => onSelectSchool(sch)}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs text-sm">
                      {sch.level}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {sch.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">NPSN: {sch.npsn} • {sch.city}</p>
                    </div>
                  </div>

                  <Badge variant="info" size="sm">
                    {sch.level}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">User Terdaftar</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      {schoolUserCount} User
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">Total Siswa</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {sch.totalStudents} Siswa
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono truncate max-w-42.5" title={adminUser?.name || sch.adminName}>
                  Admin: {adminUser?.name || sch.adminName}
                </span>
                <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                  Kelola User <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
