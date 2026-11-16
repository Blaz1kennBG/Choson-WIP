import { apiGet, apiPut } from './client';
import type { InvoiceSettings, InvoiceSettingsFormData } from '../types';

export function getInvoiceSettings() {
  return apiGet<InvoiceSettings>('/api/invoice-settings');
}

export function updateInvoiceSettings(data: InvoiceSettingsFormData) {
  return apiPut<InvoiceSettings>('/api/invoice-settings', data);
}
