import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { Product, ProductFormData } from '../types';

export function getProducts() {
  return apiGet<Product[]>('/api/products');
}

export function getProduct(id: string) {
  return apiGet<Product>(`/api/products/${id}`);
}

export function createProduct(data: ProductFormData) {
  return apiPost<Product>('/api/products', data);
}

export function updateProduct(id: string, data: ProductFormData) {
  return apiPut<Product>(`/api/products/${id}`, data);
}

export function deleteProduct(id: string) {
  return apiDelete(`/api/products/${id}`);
}
