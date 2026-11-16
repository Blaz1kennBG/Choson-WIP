export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL || '';
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  return `http://${raw}`;
}

export const API_BASE = getApiBaseUrl();

export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

let refreshPromise: Promise<Response> | null = null;
let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb;
}

function doRefresh(): Promise<Response> {
  if (!refreshPromise) {
    refreshPromise = fetch(apiUrl('/api/auth/refresh'), { method: 'POST', credentials: 'include' })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

interface Options extends RequestInit {
  headers?: Record<string, string>;
}

function buildOptions(options: Options): RequestInit {
  return {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}

export async function apiFetch(url: string, options: Options = {}): Promise<Response> {
  const fullUrl = apiUrl(url);
  let res = await fetch(fullUrl, buildOptions(options));

  if (res.status === 401) {
    try {
      const refreshRes = await doRefresh();
      if (refreshRes.ok) {
        res = await fetch(fullUrl, buildOptions(options));
      } else {
        onUnauthorized?.();
      }
    } catch {
      onUnauthorized?.();
    }
  }

  return res;
}

export async function handleResponse<T>(res: Response): Promise<{ message: string; data: T | null }> {
  if (res.status === 204) return { message: '', data: null };
  const body = await res.json();
  if (!res.ok) {
    const msg =
      body.message ||
      body.errors?.[0]?.defaultMessage ||
      `Грешка при заявка (${res.status})`;
    throw new Error(msg);
  }
  return body;
}

export async function apiGet<T>(url: string): Promise<{ message: string; data: T | null }> {
  const res = await apiFetch(url);
  return handleResponse<T>(res);
}

export async function apiPost<T>(url: string, data?: unknown): Promise<{ message: string; data: T | null }> {
 
  const res = await apiFetch(url, { method: 'POST', body: JSON.stringify(data) });
  return handleResponse<T>(res);
}

export async function apiPut<T>(url: string, data?: unknown): Promise<{ message: string; data: T | null }> {
  const res = await apiFetch(url, { method: 'PUT', body: JSON.stringify(data) });
  return handleResponse<T>(res);
}

export async function apiDelete<T>(url: string): Promise<{ message: string; data: T | null }> {
  const res = await apiFetch(url, { method: 'DELETE' });
  return handleResponse<T>(res);
}
