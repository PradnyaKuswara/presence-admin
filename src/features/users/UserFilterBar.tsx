import React from 'react';
import { Card } from '../../components/card/Card';
import { Input } from '../../components/input';
import { Search } from 'lucide-react';
import { SchoolTenant } from '../../data/mockSaaSData';
import { USER_ROLES, ACCOUNT_STATUS } from '../../constants';

interface UserFilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  roleFilter: string;
  onRoleFilterChange: (val: string) => void;
  schoolFilter: string;
  onSchoolFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  selectedSchool: SchoolTenant | null;
  schools: SchoolTenant[];
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  schoolFilter,
  onSchoolFilterChange,
  statusFilter,
  onStatusFilterChange,
  selectedSchool,
  schools
}) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            id="search-user"
            placeholder="Cari nama user, email, atau nama sekolah..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-36">
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="all">Semua Role</option>
              <option value={USER_ROLES.SUPER_ADMIN}>Super Admin</option>
              <option value={USER_ROLES.ADMIN}>Admin</option>
              <option value={USER_ROLES.USER}>User</option>
            </select>
          </div>

          {!selectedSchool && (
            <div className="w-44">
              <select
                value={schoolFilter}
                onChange={(e) => onSchoolFilterChange(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                <option value="all">Semua Sekolah</option>
                <option value="super_admin_only">Super Admin Sahaja</option>
                {schools.map(sch => (
                  <option key={sch.id} value={sch.id}>{sch.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="w-32">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="all">Semua Status</option>
              <option value={ACCOUNT_STATUS.ACTIVE}>Aktif</option>
              <option value={ACCOUNT_STATUS.INACTIVE}>Non-Aktif</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
};
