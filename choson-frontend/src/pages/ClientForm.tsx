import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getClient, createClient, updateClient } from '../api/clients';
import { useToast } from '../context/ToastContext';
import type { ClientFormData } from '../types';

export default function ClientForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ClientFormData>({ name: '', email: '', address: '', phone: '', materially_responsible_person: '', company_registration_number: '', vat_number: '', tax_rate: 20, bank: '', bic: '', iban: '' });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const initialRef = useRef(JSON.stringify(form));

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (JSON.stringify(form) !== initialRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [form]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.getElementById('client-submit-btn')?.click();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    getClient(id)
      .then((res) => {
        const c = res.data!;
        const vals = { name: c.name, email: c.email, address: c.address || '', phone: c.phone || '', materially_responsible_person: c.materially_responsible_person || '', company_registration_number: c.company_registration_number || '', vat_number: c.vat_number || '', tax_rate: c.tax_rate ?? null, bank: c.bank || '', bic: c.bic || '', iban: c.iban || '' };
        setForm(vals);
        initialRef.current = JSON.stringify(vals);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  useEffect(() => {
    if (!isEdit || !id) return;
    getClient(id)
      .then((res) => {
        const c = res.data!;
        setForm({ name: c.name, email: c.email, address: c.address || '', phone: c.phone || '', materially_responsible_person: c.materially_responsible_person || '', company_registration_number: c.company_registration_number || '', vat_number: c.vat_number || '', tax_rate: c.tax_rate ?? null, bank: c.bank || '', bic: c.bic || '', iban: c.iban || '' });
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.type === 'number' ? (e.target.value ? parseFloat(e.target.value) : null) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit && id) {
        await updateClient(id, form);
        addToast('Клиентът е актуализиран успешно', 'success');
      } else {
        await createClient(form);
        addToast('Клиентът е създаден успешно', 'success');
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Обратно
      </Link>

      <h2 className="text-lg font-semibold text-white mb-4">{isEdit ? 'Редактиране на клиент' : 'Нов клиент'}</h2>

      {error && (
        <div className="mb-4 px-3 py-2 text-sm bg-red-900/20 text-red-400 border border-red-800 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg bg-surface-card border border-surface-border rounded-lg p-5 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Име *</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required autoFocus
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Имейл</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">Адрес</label>
          <input id="address" name="address" type="text" value={form.address} onChange={handleChange}
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">Телефон</label>
          <input id="phone" name="phone" type="text" value={form.phone} onChange={handleChange}
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
        </div>
        <div>
          <label htmlFor="materially_responsible_person" className="block text-sm font-medium text-gray-400 mb-1">МОЛ</label>
          <input id="materially_responsible_person" name="materially_responsible_person" type="text" value={form.materially_responsible_person} onChange={handleChange}
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
        </div>
        <div>
          <label htmlFor="company_registration_number" className="block text-sm font-medium text-gray-400 mb-1">ЕИК / Булстат</label>
          <input id="company_registration_number" name="company_registration_number" type="text" value={form.company_registration_number} onChange={handleChange}
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
        </div>
        <div>
          <label htmlFor="vat_number" className="block text-sm font-medium text-gray-400 mb-1">ДДС номер</label>
          <input id="vat_number" name="vat_number" type="text" value={form.vat_number} onChange={handleChange}
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
        </div>
        <div>
          <label htmlFor="tax_rate" className="block text-sm font-medium text-gray-400 mb-1">Данъчна ставка (%)</label>
          <input id="tax_rate" name="tax_rate" type="number" step="0.01" min="0" max="100" value={form.tax_rate ?? ''} onChange={handleChange}
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" placeholder="20" />
        </div>
        <div className="border-t border-surface-border pt-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">Банкови данни</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="bank" className="block text-xs font-medium text-gray-400 mb-1">Банка</label>
              <input id="bank" name="bank" type="text" value={form.bank} onChange={handleChange}
                className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
            </div>
            <div>
              <label htmlFor="bic" className="block text-xs font-medium text-gray-400 mb-1">BIC</label>
              <input id="bic" name="bic" type="text" value={form.bic} onChange={handleChange}
                className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
            </div>
            <div>
              <label htmlFor="iban" className="block text-xs font-medium text-gray-400 mb-1">IBAN</label>
              <input id="iban" name="iban" type="text" value={form.iban} onChange={handleChange}
                className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Отказ</button>
          <button id="client-submit-btn" type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Запазване...' : isEdit ? 'Актуализиране' : 'Създаване'}
          </button>
        </div>
      </form>
    </div>
  );
}
