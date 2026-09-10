/**
 * Application Constant Definitions
 * Centralized constant key-values for storage keys, roles, status, and system options.
 */

// LocalStorage Keys
export const LOCAL_STORAGE_KEYS = {
  THEME: 'theme',
  AUTH_TOKEN: 'AUTH_TOKEN',
  USER_LOGGED_IN: 'user_logged_in',
  USER_SESSION: 'presence_user_session',
  ACTIVE_ACADEMIC_YEAR: 'presence_active_academic_year',
} as const;


// System User Roles
export const USER_ROLES = {
  SUPER_ADMIN_GLOBAL: 'super_admin_global',
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_ROLE_LABELS: Record<string, string> = {
  [USER_ROLES.SUPER_ADMIN_GLOBAL]: 'Super Admin Global',
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin Platform',
  [USER_ROLES.ADMIN]: 'Admin (Pengelola Tenant Sekolah)',
  [USER_ROLES.USER]: 'User (Operator / Staf Presensi)',
};

// Account Statuses
export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type AccountStatus = (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  [ACCOUNT_STATUS.ACTIVE]: 'Aktif',
  [ACCOUNT_STATUS.INACTIVE]: 'Non-Aktif',
};

// Student Attendance Statuses
export const ATTENDANCE_STATUS = {
  HADIR: 'hadir',
  TERLAMBAT: 'terlambat',
  SAKIT: 'sakit',
  IZIN: 'izin',
  ALPA: 'alpa',
} as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  [ATTENDANCE_STATUS.HADIR]: 'Hadir',
  [ATTENDANCE_STATUS.TERLAMBAT]: 'Terlambat',
  [ATTENDANCE_STATUS.SAKIT]: 'Sakit',
  [ATTENDANCE_STATUS.IZIN]: 'Izin',
  [ATTENDANCE_STATUS.ALPA]: 'Alpa',
};

// School Levels
export const SCHOOL_LEVELS = {
  SD: 'SD',
  SMP: 'SMP',
  SMA: 'SMA',
  SMK: 'SMK',
} as const;

export type SchoolLevel = (typeof SCHOOL_LEVELS)[keyof typeof SCHOOL_LEVELS];

export const SCHOOL_LEVEL_OPTIONS = [
  { value: 'all', label: 'Semua Jenjang (SD, SMP, SMA/SMK)' },
  { value: SCHOOL_LEVELS.SD, label: 'SD' },
  { value: SCHOOL_LEVELS.SMP, label: 'SMP' },
  { value: SCHOOL_LEVELS.SMA, label: 'SMA' },
  { value: SCHOOL_LEVELS.SMK, label: 'SMK' },
] as const;

// RFID Device Statuses
export const DEVICE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
} as const;

export type DeviceStatus = (typeof DEVICE_STATUS)[keyof typeof DEVICE_STATUS];

// Pagination Constants
export const PAGINATION_DEFAULTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_ITEMS_PER_PAGE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
} as const;
