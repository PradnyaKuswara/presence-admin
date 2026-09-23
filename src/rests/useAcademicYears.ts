import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryClient as defaultQueryClient } from './queryClient';
import ApiService, { type ApiResponse } from '../services/api';

import type {
  AcademicYear,
  CreateAcademicYearPayload,
  UpdateAcademicYearPayload,
  AcademicYearQueryParams,
  AcademicYearPaginatedResponse,
} from '../types/academicYear';

export type {
  AcademicYear,
  CreateAcademicYearPayload,
  UpdateAcademicYearPayload,
  AcademicYearQueryParams,
  AcademicYearPaginatedResponse,
};

export const ACADEMIC_YEAR_QUERY_KEY = ['academic-years'] as const;
export const DELETED_ACADEMIC_YEAR_QUERY_KEY = [
  'academic-years',
  'deleted',
] as const;

function getSafeQueryClient() {
  try {
    return useQueryClient();
  } catch {
    return defaultQueryClient;
  }
}

// Fetch list of academic years with pagination, search, and school_id filter
export function useAcademicYearsQuery(params?: AcademicYearQueryParams) {
  const client = getSafeQueryClient();

  return useQuery(
    {
      queryKey: [...ACADEMIC_YEAR_QUERY_KEY, params],
      queryFn: async () => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit)
          searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.school_id)
          searchParams.append('school_id', params.school_id.toString());

        const queryString = searchParams.toString()
          ? `?${searchParams.toString()}`
          : '';
        const response = await ApiService.get<
          ApiResponse<AcademicYearPaginatedResponse | AcademicYear[]>
        >(`/api/academic-years${queryString}`);

        return response.data;
      },
    },
    client,
  );
}

// Fetch list of soft-deleted academic years
export function useDeletedAcademicYearsQuery(params?: AcademicYearQueryParams) {
  const client = getSafeQueryClient();

  return useQuery(
    {
      queryKey: [...DELETED_ACADEMIC_YEAR_QUERY_KEY, params],
      queryFn: async () => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit)
          searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.school_id)
          searchParams.append('school_id', params.school_id.toString());

        const queryString = searchParams.toString()
          ? `?${searchParams.toString()}`
          : '';
        const response = await ApiService.get<
          ApiResponse<AcademicYearPaginatedResponse | AcademicYear[]>
        >(`/api/academic-years/deleted${queryString}`);

        return response.data;
      },
    },
    client,
  );
}

// Create new academic year
export function useCreateAcademicYearMutation() {
  const client = getSafeQueryClient();

  return useMutation(
    {
      mutationFn: async (payload: CreateAcademicYearPayload) => {
        const response = await ApiService.post<ApiResponse<AcademicYear>>(
          '/api/academic-years',
          payload,
        );
        return response.data;
      },
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ACADEMIC_YEAR_QUERY_KEY });
      },
    },
    client,
  );
}

// Update existing academic year
export function useUpdateAcademicYearMutation() {
  const client = getSafeQueryClient();

  return useMutation(
    {
      mutationFn: async (payload: UpdateAcademicYearPayload) => {
        const { id, ...body } = payload;
        const response = await ApiService.put<ApiResponse<AcademicYear>>(
          `/api/academic-years/${id}`,
          body,
        );
        return response.data;
      },
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ACADEMIC_YEAR_QUERY_KEY });
      },
    },
    client,
  );
}

// Set active academic year
export function useSetActiveAcademicYearMutation() {
  const client = getSafeQueryClient();

  return useMutation(
    {
      mutationFn: async (id: number) => {
        const response = await ApiService.post<ApiResponse<AcademicYear>>(
          `/api/academic-years/${id}/set-active`,
          {},
        );
        return response.data;
      },
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ACADEMIC_YEAR_QUERY_KEY });
      },
    },
    client,
  );
}

// Delete academic year (soft delete)
export function useDeleteAcademicYearMutation() {
  const client = getSafeQueryClient();

  return useMutation(
    {
      mutationFn: async (id: number) => {
        const response = await ApiService.delete<ApiResponse<null>>(
          `/api/academic-years/${id}`,
        );
        return response.data;
      },
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ACADEMIC_YEAR_QUERY_KEY });
        client.invalidateQueries({ queryKey: DELETED_ACADEMIC_YEAR_QUERY_KEY });
      },
    },
    client,
  );
}

// Restore soft-deleted academic year
export function useRestoreAcademicYearMutation() {
  const client = getSafeQueryClient();

  return useMutation(
    {
      mutationFn: async (id: number) => {
        const response = await ApiService.post<ApiResponse<AcademicYear>>(
          `/api/academic-years/${id}/restore`,
          {},
        );
        return response.data;
      },
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ACADEMIC_YEAR_QUERY_KEY });
        client.invalidateQueries({ queryKey: DELETED_ACADEMIC_YEAR_QUERY_KEY });
      },
    },
    client,
  );
}
