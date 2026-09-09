import React, { useState } from 'react';
import { Card } from '../../components/card/Card';
import { Button } from '../../components/button/Button';
import { Input } from '../../components/input';
import { Key } from 'lucide-react';
import { User } from '../../data/mockSaaSData';

interface ResetPasswordModalProps {
  user: User;
  onClose: () => void;
  onConfirmReset: (tempPassword: string) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ user, onClose, onConfirmReset }) => {
  const [tempPassword, setTempPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReset(tempPassword || 'Pass123!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" />
            Reset Password Akun
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Anda akan mereset password untuk user <strong className="text-slate-900 dark:text-slate-100">{user.name}</strong> ({user.email}).
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Password Baru"
            id="reset-password-input"
            type="text"
            placeholder="misal: Pass123! atau acak"
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            required
          />

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="danger" size="sm" className="bg-amber-600 hover:bg-amber-700 border-amber-600">
              Konfirmasi Reset Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
