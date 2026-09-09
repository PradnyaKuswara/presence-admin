import React, { useState } from 'react';
import { Card } from '../../components/card/Card';
import { Badge } from '../../components/badge/Badge';
import { Button } from '../../components/button/Button';
import { Input } from '../../components/input';
import { Pagination } from '../../components/pagination/Pagination';
import { mockAcademicYears, mockSchools, AcademicYear } from '../../data/mockSaaSData';
import { Calendar, Plus, Search, CheckCircle2, Archive } from 'lucide-react';

export const AcademicYearManager: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(mockAcademicYears);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form State
  const [newSchoolId, setNewSchoolId] = useState<string>(mockSchools[0]?.id || '');
  const [newYear, setNewYear] = useState<string>('2026/2027');
  const [newSemester, setNewSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [newStartDate, setNewStartDate] = useState<string>('');
  const [newEndDate, setNewEndDate] = useState<string>('');
  const [newIsActive, setNewIsActive] = useState<boolean>(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Filter Logic
  const filteredYears = academicYears.filter((ay) => {
    const matchesSchool = selectedSchoolFilter === 'all' || ay.schoolId === selectedSchoolFilter;
    const matchesSearch =
      ay.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ay.year.includes(searchTerm) ||
      ay.semester.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSchool && matchesSearch;
  });

  const totalPages = Math.ceil(filteredYears.length / itemsPerPage) || 1;
  const paginatedYears = filteredYears.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSetActive = (id: string, schoolId: string) => {
    setAcademicYears(
      academicYears.map((ay) => {
        if (ay.schoolId === schoolId) {
          return { ...ay, isActive: ay.id === id };
        }
        return ay;
      })
    );
  };

  const handleAddAcademicYear = (e: React.FormEvent) => {
    e.preventDefault();
    const sch = mockSchools.find((s) => s.id === newSchoolId);
    if (!sch || !newYear) return;

    const createdAy: AcademicYear = {
      id: `ay-${Date.now().toString().slice(-4)}`,
      schoolId: sch.id,
      schoolName: sch.name,
      year: newYear,
      semester: newSemester,
      isActive: newIsActive,
      startDate: newStartDate ? new Date(newStartDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '15 Juli 2026',
      endDate: newEndDate ? new Date(newEndDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '20 Desember 2026',
    };

    let updated = [createdAy, ...academicYears];
    if (newIsActive) {
      updated = updated.map((ay) => {
        if (ay.schoolId === sch.id && ay.id !== createdAy.id) {
          return { ...ay, isActive: false };
        }
        return ay;
      });
    }

    setAcademicYears(updated);
    alert(`Tahun Ajaran ${newYear} (${newSemester}) untuk ${sch.name} berhasil ditambahkan!`);
  };

  return (
    <div className="space-y-5">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Konfigurasi Periode KBM
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Master Tahun Ajaran Per Sekolah
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Setiap sekolah mengelola periode Tahun Ajaran & Semester efektif masing-masing untuk integrasi data presensi siswa.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="info" size="sm">
            Total {academicYears.length} Periode Registered
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form Create Academic Year */}
        <Card className="lg:col-span-1 space-y-4 shadow-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Buat Tahun Ajaran Baru
            </h3>
          </div>

          <form onSubmit={handleAddAcademicYear} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Sekolah (Tenant)
              </label>
              <select
                value={newSchoolId}
                onChange={(e) => setNewSchoolId(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                {mockSchools.map((sch) => (
                  <option key={sch.id} value={sch.id}>
                    {sch.name} ({sch.level})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Tahun Ajaran"
              id="ay-year"
              placeholder="Contoh: 2026/2027"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester Efektif
              </label>
              <select
                value={newSemester}
                onChange={(e) => setNewSemester(e.target.value as 'Ganjil' | 'Genap')}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Tanggal Mulai KBM"
                id="ay-start"
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
              />
              <Input
                label="Tanggal Selesai KBM"
                id="ay-end"
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 text-slate-700 dark:text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={newIsActive}
                onChange={(e) => setNewIsActive(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span>Jadikan Tahun Ajaran Aktif Sekolah</span>
            </label>

            <Button type="submit" variant="primary" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 shadow-xs">
              Simpan Tahun Ajaran
            </Button>
          </form>
        </Card>

        {/* Academic Years Data Table */}
        <Card className="lg:col-span-2 overflow-hidden p-0 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 gap-3 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Daftar Tahun Ajaran Per Sekolah
                </h3>
                <p className="text-[11px] text-slate-500">Menampilkan {filteredYears.length} data terdaftar</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="w-full sm:w-48">
                  <Input
                    id="search-ay"
                    placeholder="Cari Sekolah / Tahun..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    icon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                  />
                </div>

                <div className="w-40 shrink-0">
                  <select
                    value={selectedSchoolFilter}
                    onChange={(e) => {
                      setSelectedSchoolFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium cursor-pointer"
                  >
                    <option value="all">Semua Sekolah</option>
                    {mockSchools.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        {sch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/80 font-semibold">
                    <th className="py-3.5 px-4">Sekolah / Tenant</th>
                    <th className="py-3.5 px-4">Tahun Ajaran & Semester</th>
                    <th className="py-3.5 px-4">Periode Efektif KBM</th>
                    <th className="py-3.5 px-4 text-center">Status Periode</th>
                    <th className="py-3.5 px-4 text-right">Aksi Singkat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {paginatedYears.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Tidak ada data tahun ajaran yang cocok.
                      </td>
                    </tr>
                  ) : (
                    paginatedYears.map((ay) => {
                      const schoolObj = mockSchools.find((s) => s.id === ay.schoolId || s.name === ay.schoolName);

                      return (
                        <tr key={ay.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          {/* School Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                                {schoolObj?.level || 'SCH'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{ay.schoolName}</p>
                                <p className="text-[10px] text-slate-400 font-mono">NPSN: {schoolObj?.npsn || '-'}</p>
                              </div>
                            </div>
                          </td>

                          {/* Year & Semester */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                                {ay.year}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                                ay.semester === 'Ganjil'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                                  : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                              }`}>
                                Semester {ay.semester}
                              </span>
                            </div>
                          </td>

                          {/* Periode KBM */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{ay.startDate} – {ay.endDate}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            {ay.isActive ? (
                              <Badge variant="success" size="sm">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif
                                </span>
                              </Badge>
                            ) : (
                              <Badge variant="neutral" size="sm">
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Archive className="w-3 h-3" /> Arsip
                                </span>
                              </Badge>
                            )}
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-right">
                            {!ay.isActive ? (
                              <button
                                onClick={() => handleSetActive(ay.id, ay.schoolId)}
                                className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer inline-flex items-center gap-1"
                              >
                                Set Aktif
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold italic">
                                Sedang Aktif
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredYears.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(p) => setCurrentPage(p)}
              onItemsPerPageChange={(items) => {
                setItemsPerPage(items);
                setCurrentPage(1);
              }}
              pageSizeOptions={[5, 10, 20]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AcademicYearManager;
