import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../api/products';
import { useToast } from '../context/ToastContext';
import type { ProductFormData } from '../types';

export default function ProductForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ProductFormData>({ name: '', description: '', price: 0, product_number: '', measure_units: 'бр.' });
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
        document.getElementById('product-submit-btn')?.click();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    getProduct(id)
      .then((res) => {
        const p = res.data!;
        const vals = { name: p.name, description: p.description || '', price: p.price, product_number: p.product_number || '', measure_units: p.measure_units || 'бр.' };
        setForm(vals);
        initialRef.current = JSON.stringify(vals);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const value = e.target.name === 'price'
      ? parseFloat(e.target.value) || 0
      : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  const [customMu, setCustomMu] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit && id) {
        await updateProduct(id, form);
        addToast('Продуктът е актуализиран успешно', 'success');
      } else {
        await createProduct(form);
        addToast('Продуктът е създаден успешно', 'success');
      }
      navigate('/products', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Обратно
      </Link>

      <h2 className="text-lg font-semibold text-white mb-4">{isEdit ? 'Редактиране на продукт' : 'Нов продукт'}</h2>

      {error && (
        <div className="mb-4 px-3 py-2 text-sm bg-red-900/20 text-red-400 border border-red-800 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg bg-surface-card border border-surface-border rounded-lg p-5 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Име *</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required autoFocus
            placeholder="напр. Био мед" maxLength={100}
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none placeholder:text-gray-600" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Описание</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange}
            rows={4} placeholder="Опишете вашия продукт..." maxLength={500}
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none placeholder:text-gray-600 resize-none" />
          {form.description.length > 0 && (
            <p className="text-xs text-gray-600 mt-1 text-right">{form.description.length}/500</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-400 mb-1">Цена на дребно *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm pointer-events-none">€</span>
            <input id="price" name="price" type="number" step="0.01" min="0.01" value={form.price || ''} onChange={handleChange} required
              placeholder="0,00"
              className="w-full pl-11 pr-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none placeholder:text-gray-600" />
          </div>
        </div>

        <div>
          <label htmlFor="measure_units" className="block text-sm font-medium text-gray-400 mb-1">Мерна единица</label>
          {customMu ? (
            <div className="relative">
              <input id="measure_units" name="measure_units" type="text" value={form.measure_units} onChange={handleChange} autoFocus
                className="w-full px-3 py-2 pr-8 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
              <button type="button" aria-label="Използвай стандартни мерни единици" className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-white transition-colors"
                onClick={() => { setCustomMu(false); setForm({ ...form, measure_units: 'бр.' }); }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              {['бр.', 'кг', 'л', 'м', 'пакет', 'компл.'].map((u) => (
                <button key={u} type="button"
                  className={`px-3 py-2 text-sm rounded border ${form.measure_units === u ? 'bg-white text-black border-white' : 'bg-black text-gray-400 border-surface-border'} transition-colors`}
                  onClick={() => setForm({ ...form, measure_units: u })}>{u}</button>
              ))}
              <button type="button" className="px-3 py-2 text-sm rounded border border-surface-border text-gray-500 hover:text-white transition-colors"
                onClick={() => { setCustomMu(true); setForm({ ...form, measure_units: '' }); }}>Друга</button>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="product_number" className="block text-sm font-medium text-gray-400 mb-1">Артикулен номер</label>
          <input id="product_number" name="product_number" type="text" value={form.product_number} onChange={handleChange}
            placeholder="напр. ART-001"
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none placeholder:text-gray-600" />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button type="button" className="btn-secondary" onClick={() => navigate('/products')}>Отказ</button>
          <button id="product-submit-btn" type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Запазване...' : isEdit ? 'Актуализиране' : 'Създаване'}
          </button>
        </div>
      </form>
    </div>
  );
}
