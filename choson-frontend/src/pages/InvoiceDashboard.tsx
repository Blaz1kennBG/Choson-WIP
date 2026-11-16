import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInvoices, deleteInvoice } from '../api/invoices';
import { getClients } from '../api/clients';
import { useToast } from '../context/ToastContext';
import type { Invoice, Client } from '../types';

// const statusLabels: Record<string, string> = { // TODO: statuses
//   pending: 'Чакащо',
//   paid: 'Платено',
//   cancelled: 'Анулирано',
// };

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

export default function InvoiceDashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  // const [statusFilter, setStatusFilter] = useState(''); // TODO: statuses
  const [sortKey, setSortKey] = useState<keyof Invoice>('invoiceNumber');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function toggleSort(key: keyof Invoice) {
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
      getInvoices(),
      getClients(),
    ])
      .then(([invRes, cliRes]) => {
        setInvoices(invRes.data || []);
        setClients(cliRes.data || []);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  function clientName(clientId: string | null | undefined): string {
    if (!clientId) return '—';
    const c = clients.find((cl) => cl.id === clientId);
    return c ? c.name : '—';
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteInvoice(deleteTarget.id);
      addToast(`Фактура №${deleteTarget.invoiceNumber} беше изтрита успешно`, 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      addToast((err as Error).message, 'error');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDeleteTarget(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const filtered = sortBy(invoices.filter((inv) => {
    // if (statusFilter && inv.status !== statusFilter) return false; // TODO: statuses
    if (search) {
      const q = search.toLowerCase();
      const name = clientName(inv.clientId).toLowerCase();
      const num = String(inv.invoiceNumber);
      if (!name.includes(q) && !num.includes(q)) return false;
    }
    return true;
  }), sortKey, sortDir);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="hidden md:block border border-surface-border rounded-lg overflow-hidden">
          <table>
            <thead>
              <tr className="bg-black text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">№ Фактура</th>
                <th className="text-left px-4 py-3 font-medium">Клиент</th>
                <th className="text-right px-4 py-3 font-medium w-28">Сума</th>
                <th className="text-left px-4 py-3 font-medium w-40">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="bg-surface-card animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-700 rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-36 bg-gray-700 rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-700 rounded ml-auto" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-28 bg-gray-700 rounded" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-lg p-4 animate-pulse">
              <div className="h-4 w-32 bg-gray-700 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Фактури</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} от {invoices.length}</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Търсене..."
              className="w-48 pl-9 pr-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none placeholder:text-gray-600" />
          </div>
{/*          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} // TODO: statuses
            className="px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none">
            <option value="">Всички</option>
            <option value="pending">Чакащо</option>
            <option value="paid">Платено</option>
            <option value="cancelled">Анулирано</option>
          </select>*/}
          <button className="btn-secondary p-2" onClick={load} title="Обнови">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="btn-primary" onClick={() => navigate('/invoices/new')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Нова фактура
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 text-sm bg-red-900/20 text-red-400 border border-red-800 rounded">{error}</div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-surface-border rounded-lg">
          <svg className="w-10 h-10 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-gray-500 mb-4">{search ? 'Няма фактури, отговарящи на търсенето.' : 'Все още няма фактури.'}</p>
          {!search && <button className="btn-primary" onClick={() => navigate('/invoices/new')}>Създайте първата фактура</button>}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-surface-border rounded-lg overflow-hidden">
            <table>
              <thead>
                <tr className="bg-black text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium cursor-pointer hover:text-white select-none" onClick={() => toggleSort('invoiceNumber')}>№ Фактура{sortKey === 'invoiceNumber' && <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>}</th>
                  <th className="text-left px-4 py-3 font-medium">Клиент</th>
                  <th className="text-right px-4 py-3 font-medium w-28 cursor-pointer hover:text-white select-none" onClick={() => toggleSort('total')}>Сума{sortKey === 'total' && <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>}</th>
                  <th className="text-left px-4 py-3 font-medium w-40">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="bg-surface-card hover:bg-surface-hover transition-colors cursor-pointer" onClick={() => navigate(`/invoices/${inv.id}`)}>
                    <td className="px-4 py-3 text-sm text-white font-medium">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <span>{clientName(inv.clientId)}</span>
                        {/* <span className="text-xs text-gray-500">{statusLabels[inv.status] || inv.status}</span> // TODO: statuses */}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-white font-medium">{inv.total.toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-secondary text-xs px-2.5 py-1.5" onClick={() => navigate(`/invoices/${inv.id}/edit`)}>Редактиране</button>
                        <button className="btn-danger text-xs px-2.5 py-1.5" onClick={() => setDeleteTarget(inv)}>Изтриване</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((inv) => (
              <div key={inv.id} className="bg-surface-card border border-surface-border rounded-lg p-4" onClick={() => navigate(`/invoices/${inv.id}`)}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{inv.invoiceNumber}</span>
                  {/* <span className="text-xs text-gray-500">{statusLabels[inv.status] || inv.status}</span> // TODO: statuses */}
                </div>
                <p className="text-xs text-gray-500">{clientName(inv.clientId)}</p>
                <p className="text-xs text-white font-medium mt-1">{inv.total.toFixed(2)} €</p>
                <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-secondary text-xs px-2.5 py-1.5" onClick={() => navigate(`/invoices/${inv.id}/edit`)}>Редактиране</button>
                  <button className="btn-danger text-xs px-2.5 py-1.5" onClick={() => setDeleteTarget(inv)}>Изтриване</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-surface-card rounded-lg p-6 max-w-sm w-full border border-surface-border animate-modal-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-white mb-1">Изтриване на фактура №{deleteTarget.invoiceNumber}?</h3>
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
