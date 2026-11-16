import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProduct, deleteProduct } from '../api/products';
import { useToast } from '../context/ToastContext';
import type { Product } from '../types';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!id || !product) return;
    setDeleting(true);
    try {
      await deleteProduct(id);
      addToast(`"${product.name}" беше изтрит успешно`, 'success');
      navigate('/products', { replace: true });
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
        <Link to="/products" className="text-sm text-gray-400 hover:text-white mt-3 inline-block">&larr; Обратно</Link>
      </div>
    );
  }

  if (!product) return null;

  const fields = [
    { label: 'Артикулен номер', value: product.product_number },
    { label: 'Мярка', value: product.measure_units },
    { label: 'Цена на дребно', value: `${product.price.toFixed(2)} €` },
    { label: 'Описание', value: product.description },
    { label: 'Създадено', value: new Date(product.createdAt).toLocaleDateString('bg', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
  ];

  return (
    <div>
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Обратно
      </Link>

      <div className="bg-surface-card border border-surface-border rounded-lg">
        <div className="px-5 py-4 border-b border-surface-border">
          <h2 className="text-base font-semibold text-white">{product.name}</h2>
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
          <button className="btn-primary" onClick={() => navigate(`/products/${id}/edit`)}>Редактиране</button>
          <button className="btn-danger" onClick={() => setShowDelete(true)}>Изтриване</button>
        </div>
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setShowDelete(false)}>
          <div className="bg-surface-card rounded-lg p-6 max-w-sm w-full border border-surface-border animate-modal-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-white mb-1">Изтриване на &ldquo;{product.name}&rdquo;?</h3>
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
