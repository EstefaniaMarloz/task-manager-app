import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  TaskRequest,
  TaskResponse,
  User,
} from '@/types';

const BASE_URL = '';

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const authApi = {
  login: (data: LoginRequest) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) =>
    request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const tasksApi = {
  getAll: (token: string) =>
    request<TaskResponse[]>('/api/tasks', {}, token),

  getById: (id: number, token: string) =>
    request<TaskResponse>(`/api/tasks/${id}`, {}, token),

  create: (data: TaskRequest, token: string) =>
    request<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  update: (id: number, data: TaskRequest, token: string) =>
    request<TaskResponse>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token),

  delete: (id: number, token: string) =>
    request<void>(`/api/tasks/${id}`, { method: 'DELETE' }, token),
};

export const usersApi = {
  getAll: (token: string) =>
    request<User[]>('/api/users', {}, token),

  getById: (id: number, token: string) =>
    request<User>(`/api/users/${id}`, {}, token),

  updateRole: (id: number, role: string, token: string) =>
    request<User>(`/api/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }, token),

  delete: (id: number, token: string) =>
    request<void>(`/api/users/${id}`, { method: 'DELETE' }, token),
};
