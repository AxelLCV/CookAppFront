import { apiClient } from '@/config/client';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<void> {
  return apiClient<void>('/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser(): Promise<User> {
  return apiClient<User>('/auth');
}