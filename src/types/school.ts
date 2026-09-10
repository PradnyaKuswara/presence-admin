export interface School {
  id: number;
  uuid: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  logo?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  users_count?: number;
  classes_count?: number;
  students_count?: number;
}

export interface CreateSchoolPayload {
  name: string;
  address: string;
  email: string;
  phone: string;
  logo?: string;
  logoFile?: File | null;
}

export interface UpdateSchoolPayload {
  uuid: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  logo?: string;
  logoFile?: File | null;
}

export interface SchoolQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SchoolPaginatedResponse {
  data: School[];
  meta?: {
    total: number;
    page: number;
    last_page: number;
    limit: number;
  };
}
