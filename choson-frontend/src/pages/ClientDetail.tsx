import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getClient, deleteClient } from '../api/clients';
import { getInvoices } from '../api/invoices';
import { useToast } from '../context/ToastContext';
import type { Client, Invoice } from '../types';

// const statusPillColors: Record<string, string> = { // TODO: statuses
//   pending: 'bg-yellow-900/30 text-yellow-500 border-yellow-700',
//   paid: 'bg-green-900/30 text-green-500 border-green-700',
//   cancelled: 'bg-red-900/30 text-red-500 border-red-700',
// };

// const statusLabels: Record<string, string> = { // TODO: statuses
//   pending: 'Чакащо',
//   paid: 'Платено',
//   cancelled: 'Анулирано',
// };

export default function ClientDetail() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const escHandler = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setShowDelete(false);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escHandler);
    return () => document.removeEventListener('keydown', escHandler);
  }, [escHandler]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getClient(id),
      getInvoices(),
    ])
      .then(([clientRes, invRes]) => {
        setClient(clientRes.data);
        setInvoices((invRes.data || []).filter((inv) => inv.clientId === id));
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!id || !client) return;
    setDeleting(true);
    try {
      await deleteClient(id);
      addToast(`"${client.name}" беше изтрит успешно`, 'success');
      navigate('/', { replace: true });
    } catch (err) {
      addToast((err as Error).message, 'error');
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;

  if (error) {
    return (
      <div>
        <div className="px-3 py-2 text-sm bg-red-900/20 text-red-400 border border-red-800 rounded">{error}</div>
        <Link to="/" className="text-sm text-gray-400 hover:text-white mt-3 inline-block">&larr; Обратно</Link>
      </div>
    );
  }

  if (!client) return null;

  const fields = [
    { label: 'Имейл', value: client.email },
    { label: 'Адрес', value: client.address },
    { label: 'Телефон', value: client.phone },
    { label: 'МОЛ', value: client.materially_responsible_person },
    { label: 'ЕИК / Булстат', value: client.company_registration_number },
    { label: 'ДДС номер', value: client.vat_number },
    { label: 'Данъчна ставка', value: client.tax_rate != null ? `${client.tax_rate}%` : undefined },
    { label: 'Банка', value: client.bank },
    { label: 'BIC', value: client.bic },
    { label: 'IBAN', value: client.iban },
    { label: 'Създадено', value: new Date(client.createdAt).toLocaleString('bg') },
  ];

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Обратно
      </Link>

      <div className="bg-surface-card border border-surface-border rounded-lg">
        <div className="px-5 py-4 border-b border-surface-border">
          <h2 className="text-base font-semibold text-white">{client.name}</h2>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => f.value ? (
            <div key={f.label}>
              <dt className="text-xs text-gray-500 uppercase tracking-wider mb-1">{f.label}</dt>
              <dd className="text-sm text-gray-200">{f.value}</dd>
            </div>
          ) : null)}
        </div>

        <div className="px-5 py-3 border-t border-surface-border flex gap-2">
          <button className="btn-primary" onClick={() => navigate(`/clients/${id}/edit`)}>Редактиране</button>
          <button className="btn-danger" onClick={() => setShowDelete(true)}>Изтриване</button>
        </div>
      </div>

      {invoices.length > 0 && (
        <div className="bg-surface-card border border-surface-border rounded-lg mt-4">
          <div className="px-5 py-3 border-b border-surface-border">
            <h3 className="text-sm font-semibold text-white">Фактури ({invoices.length})</h3>
          </div>
          <div className="divide-y divide-surface-border">
            {invoices.map((inv) => (
              <div key={inv.id} className="px-5 py-3 flex items-center justify-between hover:bg-surface-hover transition-colors cursor-pointer" onClick={() => navigate(`/invoices/${inv.id}`)}>
                <div>
                  <span className="text-sm text-white font-medium">{inv.invoiceNumber}</span>
                  {/* <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border font-medium ${statusPillColors[inv.status] || 'text-gray-500 border-gray-700'}`}>{statusLabels[inv.status] || inv.status}</span> // TODO: statuses */}
                </div>
                <span className="text-sm text-white font-medium">{inv.total.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setShowDelete(false)}>
          <div className="bg-surface-card rounded-lg p-6 max-w-sm w-full border border-surface-border animate-modal-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-white mb-1">Изтриване на &ldquo;{client.name}&rdquo;?</h3>
            <p className="text-sm text-gray-500 mb-5">Това действие е необратимо.</p>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setShowDelete(false)}>Отказ</button>
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
