import React, { useState, useEffect } from 'react';
import { Card } from '../../components/card/Card';
import { mockSchools, mockStudents, mockAcademicYears, SchoolTenant, AcademicYear } from '../../data/mockSaaSData';
import { ArrowLeft, Plus, FileSpreadsheet, Calendar, School as SchoolIcon } from 'lucide-react';

import { StudentSchoolGrid } from './StudentSchoolGrid';
import { AcademicYearGrid } from './AcademicYearGrid';
import { StudentFilterBar } from './StudentFilterBar';
import { StudentTable } from './StudentTable';
import { AddStudentModal } from './AddStudentModal';

export const SchoolStudentManager: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<SchoolTenant | null>(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null);

  const [activeAcademicYearString, setActiveAcademicYearString] = useState<string>('2026/2027 Ganjil');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [schoolSearchTerm, setSchoolSearchTerm] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Read URL query parameters on mount or popstate (SPA + Reload combination)
  useEffect(() => {
    const parseUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const schoolId = params.get('schoolId');
      const ayId = params.get('ayId');

      if (schoolId) {
        const sch = mockSchools.find((s) => s.id === schoolId);
        if (sch) {
          setSelectedSchool(sch);
          if (ayId) {
            const ay = mockAcademicYears.find((a) => a.id === ayId);
            if (ay) {
              setSelectedAcademicYear(ay);
              setActiveAcademicYearString(`${ay.year} ${ay.semester}`);
            } else {
              setSelectedAcademicYear(null);
            }
          } else {
            setSelectedAcademicYear(null);
          }
        } else {
          setSelectedSchool(null);
          setSelectedAcademicYear(null);
        }
      } else {
        setSelectedSchool(null);
        setSelectedAcademicYear(null);
      }
    };

    parseUrlParams();

    const handlePopState = () => parseUrlParams();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL helper function
  const updateUrl = (schId?: string | null, ayId?: string | null) => {
    const url = new URL(window.location.href);
    if (schId) {
      url.searchParams.set('schoolId', schId);
    } else {
      url.searchParams.delete('schoolId');
    }

    if (ayId) {
      url.searchParams.set('ayId', ayId);
    } else {
      url.searchParams.delete('ayId');
    }

    window.history.pushState({}, '', url.toString());
  };

  const handleSelectSchool = (sch: SchoolTenant) => {
    setSelectedSchool(sch);
    setSelectedAcademicYear(null);
    updateUrl(sch.id, null);
  };

  const handleSelectAcademicYear = (ay: AcademicYear) => {
    setSelectedAcademicYear(ay);
    setActiveAcademicYearString(`${ay.year} ${ay.semester}`);
    updateUrl(selectedSchool?.id, ay.id);
  };

  const handleBackToSchools = () => {
    setSelectedSchool(null);
    setSelectedAcademicYear(null);
    updateUrl(null, null);
  };

  const handleBackToAcademicYears = () => {
    setSelectedAcademicYear(null);
    updateUrl(selectedSchool?.id, null);
  };

  const filteredSchools = mockSchools.filter(
    (sch) =>
      sch.name.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
      sch.npsn.includes(schoolSearchTerm) ||
      sch.city.toLowerCase().includes(schoolSearchTerm.toLowerCase())
  );

  // Filter students based on selected school and selected academic year
  const currentStudents = selectedSchool
    ? mockStudents.filter(
        (std) =>
          (std.schoolId === selectedSchool.id || std.schoolName === selectedSchool.name) &&
          (selectedAcademicYear ? std.academicYear.includes(selectedAcademicYear.year) : true)
      )
    : [];

  const classesList = Array.from(new Set(currentStudents.map((s) => s.className)));

  const filteredStudents = currentStudents.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.nisn.includes(searchTerm) ||
      std.rfidCardId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || std.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
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

  const handleAddStudentSubmit = () => {
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5">
      {/* STEP 1: SELECT SCHOOL CARD GRID */}
      {!selectedSchool ? (
        <StudentSchoolGrid
          schools={filteredSchools}
          schoolSearchTerm={schoolSearchTerm}
          onSearchChange={setSchoolSearchTerm}
          onSelectSchool={handleSelectSchool}
        />
      ) : !selectedAcademicYear ? (
        /* STEP 2: SELECT ACADEMIC YEAR CARD GRID FOR SELECTED SCHOOL */
        <AcademicYearGrid
          school={selectedSchool}
          onBackToSchools={handleBackToSchools}
          onSelectAcademicYear={handleSelectAcademicYear}
        />
      ) : (
        /* STEP 3: SCHOOL & ACADEMIC YEAR SPECIFIC STUDENT MANAGEMENT WORKSPACE */
        <div className="space-y-4">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-2 font-semibold">
              <button
                onClick={handleBackToSchools}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <SchoolIcon className="w-3.5 h-3.5" /> {selectedSchool.name}
              </button>
              <span className="text-slate-400">/</span>
              <button
                onClick={handleBackToAcademicYears}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" /> TA {selectedAcademicYear.year} ({selectedAcademicYear.semester})
              </button>
              <span className="text-slate-400">/</span>
              <span className="text-slate-700 dark:text-slate-300">Database Siswa</span>
            </div>

            <button
              onClick={handleBackToAcademicYears}
              className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Pilih Tahun Ajaran Lain
            </button>
          </div>

          {/* School Header Banner Card */}
          <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-blue-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded">
                    {selectedSchool.level}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedSchool.name}</h2>
                  <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 font-bold">
                    TA {selectedAcademicYear.year} ({selectedAcademicYear.semester})
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  NPSN: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedSchool.npsn}</span> • {selectedSchool.city} • Periode KBM: {selectedAcademicYear.startDate} - {selectedAcademicYear.endDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Fitur Ekspor Excel Rekap Siswa akan mendownload file .xlsx')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export Data Siswa
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Siswa
                </button>
              </div>
            </div>
          </Card>

          {/* Search & Class Filter Controls */}
          <StudentFilterBar
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            selectedClass={selectedClass}
            onClassChange={(val) => {
              setSelectedClass(val);
              setCurrentPage(1);
            }}
            classesList={classesList}
          />

          {/* Student Data Table */}
          <StudentTable
            students={paginatedStudents}
            totalFilteredCount={filteredStudents.length}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && selectedSchool && (
        <AddStudentModal
          school={selectedSchool}
          activeAcademicYear={activeAcademicYearString}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddStudentSubmit}
        />
      )}
    </div>
  );
};

export default SchoolStudentManager;
