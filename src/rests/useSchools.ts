import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryClient as defaultQueryClient } from './queryClient';
import ApiService, { type ApiResponse } from '../services/api';

import type {
  School,
  CreateSchoolPayload,
  UpdateSchoolPayload,
  SchoolQueryParams,
  SchoolPaginatedResponse,
} from '../types/school';

export type {
  School,
  CreateSchoolPayload,
  UpdateSchoolPayload,
  SchoolQueryParams,
  SchoolPaginatedResponse,
};

export const SCHOOL_QUERY_KEY = ['schools'] as const;
export const DELETED_SCHOOL_QUERY_KEY = ['schools', 'deleted'] as const;

function getSafeQueryClient() {
  try {
    return useQueryClient();
  } catch {
    return defaultQueryClient;
  }
}

// Fetch list of schools with pagination & search (Super Admin Global)
export function useSchoolsQuery(params?: SchoolQueryParams) {
  const client = getSafeQueryClient();

  return useQuery(
    {
      queryKey: [...SCHOOL_QUERY_KEY, params],
      queryFn: async () => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit)
          searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);

        const queryString = searchParams.toString()
          ? `?${searchParams.toString()}`
          : '';
        const response = await ApiService.get<
          ApiResponse<SchoolPaginatedResponse | School[]>
        >(`/api/schools${queryString}`);

        return response.data;
      },
    },
    client,
  );
}

// Fetch list of soft-deleted schools with pagination & search
export function useDeletedSchoolsQuery(params?: SchoolQueryParams) {
  const client = getSafeQueryClient();

  return useQuery(
    {
      queryKey: [...DELETED_SCHOOL_QUERY_KEY, params],
      queryFn: async () => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit)
          searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);

        const queryString = searchParams.toString()
          ? `?${searchParams.toString()}`
          : '';
        const response = await ApiService.get<
          ApiResponse<SchoolPaginatedResponse | School[]>
        >(`/api/schools/deleted${queryString}`);

        return response.data;
      },
    },
    client,
  );
}

export function buildSchoolFormData(payload: CreateSchoolPayload | UpdateSchoolPayload): FormData {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append('name', payload.name);
  if (payload.address !== undefined) formData.append('address', payload.address);
  if (payload.email !== undefined) formData.append('email', payload.email);
  if (payload.phone !== undefined) formData.append('phone', payload.phone);

  if (payload.logoFile instanceof File) {
    formData.append('logo', payload.logoFile);
  } else if (typeof payload.logo === 'string' && payload.logo.trim() !== '') {
    formData.append('logo', payload.logo.trim());
  } else if ('uuid' in payload && payload.logo === '') {
    formData.append('logo', '');
  }

  return formData;
}

// Create new school
export function useCreateSchoolMutation() {
  const client = getSafeQueryClient();

  return useMutation(
    {
      mutationFn: async (payload: CreateSchoolPayload) => {
        const formData = buildSchoolFormData(payload);
        const response = await ApiService.post<ApiResponse<School>>(
          '/api/schools',
          formData,
        );
        return response.data;
      },
      onSuccess: () => {
        client.invalidateQueries({ queryKey: SCHOOL_QUERY_KEY });
      },
    },
    client,
  );
}

// Update existing school
export function useUpdateSchoolMutation() {
  const client = getSafeQueryClient();

  return useMutation(
    {
      mutationFn: async (payload: UpdateSchoolPayload) => {
        const formData = buildSchoolFormData(payload);
        const response = await ApiService.put<ApiResponse<School>>(
          `/api/schools/${payload.uuid}`,
          formData,
        );
        return response.data;
      },
      onSuccess: () => {
        client.invalidateQueries({ queryKey: SCHOOL_QUERY_KEY });
      },
    },
    client,
  );
}

// Delete school
export function useDeleteSchoolMutation() {
  const client = getSafeQueryClient();

  return useMutation(
    {
      mutationFn: async (uuid: string) => {
        const response = await ApiService.delete<ApiResponse<null>>(
          `/api/schools/${uuid}`,
        );
        return response.data;
      },
      onSuccess: () => {
        client.invalidateQueries({ queryKey: SCHOOL_QUERY_KEY });
        client.invalidateQueries({ queryKey: DELETED_SCHOOL_QUERY_KEY });
      },
    },
    client,
  );
}

// Restore soft-deleted school
export function useRestoreSchoolMutation() {
  const client = getSafeQueryClient();

  return useMutation(
    {
      mutationFn: async (uuid: string) => {
        const response = await ApiService.post<ApiResponse<School>>(
          `/api/schools/${uuid}/restore`,
          {},
        );
        return response.data;
      },
      onSuccess: () => {
        client.invalidateQueries({ queryKey: SCHOOL_QUERY_KEY });
        client.invalidateQueries({ queryKey: DELETED_SCHOOL_QUERY_KEY });
      },
    },
    client,
  );
}
