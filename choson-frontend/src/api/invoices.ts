import { apiGet, apiPost, apiPut, apiDelete, apiUrl } from './client';
import type { Invoice, InvoiceFormData } from '../types';

export function getInvoices() {
  return apiGet<Invoice[]>('/api/invoices');
}

export function getInvoice(id: string) {
  return apiGet<Invoice>(`/api/invoices/${id}`);
}

export function createInvoice(data: InvoiceFormData) {
  return apiPost<Invoice>('/api/invoices', data);
}

export function updateInvoice(id: string, data: Partial<InvoiceFormData> & { status?: string, itemsPresent?: boolean, clientIdPresent?: boolean, statusPresent?: boolean }) {
  return apiPut<Invoice>(`/api/invoices/${id}`, data);
}

export function deleteInvoice(id: string) {
  return apiDelete(`/api/invoices/${id}`);
}

export function downloadInvoicePdf(id: string) {
  const url = apiUrl(`/api/invoices/${id}/pdf`);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
