import { useSyncExternalStore } from 'react';
import type { UserData } from '../types/user';
import ApiService, { type ApiResponse } from '../services/api';
import { LOCAL_STORAGE_KEYS } from '../constants';

export type { UserData };

const initialStore: UserData = {
  uuid: '',
  email: '',
  fullName: '',
  role: {
    id: '',
    name: '',
  },
  school: {
    id: 0,
    uuid: '',
    name: '',
    address: '',
    email: '',
    phone: '',
  },
  isActive: false,
  isEmailVerified: false,
  avatar: '',
};

let store: UserData = { ...initialStore };

const listeners = new Set<() => void>();

export const userStore = {
  getSnapshot() {
    return store;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setUserData(data: Partial<UserData>) {
    store = { ...store, ...data };
    listeners.forEach((l) => l());
  },
  clearUserData() {
    store = { ...initialStore };
    listeners.forEach((l) => l());
  },
  async validateAuth(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      userStore.clearUserData();
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_LOGGED_IN);
      return false;
    }

    try {
      const res = await ApiService.get<ApiResponse<UserData>>('/api/auth/me');
      const isSuccess = Boolean(res && (res.success || res.status === 200 || res.code === 200));
      if (isSuccess && res.data) {
        userStore.setUserData(res.data);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_LOGGED_IN, 'true');
        return true;
      }
    } catch (error) {
      console.warn('Auth validation failed:', error);
    }


    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_LOGGED_IN);
    userStore.clearUserData();
    return false;
  },
};

const getServerSnapshot = () => initialStore;

export function useUserData() {
  const user = useSyncExternalStore(
    userStore.subscribe,
    userStore.getSnapshot,
    getServerSnapshot,
  );

  return {
    user,
    validateAuth: userStore.validateAuth,
    setUserData: userStore.setUserData,
    clearUserData: userStore.clearUserData,
  };
}

export default useUserData;
