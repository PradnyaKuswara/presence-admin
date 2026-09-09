import React, { useState, useEffect } from 'react';
import { Card } from '../../components/card/Card';
import { Input } from '../../components/input';
import { mockSchools, mockClasses, SchoolTenant, ClassRombel } from '../../data/mockSaaSData';
import { ArrowLeft, Plus, Search } from 'lucide-react';

import { ClassSchoolGrid } from './ClassSchoolGrid';
import { ClassTable } from './ClassTable';
import { AddClassModal } from './AddClassModal';

export const ClassManager: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<SchoolTenant | null>(null);
  const [classesList, setClassesList] = useState<ClassRombel[]>(mockClasses);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [schoolSearchTerm, setSchoolSearchTerm] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Synchronize URL parameters on mount or popstate
  useEffect(() => {
    const parseUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const schoolId = params.get('schoolId');

      if (schoolId) {
        const sch = mockSchools.find((s) => s.id === schoolId);
        if (sch) {
          setSelectedSchool(sch);
        } else {
          setSelectedSchool(null);
        }
      } else {
        setSelectedSchool(null);
      }
    };

    parseUrlParams();

    const handlePopState = () => parseUrlParams();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateUrl = (schId?: string | null) => {
    const url = new URL(window.location.href);
    if (schId) {
      url.searchParams.set('schoolId', schId);
    } else {
      url.searchParams.delete('schoolId');
    }
    window.history.pushState({}, '', url.toString());
  };

  const handleSelectSchool = (sch: SchoolTenant) => {
    setSelectedSchool(sch);
    updateUrl(sch.id);
  };

  const handleBackToSchools = () => {
    setSelectedSchool(null);
    updateUrl(null);
  };

  // Filtered Schools for Step 1
  const filteredSchools = mockSchools.filter(
    (sch) =>
      sch.name.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
      sch.npsn.includes(schoolSearchTerm) ||
      sch.city.toLowerCase().includes(schoolSearchTerm.toLowerCase())
  );

  // Filtered Classes for Step 2
  const currentSchoolClasses = selectedSchool
    ? classesList.filter((cls) => cls.schoolId === selectedSchool.id || cls.schoolName === selectedSchool.name)
    : [];

  const filteredClasses = currentSchoolClasses.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.homeroomTeacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || cls.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage) || 1;
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleToggleStatus = (id: string) => {
    setClassesList(
      classesList.map((c) => {
        if (c.id === id) {
          return { ...c, status: c.status === 'active' ? 'inactive' : 'active' };
        }
        return c;
      })
    );
  };

  const handleAddClassSubmit = (newClassData: {
    name: string;
    level: string;
    major: string;
    homeroomTeacher: string;
    homeroomPhone: string;
    roomName: string;
    capacity: number;
  }) => {
    if (!selectedSchool) return;

    const createdClass: ClassRombel = {
      id: `cls-${Date.now().toString().slice(-4)}`,
      schoolId: selectedSchool.id,
      schoolName: selectedSchool.name,
      name: newClassData.name,
      level: newClassData.level,
      major: newClassData.major || 'Umum',
      homeroomTeacher: newClassData.homeroomTeacher,
      homeroomPhone: newClassData.homeroomPhone || '-',
      roomName: newClassData.roomName,
      capacity: newClassData.capacity,
      totalStudents: 0,
      status: 'active',
    };

    setClassesList([createdClass, ...classesList]);
    setShowAddModal(false);
    alert(`Rombel ${createdClass.name} berhasil ditambahkan ke ${selectedSchool.name}!`);
  };

  return (
    <div className="space-y-5">
      {/* STEP 1: SELECT SCHOOL CARD GRID */}
      {!selectedSchool ? (
        <ClassSchoolGrid
          schools={filteredSchools}
          schoolSearchTerm={schoolSearchTerm}
          onSearchChange={setSchoolSearchTerm}
          onSelectSchool={handleSelectSchool}
        />
      ) : (
        /* STEP 2: SCHOOL SPECIFIC CLASS MANAGEMENT WORKSPACE */
        <div className="space-y-4">
          {/* Breadcrumb Navigation Back */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={handleBackToSchools}
              className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Pilih Sekolah
            </button>

            <span className="text-xs text-slate-500">
              Konteks Sekolah: <strong className="text-slate-900 dark:text-slate-100">{selectedSchool.name}</strong> ({selectedSchool.npsn})
            </span>
          </div>

          {/* School Header Banner Card */}
          <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-blue-600 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded">
                    {selectedSchool.level}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedSchool.name}</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  NPSN: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedSchool.npsn}</span> • {selectedSchool.city} • Admin: {selectedSchool.adminName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Rombel Kelas
                </button>
              </div>
            </div>
          </Card>

          {/* Search & Level Filters */}
          <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-80">
              <Input
                id="search-class"
                placeholder="Cari Nama Kelas, Wali Kelas, Ruangan..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                icon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto text-xs">
              <span className="text-slate-500 font-medium">Filter Tingkat:</span>
              <select
                value={levelFilter}
                onChange={(e) => {
                  setLevelFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
              >
                <option value="all">Semua Tingkat Kelas</option>
                <option value="12">Tingkat 12 / XII</option>
                <option value="11">Tingkat 11 / XI</option>
                <option value="10">Tingkat 10 / X</option>
                <option value="9">Tingkat 9 / IX</option>
                <option value="8">Tingkat 8 / VIII</option>
                <option value="7">Tingkat 7 / VII</option>
                <option value="6">Tingkat 6 / VI</option>
                <option value="5">Tingkat 5 / V</option>
              </select>
            </div>
          </Card>

          {/* Class Data Table */}
          <ClassTable
            classes={paginatedClasses}
            totalFilteredCount={filteredClasses.length}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      )}

      {/* Add Class Modal */}
      {showAddModal && selectedSchool && (
        <AddClassModal
          school={selectedSchool}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddClassSubmit}
        />
      )}
    </div>
  );
};

export default ClassManager;
