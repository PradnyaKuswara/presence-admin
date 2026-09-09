import React, { useState } from 'react';
import { Badge } from '../../components/badge/Badge';
import { mockUsers, mockSchools, User, SchoolTenant } from '../../data/mockSaaSData';
import { UserHeaderStats } from './UserHeaderStats';
import { SchoolCardSelection } from './SchoolCardSelection';
import { UserFilterBar } from './UserFilterBar';
import { UserTable } from './UserTable';
import { AddUserModal } from './AddUserModal';
import { ResetPasswordModal } from './ResetPasswordModal';
import { ArrowLeft, Building2 } from 'lucide-react';

export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<User | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // View state
  const [selectedSchool, setSelectedSchool] = useState<SchoolTenant | null>(null);
  const [viewMode, setViewMode] = useState<'schools' | 'users'>('schools');
  const [schoolSearchTerm, setSchoolSearchTerm] = useState<string>('');

  // Filter logic for school selection cards
  const filteredSchools = mockSchools.filter(sch =>
    sch.name.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
    sch.npsn.includes(schoolSearchTerm) ||
    sch.city.toLowerCase().includes(schoolSearchTerm.toLowerCase())
  );

  // Filter Logic
  const filteredUsers = users.filter(usr => {
    const matchesSearch =
      usr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usr.schoolName && usr.schoolName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || usr.role === roleFilter;
    const matchesSchool = selectedSchool
      ? usr.schoolId === selectedSchool.id
      : (schoolFilter === 'all' ? true : (schoolFilter === 'super_admin_only' ? usr.role === 'super_admin' : usr.schoolId === schoolFilter));
    const matchesStatus = statusFilter === 'all' || usr.status === statusFilter;

    return matchesSearch && matchesRole && matchesSchool && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddUserSubmit = (newUser: {
    name: string;
    email: string;
    phone: string;
    role: 'super_admin' | 'admin' | 'user';
    schoolId: string;
    password: string;
  }) => {
    const selectedSch = mockSchools.find(s => s.id === newUser.schoolId);

    const createdUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || '-',
      role: newUser.role,
      schoolId: newUser.role === 'super_admin' ? undefined : newUser.schoolId,
      schoolName: newUser.role === 'super_admin' ? undefined : selectedSch?.name,
      status: 'active',
      lastLogin: 'Belum Pernah Login',
    };

    setUsers([createdUser, ...users]);
    setShowAddModal(false);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
      }
      return u;
    }));
  };

  const handleConfirmResetPassword = (tempPassword: string) => {
    if (showResetModal) {
      alert(`Password untuk user ${showResetModal.name} (${showResetModal.email}) telah berhasil direset ke: ${tempPassword}`);
      setShowResetModal(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner / Summary Header */}
      <UserHeaderStats users={users} onAddUser={() => setShowAddModal(true)} />

      {/* VIEW 1: SELECT SCHOOL STEP */}
      {!selectedSchool && viewMode === 'schools' ? (
        <SchoolCardSelection
          schools={filteredSchools}
          users={users}
          schoolSearchTerm={schoolSearchTerm}
          onSearchChange={setSchoolSearchTerm}
          onSelectSchool={(sch) => {
            setSelectedSchool(sch);
            setViewMode('users');
          }}
          onSelectSuperAdmin={() => {
            setSelectedSchool(null);
            setRoleFilter('super_admin');
            setViewMode('users');
          }}
          onViewAllGlobal={() => {
            setSelectedSchool(null);
            setViewMode('users');
          }}
        />
      ) : (
        /* VIEW 2: SCHOOL SPECIFIC OR FILTERED USER MANAGEMENT WORKSPACE */
        <div className="space-y-4">
          {/* Header Navigation Back & Active Context */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setViewMode('schools');
                setSelectedSchool(null);
                setRoleFilter('all');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Pilih Sekolah
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Konteks Sekolah:</span>
              <Badge variant={selectedSchool ? "info" : "purple"} size="sm">
                <Building2 className="w-3 h-3 mr-1" />
                {selectedSchool ? selectedSchool.name : 'Semua Sekolah / Super Admin'}
              </Badge>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <UserFilterBar
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            roleFilter={roleFilter}
            onRoleFilterChange={(val) => {
              setRoleFilter(val);
              setCurrentPage(1);
            }}
            schoolFilter={schoolFilter}
            onSchoolFilterChange={(val) => {
              setSchoolFilter(val);
              setCurrentPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            selectedSchool={selectedSchool}
            schools={mockSchools}
          />

          {/* Table list */}
          <UserTable
            users={paginatedUsers}
            totalFilteredCount={filteredUsers.length}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onToggleStatus={toggleUserStatus}
            onOpenResetModal={setShowResetModal}
          />
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUserSubmit}
          schools={mockSchools}
        />
      )}

      {showResetModal && (
        <ResetPasswordModal
          user={showResetModal}
          onClose={() => setShowResetModal(null)}
          onConfirmReset={handleConfirmResetPassword}
        />
      )}
    </div>
  );
};

export default UserManager;
