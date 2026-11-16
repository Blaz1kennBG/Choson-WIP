export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  materially_responsible_person?: string;
  company_registration_number?: string;
  vat_number?: string;
  tax_rate?: number;
  bank?: string;
  bic?: string;
  iban?: string;
  createdAt: string;
  creatorId: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  address: string;
  phone: string;
  materially_responsible_person: string;
  company_registration_number: string;
  vat_number: string;
  tax_rate: number | null;
  bank: string;
  bic: string;
  iban: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  product_number?: string;
  measure_units?: string;
  createdAt: string;
  creatorId: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  product_number: string;
  measure_units: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  measure_units?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string | null;
  total: number;
  status: string;
  createdAt: string;
  creatorId: string;
  payment_type?: string;
  bank?: string;
  bic?: string;
  iban?: string;
  due_date?: string;
  items: InvoiceItem[];
}

export interface InvoiceItemFormData {
  productId: string;
  quantity: number;
  unitPrice: number;
  measure_units?: string;
}

export interface InvoiceFormData {
  clientId: string;
  items: InvoiceItemFormData[];
  payment_type: string;
  bank: string;
  bic: string;
  iban: string;
  due_date?: string;
}

export interface InvoiceSettings {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  materially_responsible_person?: string;
  company_registration_number?: string;
  vat_number?: string;
  creatorId: string;
}

export interface InvoiceSettingsFormData {
  name: string;
  address: string;
  phone: string;
  materially_responsible_person: string;
  company_registration_number: string;
  vat_number: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T | null;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}
