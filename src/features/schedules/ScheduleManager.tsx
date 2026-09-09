import React, { useState, useEffect } from 'react';
import { Card } from '../../components/card/Card';
import { Input } from '../../components/input';
import { mockSchools, mockAcademicYears, mockSchedules, SchoolTenant, AcademicYear, AttendanceSchedule } from '../../data/mockSaaSData';
import { ArrowLeft, Plus, Search, Calendar, School as SchoolIcon } from 'lucide-react';

import { ScheduleSchoolGrid } from './ScheduleSchoolGrid';
import { ScheduleAcademicYearGrid } from './ScheduleAcademicYearGrid';
import { ScheduleTable } from './ScheduleTable';
import { AddScheduleModal } from './AddScheduleModal';

export const ScheduleManager: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<SchoolTenant | null>(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null);
  const [schedulesList, setSchedulesList] = useState<AttendanceSchedule[]>(mockSchedules);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [schoolSearchTerm, setSchoolSearchTerm] = useState<string>('');
  const [dayFilter, setDayFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Synchronize URL parameters on mount or popstate (SPA + Reload combination)
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

  // Filtered Schools for Step 1
  const filteredSchools = mockSchools.filter(
    (sch) =>
      sch.name.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
      sch.npsn.includes(schoolSearchTerm) ||
      sch.city.toLowerCase().includes(schoolSearchTerm.toLowerCase())
  );

  // Filtered Schedules for Step 3
  const currentSchoolSchedules = selectedSchool
    ? schedulesList.filter(
        (s) =>
          s.schoolId === selectedSchool.id &&
          (selectedAcademicYear ? s.academicYear.includes(selectedAcademicYear.year) : true)
      )
    : [];

  const filteredSchedules = currentSchoolSchedules.filter((s) => {
    const matchesSearch =
      s.scheduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.targetClassName && s.targetClassName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDay = dayFilter === 'all' || s.dayName === dayFilter;
    return matchesSearch && matchesDay;
  });

  const handleToggleStatus = (id: string) => {
    setSchedulesList(
      schedulesList.map((s) => {
        if (s.id === id) {
          return { ...s, status: s.status === 'active' ? 'inactive' : 'active' };
        }
        return s;
      })
    );
  };

  const handleAddScheduleSubmit = (scheduleData: {
    scheduleName: string;
    targetType: 'all_classes' | 'specific_class';
    targetClassName?: string;
    dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Semua Hari Kerja';
    checkInStart: string;
    checkInDeadline: string;
    lateToleranceLimit: string;
    checkOutStart: string;
    checkOutEnd: string;
  }) => {
    if (!selectedSchool || !selectedAcademicYear) return;

    const createdSchedule: AttendanceSchedule = {
      id: `schd-${Date.now().toString().slice(-4)}`,
      schoolId: selectedSchool.id,
      schoolName: selectedSchool.name,
      academicYear: `${selectedAcademicYear.year} ${selectedAcademicYear.semester}`,
      targetType: scheduleData.targetType,
      targetClassName: scheduleData.targetClassName,
      scheduleName: scheduleData.scheduleName,
      dayName: scheduleData.dayName,
      checkInStart: scheduleData.checkInStart,
      checkInDeadline: scheduleData.checkInDeadline,
      lateToleranceLimit: scheduleData.lateToleranceLimit,
      checkOutStart: scheduleData.checkOutStart,
      checkOutEnd: scheduleData.checkOutEnd,
      status: 'active',
    };

    setSchedulesList([createdSchedule, ...schedulesList]);
    setShowAddModal(false);
    alert(`Aturan Jam Presensi "${createdSchedule.scheduleName}" berhasil ditambahkan!`);
  };

  return (
    <div className="space-y-5">
      {/* STEP 1: SELECT SCHOOL CARD GRID */}
      {!selectedSchool ? (
        <ScheduleSchoolGrid
          schools={filteredSchools}
          schoolSearchTerm={schoolSearchTerm}
          onSearchChange={setSchoolSearchTerm}
          onSelectSchool={handleSelectSchool}
        />
      ) : !selectedAcademicYear ? (
        /* STEP 2: SELECT ACADEMIC YEAR CARD GRID FOR SELECTED SCHOOL */
        <ScheduleAcademicYearGrid
          school={selectedSchool}
          onBackToSchools={handleBackToSchools}
          onSelectAcademicYear={handleSelectAcademicYear}
        />
      ) : (
        /* STEP 3: SCHOOL & ACADEMIC YEAR SPECIFIC SCHEDULE MANAGEMENT WORKSPACE */
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
              <span className="text-slate-700 dark:text-slate-300">Jam Presensi</span>
            </div>

            <button
              onClick={handleBackToAcademicYears}
              className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Pilih Tahun Ajaran Lain
            </button>
          </div>

          {/* School Header Banner Card */}
          <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-amber-500 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-600 text-white rounded">
                    {selectedSchool.level}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedSchool.name}</h2>
                  <span className="text-xs bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-800 font-bold">
                    TA {selectedAcademicYear.year} ({selectedAcademicYear.semester})
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  NPSN: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedSchool.npsn}</span> • Matriks Aturan Jam Presensi RFID Terpasang
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Aturan Jam Presensi
                </button>
              </div>
            </div>
          </Card>

          {/* Search & Day Filters */}
          <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-80">
              <Input
                id="search-schedule"
                placeholder="Cari Nama Aturan / Target Kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto text-xs">
              <span className="text-slate-500 font-medium">Filter Hari:</span>
              <select
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-medium"
              >
                <option value="all">Semua Hari Efektif</option>
                <option value="Semua Hari Kerja">Semua Hari Kerja (Senin - Kamis)</option>
                <option value="Senin">Senin Only</option>
                <option value="Selasa">Selasa Only</option>
                <option value="Rabu">Rabu Only</option>
                <option value="Kamis">Kamis Only</option>
                <option value="Jumat">Jumat Only</option>
                <option value="Sabtu">Sabtu Only</option>
              </select>
            </div>
          </Card>

          {/* Schedule Data Table */}
          <ScheduleTable
            schedules={filteredSchedules}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      )}

      {/* Add Schedule Modal */}
      {showAddModal && selectedSchool && selectedAcademicYear && (
        <AddScheduleModal
          school={selectedSchool}
          academicYear={selectedAcademicYear}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddScheduleSubmit}
        />
      )}
    </div>
  );
};

export default ScheduleManager;
