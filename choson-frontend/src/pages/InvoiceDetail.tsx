import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getInvoice, deleteInvoice, downloadInvoicePdf } from '../api/invoices';
import { getClient } from '../api/clients';
import { getInvoiceSettings } from '../api/invoiceSettings';
import { useToast } from '../context/ToastContext';
import type { Invoice, Client, InvoiceSettings } from '../types';

// const statusLabels: Record<string, string> = { // TODO: statuses
//   pending: 'Чакащо',
//   paid: 'Платено',
//   cancelled: 'Анулирано',
// };

// const statusColors: Record<string, string> = { // TODO: statuses
//   pending: 'bg-yellow-900/30 text-yellow-500 border-yellow-700',
//   paid: 'bg-green-900/30 text-green-500 border-green-700',
//   cancelled: 'bg-red-900/30 text-red-500 border-red-700',
// };

export default function InvoiceDetail() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings | null>(null);
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
    getInvoice(id)
      .then((res) => setInvoice(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!invoice) return;
    if (invoice.clientId) {
      getClient(invoice.clientId)
        .then((res) => setClient(res.data))
        .catch(() => {});
    }
    getInvoiceSettings()
      .then((res) => setInvoiceSettings(res.data))
      .catch(() => {});
  }, [invoice]);

  async function handleDelete() {
    if (!id || !invoice) return;
    setDeleting(true);
    try {
      await deleteInvoice(id);
      addToast(`Фактура №${invoice.invoiceNumber} беше изтрита успешно`, 'success');
      navigate('/invoices', { replace: true });
    } catch (err) {
      addToast((err as Error).message, 'error');
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  function handlePdfDownload() {
    if (!id) return;
    downloadInvoicePdf(id);
    addToast('PDF се изтегля...', 'info');
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;

  if (error) {
    return (
      <div>
        <div className="px-3 py-2 text-sm bg-red-900/20 text-red-400 border border-red-800 rounded">{error}</div>
        <Link to="/invoices" className="text-sm text-gray-400 hover:text-white mt-3 inline-block">&larr; Обратно</Link>
      </div>
    );
  }

  if (!invoice) return null;

  const taxRate = client?.tax_rate ?? 20;
  const grandTotal = invoice.total * (1 + taxRate / 100);

  function amountInWordsBg(amount: number): string {
    const whole = Math.floor(amount);
    const cents = Math.round((amount - whole) * 100);
    const ones = ['', 'ЕДИН', 'ДВА', 'ТРИ', 'ЧЕТИРИ', 'ПЕТ', 'ШЕСТ', 'СЕДЕМ', 'ОСЕМ', 'ДЕВЕТ'];
    const tens = ['', 'ДЕСЕТ', 'ДВАДЕСЕТ', 'ТРИДЕСЕТ', 'ЧЕТИРИДЕСЕТ', 'ПЕТДЕСЕТ', 'ШЕСТДЕСЕТ', 'СЕДЕМДЕСЕТ', 'ОСЕМДЕСЕТ', 'ДЕВЕТДЕСЕТ'];
    const teens = ['ДЕСЕТ', 'ЕДИНАДЕСЕТ', 'ДВАНАДЕСЕТ', 'ТРИНАДЕСЕТ', 'ЧЕТИРИНАДЕСЕТ', 'ПЕТНАДЕСЕТ', 'ШЕСТНАДЕСЕТ', 'СЕДЕМНАДЕСЕТ', 'ОСЕМНАДЕСЕТ', 'ДЕВЕТНАДЕСЕТ'];

    function n2w(n: number): string {
      if (n === 0) return 'НУЛА';
      const parts: string[] = [];
      if (n >= 1000) {
        const t = Math.floor(n / 1000);
        parts.push(t === 1 ? 'ХИЛЯДА' : n2w(t) + ' ХИЛЯДИ');
        n %= 1000;
      }
      if (n >= 100) {
        const h = Math.floor(n / 100);
        parts.push(h === 1 ? 'СТО' : ones[h] + ' СТОТИН');
        n %= 100;
      }
      if (n >= 20) {
        const t = Math.floor(n / 10);
        parts.push(tens[t]);
        n %= 10;
      } else if (n >= 10) {
        parts.push(teens[n - 10]);
        n = 0;
      }
      if (n > 0) parts.push(ones[n]);
      return parts.join(' ');
    }

    let words = n2w(whole);
    if (cents > 0) words += ' И ' + cents + ' СТОТИНКИ';
    return words;
  }

  return (
    <div>
      <Link to="/invoices" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Обратно
      </Link>

      <div className="bg-surface-card border border-surface-border rounded-lg">
        <div className="px-5 py-4 border-b border-surface-border text-center">
          <h1 className="text-xl font-bold text-white">ФАКТУРА</h1>
          <p className="text-sm text-gray-300 mt-1">№ {invoice.invoiceNumber}</p>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-xs text-gray-500 flex items-center justify-between">
            <div>
              <p>Дата на издаване: {new Date(invoice.createdAt).toLocaleDateString('bg', { day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
              <p className="mt-0.5">Данъчно събитие: {new Date(invoice.createdAt).toLocaleDateString('bg', { day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
              {/* invoice.due_date && <p className="mt-0.5">Падежна дата: {invoice.due_date}</p> */}
            </div>
            {/* <span className="text-xs text-gray-500">{statusLabels[invoice.status] || invoice.status}</span> // TODO: statuses */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">ДОСТАВЧИК</span>
              <div className="mt-1 text-xs text-gray-300 space-y-0.5">
                {invoiceSettings ? (
                  <>
                    <p className="text-sm text-gray-200 font-medium">{invoiceSettings.name || '—'}</p>
                    {invoiceSettings.address && <p>{invoiceSettings.address}</p>}
                    {invoiceSettings.company_registration_number && <p>ЕИК: {invoiceSettings.company_registration_number}</p>}
                    {invoiceSettings.vat_number && <p>ДДС номер: {invoiceSettings.vat_number}</p>}
                    {invoiceSettings.phone && <p>Телефон: {invoiceSettings.phone}</p>}
                    {invoiceSettings.materially_responsible_person && <p>МОЛ: {invoiceSettings.materially_responsible_person}</p>}
                  </>
                ) : (
                  <p className="text-sm text-gray-600">—</p>
                )}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">ПОЛУЧАТЕЛ</span>
              {client ? (
                <div className="mt-1 text-xs text-gray-300 space-y-0.5">
                  <p className="text-sm text-gray-200 font-medium">{client.name}</p>
                  {client.address && <p>{client.address}</p>}
                  {client.company_registration_number && <p>ЕИК: {client.company_registration_number}</p>}
                  {client.vat_number && <p>ДДС номер: {client.vat_number}</p>}
                  {client.phone && <p>Телефон: {client.phone}</p>}
                  {client.materially_responsible_person && <p>МОЛ: {client.materially_responsible_person}</p>}
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-1">— Изтрит клиент</p>
              )}
            </div>
          </div>

          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">ПРОДУКТИ</h3>

          <div className="hidden md:block border border-surface-border rounded-lg overflow-hidden mb-4">
            <table>
              <thead>
                <tr className="bg-black text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Продукт</th>
                  <th className="text-center px-4 py-3 font-medium w-16">Мярка</th>
                  <th className="text-center px-4 py-3 font-medium w-16">Кол.</th>
                  <th className="text-right px-4 py-3 font-medium w-24">Цена</th>
                  <th className="text-right px-4 py-3 font-medium w-24">ДДС</th>
                  <th className="text-right px-4 py-3 font-medium w-24">Общо</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {invoice.items.map((item) => {
                  const itemVat = item.lineTotal * taxRate / 100;
                  return (
                    <tr key={item.id} className="bg-surface-card">
                      <td className="px-4 py-3 text-sm text-white">{item.productName}</td>
                      <td className="px-4 py-3 text-sm text-gray-300 text-center">{item.measure_units || 'бр.'}</td>
                      <td className="px-4 py-3 text-sm text-gray-300 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-300 text-right">{item.unitPrice.toFixed(2)} €</td>
                      <td className="px-4 py-3 text-sm text-gray-300 text-right">{itemVat.toFixed(2)} €</td>
                      <td className="px-4 py-3 text-sm text-white font-medium text-right">{item.lineTotal.toFixed(2)} €</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-2 mb-4">
            {invoice.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-black/50 rounded px-3 py-2 border border-surface-border">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500">{item.measure_units || 'бр.'} · {item.quantity} × {item.unitPrice.toFixed(2)} €</p>
                </div>
                <span className="text-sm text-white font-medium ml-3">{item.lineTotal.toFixed(2)} €</span>
              </div>
            ))}
          </div>

          <div className="border-t border-surface-border pt-3 space-y-1 text-right text-sm">
            <div className="flex justify-end gap-4">
              <span className="text-gray-400">ОБЩО:</span>
              <span className="text-white font-medium w-28 text-right">{invoice.total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-400">ДДС:</span>
              <span className="text-white font-medium w-28 text-right">{(invoice.total * taxRate / 100).toFixed(2)} €</span>
            </div>
            <div className="flex justify-end gap-4 border-t border-surface-border pt-2">
              <span className="text-gray-200 font-bold">Сума за плащане:</span>
              <span className="text-white font-bold w-auto text-right">{grandTotal.toFixed(2)}  (  {amountInWordsBg(grandTotal)} BGN  )</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Начин на плащане</span>
            <p className="text-sm text-gray-200 mt-0.5">
              {invoice.payment_type === 'bank_transfer' || !invoice.payment_type ? 'По сметка' : invoice.payment_type}
            </p>
            {(invoice.payment_type === 'bank_transfer' || !invoice.payment_type) && (
              <div className="mt-1 space-y-0.5">
                <p className="text-xs text-gray-400">Банка: {invoice.bank || ''}</p>
                <p className="text-xs text-gray-400">BIC: {invoice.bic || ''}</p>
                <p className="text-xs text-gray-400">IBAN: {invoice.iban || ''}</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-surface-border flex gap-2 flex-wrap">
          <button className="btn-primary" onClick={() => navigate(`/invoices/${id}/edit`)}>Редактиране</button>
          <button className="btn-secondary" onClick={() => {
            const params = new URLSearchParams();
            if (invoice.clientId) params.set('clientId', invoice.clientId);
            params.set('bank', invoice.bank || '');
            params.set('bic', invoice.bic || '');
            params.set('iban', invoice.iban || '');
            params.set('payment_type', invoice.payment_type || 'bank_transfer');
            const itemsJson = invoice.items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice }));
            params.set('items', JSON.stringify(itemsJson));
            navigate(`/invoices/new?${params.toString()}`);
          }}>Дублирай</button>
          <button className="bg-white text-black px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1.5" onClick={handlePdfDownload}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
          <button className="btn-danger" onClick={() => setShowDelete(true)}>Изтриване</button>
          <button className="btn-secondary" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            addToast('Линкът е копиран', 'info');
          }} aria-label="Копирай линк">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setShowDelete(false)}>
          <div className="bg-surface-card rounded-lg p-6 max-w-sm w-full border border-surface-border animate-modal-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-white mb-1">Изтриване на фактура №{invoice.invoiceNumber}?</h3>
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