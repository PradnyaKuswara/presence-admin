import React from 'react';
import { Card } from '../../components/card/Card';
import { Button } from '../../components/button/Button';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { User } from '../../data/mockSaaSData';
import { USER_ROLES, ACCOUNT_STATUS } from '../../constants';

interface UserHeaderStatsProps {
  users: User[];
  onAddUser: () => void;
}

export const UserHeaderStats: React.FC<UserHeaderStatsProps> = ({ users, onAddUser }) => {
  return (
    <Card className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 border-none shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Manajemen Akses & Autentikasi Sistem
          </div>
          <h1 className="text-xl md:text-2xl font-bold">Master Data User & Hak Akses Login</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Kelola kredensial login akun Super Admin platform dan Admin/Operator per sekolah. Setiap akun memiliki batasan hak akses data tenant sekolah masing-masing.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onAddUser}
          className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30"
        >
          <UserPlus className="w-4 h-4" /> Tambah User Baru
        </Button>
      </div>

      {/* Access Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
          <p className="text-slate-400 text-[11px] font-medium">Total Akun Terdaftar</p>
          <p className="text-lg font-bold text-white mt-0.5">{users.length} Akun</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
          <p className="text-slate-400 text-[11px] font-medium">Super Admin</p>
          <p className="text-lg font-bold text-purple-400 mt-0.5">{users.filter(u => u.role === USER_ROLES.SUPER_ADMIN).length} User</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
          <p className="text-slate-400 text-[11px] font-medium">Admin & Operator Sekolah</p>
          <p className="text-lg font-bold text-blue-400 mt-0.5">{users.filter(u => u.role !== USER_ROLES.SUPER_ADMIN).length} User</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
          <p className="text-slate-400 text-[11px] font-medium">Status Akun Aktif</p>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">{users.filter(u => u.status === ACCOUNT_STATUS.ACTIVE).length} Active</p>
        </div>
      </div>
    </Card>
  );
};
