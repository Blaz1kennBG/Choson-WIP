import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { Client, ClientFormData } from '../types';

export function getClients() {
  return apiGet<Client[]>('/api/clients');
}

export function getClient(id: string) {
  return apiGet<Client>(`/api/clients/${id}`);
}

export function createClient(data: ClientFormData) {
  return apiPost<Client>('/api/clients', data);
}

export function updateClient(id: string, data: ClientFormData) {
  return apiPut<Client>(`/api/clients/${id}`, data);
}

export function deleteClient(id: string) {
  return apiDelete(`/api/clients/${id}`);
}
