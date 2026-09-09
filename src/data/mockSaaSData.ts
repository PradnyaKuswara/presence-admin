export interface AcademicYear {
  id: string;
  schoolId: string;
  schoolName: string;
  year: string; // e.g. "2026/2027"
  semester: 'Ganjil' | 'Genap';
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface SchoolTenant {
  id: string;
  npsn: string;
  name: string;
  level: 'SD' | 'SMP' | 'SMA' | 'SMK';
  city: string;
  totalStudents: number;
  totalClasses: number;
  adminName: string;
  adminEmail: string;
  rfidDeviceStatus: 'online' | 'offline';
  telegramBotStatus: 'active' | 'inactive';
  activeAcademicYear: string;
}

export interface Student {
  id: string;
  nisn: string;
  name: string;
  schoolId: string;
  schoolName: string;
  className: string;
  academicYear: string;
  rfidCardId: string;
  parentTelegramChatId: string;
  parentName: string;
  todayStatus: 'hadir' | 'terlambat' | 'sakit' | 'izin' | 'alpa';
  checkInTime: string;
  notificationSent: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  schoolId?: string; // Null for super_admin
  schoolName?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  avatarUrl?: string;
  phone?: string;
}

export interface TelegramLog {
  id: string;
  studentName: string;
  schoolName: string;
  recipientRole: 'Orang Tua' | 'Guru PIC';
  recipientName: string;
  messageType: 'Presensi Masuk' | 'Keterlambatan' | 'Izin / Sakit' | 'Absen Alpa';
  sentTime: string;
  status: 'delivered' | 'failed' | 'pending';
}

export const mockUsers: User[] = [
  {
    id: 'usr-00',
    name: 'Super Admin Utama',
    email: 'superadmin@presence.id',
    role: 'super_admin',
    status: 'active',
    lastLogin: '9 Sep 2026 14:30 WIB',
    phone: '081234567890'
  },
  {
    id: 'usr-01',
    name: 'Bambang Setyo',
    email: 'admin@smkn1jakarta.sch.id',
    role: 'admin',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    status: 'active',
    lastLogin: '9 Sep 2026 12:15 WIB',
    phone: '081298765432'
  },
  {
    id: 'usr-02',
    name: 'Operator SMKN 1',
    email: 'operator@smkn1jakarta.sch.id',
    role: 'user',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    status: 'active',
    lastLogin: '8 Sep 2026 16:45 WIB',
    phone: '081298765433'
  },
  {
    id: 'usr-03',
    name: 'Rina Wijaya',
    email: 'admin@smpn5bdg.sch.id',
    role: 'admin',
    schoolId: 'sch-02',
    schoolName: 'SMPN 5 Bandung',
    status: 'active',
    lastLogin: '9 Sep 2026 09:10 WIB',
    phone: '081311223344'
  },
  {
    id: 'usr-04',
    name: 'Dedi Kurniawan',
    email: 'admin@sdnmenteng01.sch.id',
    role: 'admin',
    schoolId: 'sch-03',
    schoolName: 'SDN Menteng 01',
    status: 'active',
    lastLogin: '7 Sep 2026 10:00 WIB',
    phone: '081544556677'
  },
  {
    id: 'usr-05',
    name: 'Siti Hajar',
    email: 'admin@sman3sby.sch.id',
    role: 'admin',
    schoolId: 'sch-04',
    schoolName: 'SMAN 3 Surabaya',
    status: 'inactive',
    lastLogin: '1 Sep 2026 11:20 WIB',
    phone: '081788990011'
  }
];

export const mockAcademicYears: AcademicYear[] = [
  // SMKN 1 Jakarta
  {
    id: 'ay-smkn1-1',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    year: '2026/2027',
    semester: 'Ganjil',
    isActive: true,
    startDate: '15 Juli 2026',
    endDate: '20 Desember 2026'
  },
  {
    id: 'ay-smkn1-2',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    year: '2025/2026',
    semester: 'Genap',
    isActive: false,
    startDate: '05 Januari 2026',
    endDate: '20 Juni 2026'
  },
  // SMPN 5 Bandung
  {
    id: 'ay-smpn5-1',
    schoolId: 'sch-02',
    schoolName: 'SMPN 5 Bandung',
    year: '2026/2027',
    semester: 'Ganjil',
    isActive: true,
    startDate: '14 Juli 2026',
    endDate: '19 Desember 2026'
  },
  {
    id: 'ay-smpn5-2',
    schoolId: 'sch-02',
    schoolName: 'SMPN 5 Bandung',
    year: '2025/2026',
    semester: 'Genap',
    isActive: false,
    startDate: '06 Januari 2026',
    endDate: '21 Juni 2026'
  },
  // SDN Menteng 01
  {
    id: 'ay-sdn1-1',
    schoolId: 'sch-03',
    schoolName: 'SDN Menteng 01',
    year: '2026/2027',
    semester: 'Ganjil',
    isActive: true,
    startDate: '16 Juli 2026',
    endDate: '22 Desember 2026'
  },
  // SMAN 3 Surabaya
  {
    id: 'ay-sman3-1',
    schoolId: 'sch-04',
    schoolName: 'SMAN 3 Surabaya',
    year: '2026/2027',
    semester: 'Ganjil',
    isActive: true,
    startDate: '13 Juli 2026',
    endDate: '18 Desember 2026'
  }
];

export const mockSchools: SchoolTenant[] = [
  {
    id: 'sch-01',
    npsn: '20103451',
    name: 'SMKN 1 Jakarta',
    level: 'SMK',
    city: 'Jakarta Pusat',
    totalStudents: 1240,
    totalClasses: 36,
    adminName: 'Bambang Setyo',
    adminEmail: 'admin@smkn1jakarta.sch.id',
    rfidDeviceStatus: 'online',
    telegramBotStatus: 'active',
    activeAcademicYear: '2026/2027 Ganjil'
  },
  {
    id: 'sch-02',
    npsn: '20108922',
    name: 'SMPN 5 Bandung',
    level: 'SMP',
    city: 'Bandung',
    totalStudents: 850,
    totalClasses: 24,
    adminName: 'Rina Wijaya',
    adminEmail: 'admin@smpn5bdg.sch.id',
    rfidDeviceStatus: 'online',
    telegramBotStatus: 'active',
    activeAcademicYear: '2026/2027 Ganjil'
  },
  {
    id: 'sch-03',
    npsn: '20101140',
    name: 'SDN Menteng 01',
    level: 'SD',
    city: 'Jakarta Pusat',
    totalStudents: 520,
    totalClasses: 18,
    adminName: 'Dedi Kurniawan',
    adminEmail: 'admin@sdnmenteng01.sch.id',
    rfidDeviceStatus: 'online',
    telegramBotStatus: 'active',
    activeAcademicYear: '2026/2027 Ganjil'
  },
  {
    id: 'sch-04',
    npsn: '20107719',
    name: 'SMAN 3 Surabaya',
    level: 'SMA',
    city: 'Surabaya',
    totalStudents: 1100,
    totalClasses: 30,
    adminName: 'Siti Hajar',
    adminEmail: 'admin@sman3sby.sch.id',
    rfidDeviceStatus: 'offline',
    telegramBotStatus: 'active',
    activeAcademicYear: '2026/2027 Ganjil'
  }
];

export const mockStudents: Student[] = [
  {
    id: 'std-1',
    nisn: '0081234567',
    name: 'Ahmad Faiz',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    className: 'XII RPL 1',
    academicYear: '2026/2027 Ganjil',
    rfidCardId: 'RFID-882194',
    parentTelegramChatId: '@ortu_faiz',
    parentName: 'H. Suryanto',
    todayStatus: 'hadir',
    checkInTime: '06:45 WIB',
    notificationSent: true
  },
  {
    id: 'std-2',
    nisn: '0081234599',
    name: 'Budi Kurnia',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    className: 'XII RPL 1',
    academicYear: '2026/2027 Ganjil',
    rfidCardId: 'RFID-882199',
    parentTelegramChatId: '@ortu_budi',
    parentName: 'Bpk. Kurnia',
    todayStatus: 'hadir',
    checkInTime: '06:50 WIB',
    notificationSent: true
  },
  {
    id: 'std-3',
    nisn: '0083456789',
    name: 'Rian Pratama',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    className: 'XII TKJ 2',
    academicYear: '2026/2027 Ganjil',
    rfidCardId: 'RFID-109283',
    parentTelegramChatId: '@ortu_rian',
    parentName: 'Bpk. Agus',
    todayStatus: 'terlambat',
    checkInTime: '07:18 WIB',
    notificationSent: true
  },
  {
    id: 'std-4',
    nisn: '0082345678',
    name: 'Nabila Azzahra',
    schoolId: 'sch-02',
    schoolName: 'SMPN 5 Bandung',
    className: 'IX A',
    academicYear: '2026/2027 Ganjil',
    rfidCardId: 'RFID-331290',
    parentTelegramChatId: '@ortu_nabila',
    parentName: 'Ibu Ratna',
    todayStatus: 'hadir',
    checkInTime: '06:50 WIB',
    notificationSent: true
  },
  {
    id: 'std-5',
    nisn: '0084567890',
    name: 'Cantika Putri',
    schoolId: 'sch-03',
    schoolName: 'SDN Menteng 01',
    className: 'V B',
    academicYear: '2026/2027 Ganjil',
    rfidCardId: 'RFID-771209',
    parentTelegramChatId: '@ortu_cantika',
    parentName: 'Ibu Dewi',
    todayStatus: 'sakit',
    checkInTime: '-',
    notificationSent: true
  },
  {
    id: 'std-6',
    nisn: '0085678901',
    name: 'Dimas Setiawan',
    schoolId: 'sch-04',
    schoolName: 'SMAN 3 Surabaya',
    className: 'XI MIPA 3',
    academicYear: '2026/2027 Ganjil',
    rfidCardId: 'RFID-445129',
    parentTelegramChatId: '@ortu_dimas',
    parentName: 'Bpk. Joko',
    todayStatus: 'alpa',
    checkInTime: '-',
    notificationSent: false
  }
];

export const mockTelegramLogs: TelegramLog[] = [
  {
    id: 'log-101',
    studentName: 'Ahmad Faiz',
    schoolName: 'SMKN 1 Jakarta',
    recipientRole: 'Orang Tua',
    recipientName: 'H. Suryanto',
    messageType: 'Presensi Masuk',
    sentTime: '06:45:12 WIB',
    status: 'delivered'
  },
  {
    id: 'log-102',
    studentName: 'Rian Pratama',
    schoolName: 'SMKN 1 Jakarta',
    recipientRole: 'Guru PIC',
    recipientName: 'Wali Kelas XII TKJ 2',
    messageType: 'Keterlambatan',
    sentTime: '07:18:05 WIB',
    status: 'delivered'
  },
  {
    id: 'log-103',
    studentName: 'Cantika Putri',
    schoolName: 'SDN Menteng 01',
    recipientRole: 'Orang Tua',
    recipientName: 'Ibu Dewi',
    messageType: 'Izin / Sakit',
    sentTime: '07:30:00 WIB',
    status: 'delivered'
  },
  {
    id: 'log-104',
    studentName: 'Dimas Setiawan',
    schoolName: 'SMAN 3 Surabaya',
    recipientRole: 'Guru PIC',
    recipientName: 'Wali Kelas XI MIPA 3',
    messageType: 'Absen Alpa',
    sentTime: '08:00:15 WIB',
    status: 'delivered'
  }
];

export interface ClassRombel {
  id: string;
  schoolId: string;
  schoolName: string;
  name: string;
  level: string;
  major?: string;
  homeroomTeacher: string;
  homeroomPhone?: string;
  roomName: string;
  capacity: number;
  totalStudents: number;
  status: 'active' | 'inactive';
}

export const mockClasses: ClassRombel[] = [
  {
    id: 'cls-01',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    name: 'XII RPL 1',
    level: '12',
    major: 'Rekayasa Perangkat Lunak',
    homeroomTeacher: 'Dra. Siti Rahmah, M.Pd',
    homeroomPhone: '081234112233',
    roomName: 'Lab Komputer 2 (Gedung B)',
    capacity: 36,
    totalStudents: 34,
    status: 'active',
  },
  {
    id: 'cls-02',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    name: 'XII TKJ 2',
    level: '12',
    major: 'Teknik Komputer & Jaringan',
    homeroomTeacher: 'Ahmad Hidayat, S.Kom',
    homeroomPhone: '081234445566',
    roomName: 'Lab Jaringan (Gedung B)',
    capacity: 36,
    totalStudents: 35,
    status: 'active',
  },
  {
    id: 'cls-03',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    name: 'XI MM 1',
    level: '11',
    major: 'Multimedia',
    homeroomTeacher: 'Nurul Aini, S.Sn',
    homeroomPhone: '081234778899',
    roomName: 'Studio Desain (Gedung C)',
    capacity: 36,
    totalStudents: 32,
    status: 'active',
  },
  {
    id: 'cls-04',
    schoolId: 'sch-02',
    schoolName: 'SMPN 5 Bandung',
    name: 'IX A',
    level: '9',
    major: 'Umum',
    homeroomTeacher: 'Drs. Supriadi',
    homeroomPhone: '081399887766',
    roomName: 'Ruang IX-A (Lantai 2)',
    capacity: 32,
    totalStudents: 30,
    status: 'active',
  },
  {
    id: 'cls-05',
    schoolId: 'sch-02',
    schoolName: 'SMPN 5 Bandung',
    name: 'VIII C',
    level: '8',
    major: 'Umum',
    homeroomTeacher: 'Eka Lestari, S.Pd',
    homeroomPhone: '081399887755',
    roomName: 'Ruang VIII-C (Lantai 1)',
    capacity: 32,
    totalStudents: 31,
    status: 'active',
  },
  {
    id: 'cls-06',
    schoolId: 'sch-03',
    schoolName: 'SDN Menteng 01',
    name: 'V B',
    level: '5',
    major: 'Tematik',
    homeroomTeacher: 'Sri Wahyuni, S.Pd.SD',
    homeroomPhone: '081511223344',
    roomName: 'Ruang Kelas 5B',
    capacity: 28,
    totalStudents: 26,
    status: 'active',
  },
  {
    id: 'cls-07',
    schoolId: 'sch-04',
    schoolName: 'SMAN 3 Surabaya',
    name: 'XI MIPA 3',
    level: '11',
    major: 'MIPA',
    homeroomTeacher: 'Ir. Bambang Triyono',
    homeroomPhone: '081766554433',
    roomName: 'Ruang MIPA-3 (Gedung Utama)',
    capacity: 36,
    totalStudents: 36,
    status: 'active',
  },
];

export interface AttendanceSchedule {
  id: string;
  schoolId: string;
  schoolName: string;
  academicYear: string; // e.g. "2026/2027 Ganjil"
  targetType: 'all_classes' | 'specific_class';
  targetClassName?: string; // e.g. "XII RPL 1" or "Semua Kelas"
  scheduleName: string; // e.g. "Jadwal Reguler Senin - Kamis", "Jadwal Khusus Jumat"
  dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Semua Hari Kerja';
  checkInStart: string; // e.g. "06:15"
  checkInDeadline: string; // e.g. "07:00" (Masuk Normal)
  lateToleranceLimit: string; // e.g. "07:15" (Batas Toleransi Terlambat)
  checkOutStart: string; // e.g. "15:30" (Batas Jam Pulang)
  checkOutEnd: string; // e.g. "17:00"
  status: 'active' | 'inactive';
  isHoliday?: boolean;
}

export const mockSchedules: AttendanceSchedule[] = [
  // SMKN 1 Jakarta (sch-01)
  {
    id: 'schd-01',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    academicYear: '2026/2027 Ganjil',
    targetType: 'all_classes',
    targetClassName: 'Semua Rombel (Global)',
    scheduleName: 'Reguler Masuk Pagi (Senin - Kamis)',
    dayName: 'Semua Hari Kerja',
    checkInStart: '06:15 WIB',
    checkInDeadline: '07:00 WIB',
    lateToleranceLimit: '07:15 WIB',
    checkOutStart: '15:30 WIB',
    checkOutEnd: '17:00 WIB',
    status: 'active',
    isHoliday: false,
  },
  {
    id: 'schd-02',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    academicYear: '2026/2027 Ganjil',
    targetType: 'all_classes',
    targetClassName: 'Semua Rombel (Global)',
    scheduleName: 'Jadwal Pendek Hari Jumat',
    dayName: 'Jumat',
    checkInStart: '06:15 WIB',
    checkInDeadline: '07:00 WIB',
    lateToleranceLimit: '07:15 WIB',
    checkOutStart: '11:45 WIB',
    checkOutEnd: '13:30 WIB',
    status: 'active',
    isHoliday: false,
  },
  {
    id: 'schd-03',
    schoolId: 'sch-01',
    schoolName: 'SMKN 1 Jakarta',
    academicYear: '2026/2027 Ganjil',
    targetType: 'specific_class',
    targetClassName: 'XII RPL 1',
    scheduleName: 'Jadwal Khusus Lab Komputer (Shift Siang)',
    dayName: 'Rabu',
    checkInStart: '08:00 WIB',
    checkInDeadline: '08:30 WIB',
    lateToleranceLimit: '08:45 WIB',
    checkOutStart: '16:00 WIB',
    checkOutEnd: '17:30 WIB',
    status: 'active',
    isHoliday: false,
  },

  // SMPN 5 Bandung (sch-02)
  {
    id: 'schd-04',
    schoolId: 'sch-02',
    schoolName: 'SMPN 5 Bandung',
    academicYear: '2026/2027 Ganjil',
    targetType: 'all_classes',
    targetClassName: 'Semua Rombel (Global)',
    scheduleName: 'Jadwal Reguler SMP Pagi',
    dayName: 'Semua Hari Kerja',
    checkInStart: '06:30 WIB',
    checkInDeadline: '07:15 WIB',
    lateToleranceLimit: '07:30 WIB',
    checkOutStart: '14:30 WIB',
    checkOutEnd: '16:00 WIB',
    status: 'active',
    isHoliday: false,
  },

  // SDN Menteng 01 (sch-03)
  {
    id: 'schd-05',
    schoolId: 'sch-03',
    schoolName: 'SDN Menteng 01',
    academicYear: '2026/2027 Ganjil',
    targetType: 'all_classes',
    targetClassName: 'Semua Rombel (Global)',
    scheduleName: 'Jadwal SD Pagi Reguler',
    dayName: 'Semua Hari Kerja',
    checkInStart: '06:30 WIB',
    checkInDeadline: '07:00 WIB',
    lateToleranceLimit: '07:15 WIB',
    checkOutStart: '12:30 WIB',
    checkOutEnd: '14:00 WIB',
    status: 'active',
    isHoliday: false,
  },
];
