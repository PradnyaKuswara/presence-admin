import React from 'react';
import { Card } from '../../components/card/Card';
import { Search } from 'lucide-react';

interface StudentFilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedClass: string;
  onClassChange: (val: string) => void;
  classesList: string[];
}

export const StudentFilterBar: React.FC<StudentFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedClass,
  onClassChange,
  classesList,
}) => {
  return (
    <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari Nama Siswa, NISN, RFID Card..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <span className="text-xs text-slate-500 font-medium">Filter Kelas:</span>
        <select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">Semua Rombel/Kelas</option>
          {classesList.map((cls) => (
            <option key={cls} value={cls}>
              Kelas {cls}
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
};
