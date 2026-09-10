import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryClient as defaultQueryClient } from './queryClient';
import ApiService, { type ApiResponse } from '../services/api';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { userStore } from '../hooks/useUserData';
import { toast } from '../hooks/useToast';

export function useLogoutMutation() {
  let queryClient;
  try {
    queryClient = useQueryClient();
  } catch {
    queryClient = defaultQueryClient;
  }

  return useMutation(
    {
      mutationFn: async () => {
        try {
          await ApiService.post<ApiResponse<null>>('/api/auth/logout', {});
        } catch (error) {
          console.warn('Logout request completed or fallback:', error);
        }
      },
      onSuccess: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_LOGGED_IN);
        userStore.clearUserData();
        queryClient?.clear();

        toast.success('Berhasil keluar dari akun');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
      onError: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_LOGGED_IN);
        userStore.clearUserData();
        queryClient?.clear();

        toast.success('Berhasil keluar dari akun');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
    },
    queryClient || defaultQueryClient
  );
}

export function useAuth() {
  const logoutMutation = useLogoutMutation();

  return {
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    logoutMutation,
  };
}

export default useAuth;
