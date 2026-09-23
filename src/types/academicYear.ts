export interface AcademicYearSchoolSummary {
  id: number;
  uuid: string;
  name: string;
  logo?: string;
}

export interface AcademicYear {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  school_id: number;
  school?: AcademicYearSchoolSummary;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreateAcademicYearPayload {
  name: string;
  start_date: string;
  end_date: string;
  school_id: number;
  is_active?: boolean;
}

export interface UpdateAcademicYearPayload {
  id: number;
  name?: string;
  start_date?: string;
  end_date?: string;
  school_id?: number;
  is_active?: boolean;
}

export interface AcademicYearQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  school_id?: number;
}

export interface AcademicYearPaginatedResponse {
  data: AcademicYear[];
  meta?: {
    total: number;
    page: number;
    last_page: number;
    limit: number;
  };
}
