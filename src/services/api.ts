import { LOCAL_STORAGE_KEYS } from '../constants';

const BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4014';

export interface ApiResponse<T> {
  status?: number;
  code?: number;
  success?: boolean;
  message: string;
  data: T;
  errors?: any;
}


class ApiService {
  private static getHeaders(customHeaders: HeadersInit = {}, isFormData = false): HeadersInit {
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    // Retrieve JWT token from localStorage (runs on client side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return { ...headers, ...customHeaders };
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      }
    }


    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }
      return data as T;
    } else {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }
      return text as unknown as T;
    }
  }

  public static async get<T>(
    endpoint: string,
    headers: HeadersInit = {},
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(headers),
    });
    return this.handleResponse<T>(response);
  }

  public static async post<T>(
    endpoint: string,
    body: any,
    headers: HeadersInit = {},
  ): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(headers, isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  public static async put<T>(
    endpoint: string,
    body: any,
    headers: HeadersInit = {},
  ): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(headers, isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  public static async patch<T>(
    endpoint: string,
    body: any,
    headers: HeadersInit = {},
  ): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(headers, isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  public static async delete<T>(
    endpoint: string,
    headers: HeadersInit = {},
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(headers),
    });
    return this.handleResponse<T>(response);
  }
}

export default ApiService;
