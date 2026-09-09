import React from 'react';
import { Card } from '../../components/card/Card';
import { Badge } from '../../components/badge/Badge';
import { Input } from '../../components/input';
import { School, Search, Users, ChevronRight } from 'lucide-react';
import { SchoolTenant } from '../../data/mockSaaSData';

interface StudentSchoolGridProps {
  schools: SchoolTenant[];
  schoolSearchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectSchool: (school: SchoolTenant) => void;
}

export const StudentSchoolGrid: React.FC<StudentSchoolGridProps> = ({
  schools,
  schoolSearchTerm,
  onSearchChange,
  onSelectSchool,
}) => {
  return (
    <div className="space-y-4">
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Langkah 1: Pilih Sekolah untuk Mengelola Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pilih kartu sekolah di bawah ini untuk membuka database siswa spesifik sekolah tersebut.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            id="search-school-cards"
            placeholder="Cari Nama Sekolah / NPSN..."
            value={schoolSearchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </Card>

      {/* School Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {schools.map((sch) => (
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
                    <p className="text-xs text-slate-500 font-mono">
                      NPSN: {sch.npsn} • {sch.city}
                    </p>
                  </div>
                </div>

                <Badge variant="info" size="sm">
                  {sch.level}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">Total Siswa</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    {sch.totalStudents} Siswa
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">Jumlah Rombel</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {sch.totalClasses} Kelas
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Admin: {sch.adminName}</span>
              <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Kelola Siswa Sekolah Ini <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
