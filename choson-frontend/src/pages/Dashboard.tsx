import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClients, deleteClient } from '../api/clients';
import { getProducts } from '../api/products';
import { getInvoices } from '../api/invoices';
import { useToast } from '../context/ToastContext';
import type { Client } from '../types';

function sortBy<T>(arr: T[], key: keyof T, dir: 'asc' | 'desc'): T[] {
  return [...arr].sort((a, b) => {
    const av = a[key], bv = b[key];
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'string' && typeof bv === 'string') {
      return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return dir === 'asc' ? (av < bv ? -1 : 1) : (bv < av ? -1 : 1);
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [pendingInvoiceCount, setPendingInvoiceCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof Client>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  function toggleSort(key: keyof Client) {
    if (key === sortKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.all([
      getClients(),
      getProducts(),
      getInvoices(),
    ])
      .then(([clientsRes, productsRes, invoicesRes]) => {
        setClients(clientsRes.data || []);
        setProductCount((productsRes.data || []).length);
        const invs = invoicesRes.data || [];
        setInvoiceCount(invs.length);
        setPendingInvoiceCount(invs.filter((i) => i.status === 'pending').length);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDeleteTarget(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteClient(deleteTarget.id);
      addToast(`"${deleteTarget.name}" беше изтрит успешно`, 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      addToast((err as Error).message, 'error');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  const filtered = sortBy(clients.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || (c.phone && c.phone.includes(search))
  ), sortKey, sortDir);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-lg p-5 animate-pulse">
              <div className="h-3 w-20 bg-gray-700 rounded mb-2" />
              <div className="h-6 w-12 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center py-20"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-card border border-surface-border rounded-lg p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Клиенти</p>
          <p className="text-2xl font-bold text-white mt-1">{clients.length}</p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-lg p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Продукти</p>
          <p className="text-2xl font-bold text-white mt-1">{productCount}</p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-lg p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Фактури</p>
          <p className="text-2xl font-bold text-white mt-1">{invoiceCount}</p>
          {pendingInvoiceCount > 0 && (
            <p className="text-xs text-yellow-500 mt-1">{pendingInvoiceCount} чакащи</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Клиенти</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} от {clients.length}</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Търсене..."
              className="w-48 pl-9 pr-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none placeholder:text-gray-600" />
          </div>
          <button className="btn-secondary p-2" onClick={load} title="Обнови">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="btn-primary" onClick={() => navigate('/clients/new')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Нов клиент
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 text-sm bg-red-900/20 text-red-400 border border-red-800 rounded">{error}</div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-surface-border rounded-lg">
          <svg className="w-10 h-10 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-sm text-gray-500 mb-4">{search ? 'Няма клиенти, отговарящи на търсенето.' : 'Все още няма клиенти.'}</p>
          {!search && <button className="btn-primary" onClick={() => navigate('/clients/new')}>Създайте първия си клиент</button>}
        </div>
      ) : (
        <>
          <div className="hidden md:block border border-surface-border rounded-lg overflow-hidden">
            <table>
              <thead>
                <tr className="bg-black text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium cursor-pointer hover:text-white select-none" onClick={() => toggleSort('name')}>Име{sortKey === 'name' && <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>}</th>
                  <th className="text-left px-4 py-3 font-medium cursor-pointer hover:text-white select-none" onClick={() => toggleSort('email')}>Имейл{sortKey === 'email' && <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>}</th>
                  <th className="text-left px-4 py-3 font-medium">Телефон</th>
                  <th className="text-left px-4 py-3 font-medium w-40">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="bg-surface-card hover:bg-surface-hover transition-colors cursor-pointer" onClick={() => navigate(`/clients/${c.id}`)}>
                    <td className="px-4 py-3 text-sm text-white font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{c.phone || <span className="text-gray-600">—</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-secondary text-xs px-2.5 py-1.5" onClick={() => navigate(`/clients/${c.id}/edit`)}>Редактиране</button>
                        <button className="btn-danger text-xs px-2.5 py-1.5" onClick={() => setDeleteTarget(c)}>Изтриване</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-2">
            {filtered.map((c) => (
              <div key={c.id} className="bg-surface-card border border-surface-border rounded-lg p-4" onClick={() => navigate(`/clients/${c.id}`)}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{c.name}</span>
                </div>
                <p className="text-xs text-gray-500">{c.email}</p>
                {c.phone && <p className="text-xs text-gray-500 mt-0.5">{c.phone}</p>}
                <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-secondary text-xs px-2.5 py-1.5" onClick={() => navigate(`/clients/${c.id}/edit`)}>Редактиране</button>
                  <button className="btn-danger text-xs px-2.5 py-1.5" onClick={() => setDeleteTarget(c)}>Изтриване</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-surface-card rounded-lg p-6 max-w-sm w-full border border-surface-border animate-modal-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-white mb-1">Изтриване на &ldquo;{deleteTarget.name}&rdquo;?</h3>
            <p className="text-sm text-gray-500 mb-5">Това действие е необратимо.</p>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Отказ</button>
              <button className="bg-white text-black px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-200 disabled:opacity-40 transition-colors" disabled={deleting} onClick={handleDelete}>
                {deleting ? 'Изтриване...' : 'Изтриване'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
