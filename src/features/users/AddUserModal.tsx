import React, { useState } from 'react';
import { Card } from '../../components/card/Card';
import { Button } from '../../components/button/Button';
import { Input } from '../../components/input';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { SchoolTenant } from '../../data/mockSaaSData';

interface AddUserModalProps {
  onClose: () => void;
  onSubmit: (user: {
    name: string;
    email: string;
    phone: string;
    role: 'super_admin' | 'admin' | 'user';
    schoolId: string;
    password: string;
  }) => void;
  schools: SchoolTenant[];
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onSubmit, schools }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin' as 'super_admin' | 'admin' | 'user',
    schoolId: schools[0]?.id || '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    onSubmit(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Tambah User Login Baru
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Nama Lengkap User"
            id="add-user-name"
            placeholder="misal: Ahmad Fauzi, S.Pd"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />

          <Input
            label="Email Login (Username)"
            id="add-user-email"
            type="email"
            placeholder="user@sekolah.sch.id"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />

          <Input
            label="Nomor WhatsApp / HP"
            id="add-user-phone"
            placeholder="081234567890"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Role Akses User
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="admin">Admin (Pengelola Tenant Sekolah)</option>
              <option value="user">User (Operator / Staf Presensi)</option>
              <option value="super_admin">Super Admin (Akses Global Platform)</option>
            </select>
          </div>

          {newUser.role !== 'super_admin' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Tenant Sekolah
              </label>
              <select
                value={newUser.schoolId}
                onChange={(e) => setNewUser({ ...newUser, schoolId: e.target.value })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                {schools.map(sch => (
                  <option key={sch.id} value={sch.id}>{sch.name} ({sch.city})</option>
                ))}
              </select>
            </div>
          )}

          <div className="relative">
            <Input
              label="Password Awal"
              id="add-user-password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password awal..."
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan User Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
