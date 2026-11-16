import { apiPost, apiGet } from './client';
import type { User } from '../types';

export function login(name: string, password: string) {
  
  return apiPost<User>('/api/auth/login', { name, password });
}

export function register(name: string, email: string, password: string) {
  return apiPost<User>('/api/auth/register', { name, email, password });
}

export function logout() {
  return apiPost('/api/auth/logout');
}

export function getMe() {
  return apiGet<User>('/api/auth/me');
}
