import React, { useState } from 'react';
import { Card } from '../../components/card/Card';
import { Button } from '../../components/button/Button';
import { Input, Select } from '../../components/input';
import { SchoolTenant, ClassRombel } from '../../data/mockSaaSData';
import { Plus } from 'lucide-react';

interface AddClassModalProps {
  school: SchoolTenant;
  onClose: () => void;
  onSubmit: (newClassData: {
    name: string;
    level: string;
    major: string;
    homeroomTeacher: string;
    homeroomPhone: string;
    roomName: string;
    capacity: number;
  }) => void;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({ school, onClose, onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [level, setLevel] = useState<string>(school.level === 'SD' ? '5' : school.level === 'SMP' ? '8' : '10');
  const [major, setMajor] = useState<string>(school.level === 'SMK' ? 'Rekayasa Perangkat Lunak' : school.level === 'SMA' ? 'MIPA' : 'Umum');
  const [homeroomTeacher, setHomeroomTeacher] = useState<string>('');
  const [homeroomPhone, setHomeroomPhone] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [capacity, setCapacity] = useState<number>(36);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !homeroomTeacher) return;

    onSubmit({
      name,
      level,
      major,
      homeroomTeacher,
      homeroomPhone,
      roomName: roomName || `Ruang ${name}`,
      capacity: Number(capacity) || 36,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Tambah Master Kelas Baru
            </h3>
            <p className="text-xs text-slate-500">
              Sekolah: <strong className="text-blue-600 dark:text-blue-400">{school.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <Input
            label="Nama Rombel / Kelas"
            id="add-class-name"
            placeholder="misal: XII RPL 1, X MIPA 2, V B"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tingkat Kelas
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                <option value="1">Kelas 1 (SD)</option>
                <option value="2">Kelas 2 (SD)</option>
                <option value="3">Kelas 3 (SD)</option>
                <option value="4">Kelas 4 (SD)</option>
                <option value="5">Kelas 5 (SD)</option>
                <option value="6">Kelas 6 (SD)</option>
                <option value="7">Kelas 7 (SMP)</option>
                <option value="8">Kelas 8 (SMP)</option>
                <option value="9">Kelas 9 (SMP)</option>
                <option value="10">Kelas 10 (SMA/SMK)</option>
                <option value="11">Kelas 11 (SMA/SMK)</option>
                <option value="12">Kelas 12 (SMA/SMK)</option>
              </select>
            </div>

            <Input
              label="Jurusan / Peminatan"
              id="add-class-major"
              placeholder="misal: RPL, MIPA, Umum"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>

          <Input
            label="Nama Wali Kelas"
            id="add-homeroom-teacher"
            placeholder="misal: Dra. Siti Rahmah, M.Pd"
            value={homeroomTeacher}
            onChange={(e) => setHomeroomTeacher(e.target.value)}
            required
          />

          <Input
            label="Nomor WhatsApp Wali Kelas"
            id="add-homeroom-phone"
            placeholder="081234567890"
            value={homeroomPhone}
            onChange={(e) => setHomeroomPhone(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Ruangan Kelas"
              id="add-room-name"
              placeholder="misal: Lab Komputer 2"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            <Input
              label="Kapasitas Siswa"
              id="add-capacity"
              type="number"
              value={String(capacity)}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Master Kelas
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
