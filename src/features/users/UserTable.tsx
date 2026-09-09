import React from 'react';
import { Card } from '../../components/card/Card';
import { Badge } from '../../components/badge/Badge';
import { Button } from '../../components/button/Button';
import { Pagination } from '../../components/pagination/Pagination';
import { Mail, Phone, CheckCircle2, XCircle, Building2, Key } from 'lucide-react';
import { User } from '../../data/mockSaaSData';
import { USER_ROLES, ACCOUNT_STATUS } from '../../constants';

interface UserTableProps {
  users: User[];
  totalFilteredCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  onToggleStatus: (id: string) => void;
  onOpenResetModal: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  totalFilteredCount,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onToggleStatus,
  onOpenResetModal
}) => {
  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return <Badge variant="purple" size="sm">Super Admin</Badge>;
      case USER_ROLES.ADMIN:
        return <Badge variant="info" size="sm">Admin</Badge>;
      case USER_ROLES.USER:
        return <Badge variant="neutral" size="sm">User</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{role}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4">User / Pengguna</th>
              <th className="py-3.5 px-4">Role & Akses</th>
              <th className="py-3.5 px-4">Tenant Sekolah</th>
              <th className="py-3.5 px-4">Kontak</th>
              <th className="py-3.5 px-4">Status & Login Terakhir</th>
              <th className="py-3.5 px-4 text-right">Aksi & Keamanan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Tidak ada data user yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              users.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${usr.role === 'super_admin' ? 'bg-linear-to-tr from-purple-600 to-indigo-600' : 'bg-linear-to-tr from-blue-600 to-cyan-600'
                        }`}>
                        {usr.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{usr.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {usr.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {getRoleBadge(usr.role)}
                  </td>
                  <td className="py-3.5 px-4">
                    {usr.role === 'super_admin' ? (
                      <span className="text-slate-400 italic font-mono text-[11px]">Akses Semua Tenant (Global)</span>
                    ) : (
                      <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{usr.schoolName || '-'}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {usr.phone || '-'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <button
                        onClick={() => onToggleStatus(usr.id)}
                        className="cursor-pointer inline-block"
                        title="Klik untuk mengubah status akun"
                      >
                        {usr.status === ACCOUNT_STATUS.ACTIVE ? (
                          <Badge variant="success" size="sm">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Aktif
                            </span>
                          </Badge>
                        ) : (
                          <Badge variant="danger" size="sm">
                            <span className="flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Non-Aktif
                            </span>
                          </Badge>
                        )}
                      </button>
                      <p className="text-[10px] text-slate-400">Login: {usr.lastLogin}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenResetModal(usr)}
                        className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-950/40 text-[11px] py-1 px-2"
                        title="Reset Password User Ini"
                      >
                        <Key className="w-3 h-3 mr-1" /> Reset Pass
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalFilteredCount}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </div>
    </Card>
  );
};
