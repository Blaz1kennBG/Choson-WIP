import { useState, useEffect } from 'react';
import { getInvoiceSettings, updateInvoiceSettings } from '../api/invoiceSettings';
import { useToast } from '../context/ToastContext';
import type { InvoiceSettingsFormData } from '../types';

export default function InvoiceSettings() {
  const { addToast } = useToast();

  const [form, setForm] = useState<InvoiceSettingsFormData>({ name: '', address: '', phone: '', materially_responsible_person: '', company_registration_number: '', vat_number: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getInvoiceSettings()
      .then((res) => {
        const s = res.data!;
        setForm({
          name: s.name || '',
          address: s.address || '',
          phone: s.phone || '',
          materially_responsible_person: s.materially_responsible_person || '',
          company_registration_number: s.company_registration_number || '',
          vat_number: s.vat_number || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateInvoiceSettings(form);
      addToast('Настройките са запазени успешно', 'success');
    } catch (err) {
      addToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">Настройки на фактурите</h2>

      <form onSubmit={handleSubmit} className="max-w-lg bg-surface-card border border-surface-border rounded-lg p-5 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Име на фирмата</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
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
        <div className="flex gap-2 justify-end pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Запазване...' : 'Запазване'}
          </button>
        </div>
      </form>
    </div>
  );
}
