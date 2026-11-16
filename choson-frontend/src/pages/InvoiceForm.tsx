import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { getInvoice, createInvoice, updateInvoice } from '../api/invoices';
import { getClients } from '../api/clients';
import { getProducts } from '../api/products';
import { useToast } from '../context/ToastContext';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { bg } from 'date-fns/locale';
import type { InvoiceFormData, Client, Product, InvoiceItemFormData } from '../types';

// const statusOptions = [ // TODO: statuses commented out
//   { value: 'pending', label: 'Чакащо' },
//   { value: 'paid', label: 'Платено' },
//   { value: 'cancelled', label: 'Анулирано' },
// ];

function emptyItem(): InvoiceItemFormData {
  return { productId: '', quantity: 1, unitPrice: 0 };
}

export default function InvoiceForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);

  const [clientId, setClientId] = useState(searchParams.get('clientId') || '');
  const [items, setItems] = useState<InvoiceItemFormData[]>(() => {
    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      try {
        return JSON.parse(itemsParam);
      } catch {}
    }
    return [emptyItem()];
  });
  // const [status, setStatus] = useState('pending'); // TODO: statuses
  const [paymentType, setPaymentType] = useState(searchParams.get('payment_type') || 'bank_transfer');
  const [bank, setBank] = useState(searchParams.get('bank') || '');
  const [bic, setBic] = useState(searchParams.get('bic') || '');
  const [iban, setIban] = useState(searchParams.get('iban') || '');
  const [dueDate, setDueDate] = useState(''); // TODO: due-date feature commented out
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [openProductDropdown, setOpenProductDropdown] = useState<number | null>(null);
  const initialRef = useRef('');

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    const q = productSearch.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.product_number && p.product_number.toLowerCase().includes(q)));
  }, [products, productSearch]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (JSON.stringify(formSnapshot()) !== initialRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  });

  function formSnapshot() {
    return JSON.stringify({ clientId, items /* TODO: statuses , status */, paymentType, bank, bic, iban /* TODO: , dueDate */ });
  }

  useEffect(() => {
    if (initialRef.current === '') {
      initialRef.current = formSnapshot();
    }
  });

  useEffect(() => {
    Promise.all([
      getClients().then((res) => setClients(res.data || [])).catch(() => {}),
      getProducts().then((res) => setProducts(res.data || [])).catch(() => {}),
    ]);
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    getInvoice(id)
      .then((res) => {
        const inv = res.data!;
        setClientId(inv.clientId || '');
        // setStatus(inv.status); // TODO: statuses
        setPaymentType(inv.payment_type || 'bank_transfer');
        setBank(inv.bank || '');
        setBic(inv.bic || '');
        setIban(inv.iban || '');
        // setDueDate(inv.due_date || ''); // TODO: due-date
        setItems(inv.items.length > 0
          ? inv.items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice }))
          : [emptyItem()]);
        initialRef.current = formSnapshot();
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleItemChange(index: number, field: keyof InvoiceItemFormData, value: string | number) {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      const newItem = { ...item, [field]: field === 'quantity' ? Math.max(1, Number(value)) : value };
      if (field === 'productId') {
        const product = products.find((p) => p.id === value);
        newItem.unitPrice = product ? product.price : 0;
      }
      return newItem;
    });
    setItems(updated);
  }

  function addItem() {
    setItems([...items, emptyItem()]);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  const computedTotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    const unitPrice = product ? product.price : item.unitPrice;
    return sum + unitPrice * item.quantity;
  }, 0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.getElementById('invoice-submit-btn')?.click();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const nonEmptyItems = items.filter((i) => i.productId !== '');
    if (nonEmptyItems.length === 0) {
      setError('Добавете поне един продукт');
      return;
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateInvoice(id, {
          clientId: clientId || null,
          // status, // TODO: statuses
          items: nonEmptyItems,
          payment_type: paymentType,
          bank,
          bic,
          iban,
          // due_date: dueDate, // TODO: due-date
          clientIdPresent: true,
          // statusPresent: true, // TODO: statuses
          itemsPresent: true,
          paymentTypePresent: true,
          bankPresent: true,
          bicPresent: true,
          ibanPresent: true,
          // dueDatePresent: true, // TODO: due-date
        } as any);
        addToast('Фактурата е актуализирана успешно', 'success');
      } else {
        await createInvoice({ clientId: clientId || null, items: nonEmptyItems, payment_type: paymentType, bank, bic, iban /* TODO: due_date: dueDate */ } as any);
        addToast('Фактурата е създадена успешно', 'success');
      }
      navigate('/invoices', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <Link to="/invoices" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Обратно
      </Link>

      <h2 className="text-lg font-semibold text-white mb-4">{isEdit ? 'Редактиране на фактура' : 'Нова фактура'}</h2>

      {error && (
        <div className="mb-4 px-3 py-2 text-sm bg-red-900/20 text-red-400 border border-red-800 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl bg-surface-card border border-surface-border rounded-lg p-5 space-y-4">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-400 mb-1">Клиент</label>
          <select id="clientId" value={clientId} onChange={(e) => {
            const newId = e.target.value;
            setClientId(newId);
            const client = clients.find((c) => c.id === newId);
            if (client) {
              setBank(client.bank || '');
              setBic(client.bic || '');
              setIban(client.iban || '');
            }
          }}
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none">
            <option value="">— Без клиент —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Начин на плащане</label>
          <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}
            className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none">
            <option value="bank_transfer">По сметка</option>
          </select>
          {paymentType === 'bank_transfer' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div>
                <label htmlFor="bank" className="block text-xs font-medium text-gray-400 mb-1">Банка</label>
                <input id="bank" type="text" value={bank} onChange={(e) => setBank(e.target.value)}
                  className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none placeholder:text-gray-600" />
              </div>
              <div>
                <label htmlFor="bic" className="block text-xs font-medium text-gray-400 mb-1">BIC</label>
                <input id="bic" type="text" value={bic} onChange={(e) => setBic(e.target.value)}
                  className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none placeholder:text-gray-600" />
              </div>
              <div>
                <label htmlFor="iban" className="block text-xs font-medium text-gray-400 mb-1">IBAN</label>
                <input id="iban" type="text" value={iban} onChange={(e) => setIban(e.target.value)}
                  className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none placeholder:text-gray-600" />
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-400">Продукти</label>
            <button type="button" onClick={addItem} className="text-xs text-gray-400 hover:text-white transition-colors">
              + Добави продукт
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => {
              const product = products.find((p) => p.id === item.productId);
              const unitPrice = product ? product.price : item.unitPrice;
              const lineTotal = unitPrice * item.quantity;

              return (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5 relative">
                    {openProductDropdown === index ? (
                      <div>
                        <div className="relative">
                          <input type="text" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} autoFocus
                            placeholder="Търсене на продукт..."
                            className="w-full px-2 py-2 bg-black text-white border border-gray-500 rounded text-sm outline-none pr-8" />
                          <button type="button" aria-label="Затвори търсене"
                            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-white"
                            onClick={() => { setOpenProductDropdown(null); setProductSearch(''); }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="absolute z-10 mt-1 w-full bg-surface-card border border-surface-border rounded max-h-48 overflow-y-auto shadow-lg">
                          {filteredProducts.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500">Няма резултати</div>
                          ) : filteredProducts.map((p) => (
                            <button key={p.id} type="button"
                              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-surface-hover transition-colors flex items-center justify-between"
                              onClick={() => { handleItemChange(index, 'productId', p.id); setOpenProductDropdown(null); setProductSearch(''); }}>
                              <span>{p.name}</span>
                              <span className="text-gray-400 text-xs">{p.price.toFixed(2)} €</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => { setOpenProductDropdown(index); setProductSearch(''); }}
                        className="w-full px-2 py-2 bg-black text-white border border-surface-border rounded text-sm text-left hover:border-gray-500 transition-colors">
                        {item.productId ? (products.find((p) => p.id === item.productId)?.name || '—') : <span className="text-gray-600">— Изберете —</span>}
                      </button>
                    )}
                  </div>
                  <div className="col-span-2">
                    <input type="number" min="1" step="1" value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none text-center" />
                  </div>
                  <div className="col-span-2 text-sm text-gray-300 text-right pt-2">{unitPrice.toFixed(2)} €</div>
                  <div className="col-span-2 text-sm text-white font-medium text-right pt-2">{lineTotal.toFixed(2)} €</div>
                  <div className="col-span-1 text-right">
                    {items.length > 1 && (
                      <button type="button" aria-label="Премахни продукт" onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-3 border-t border-surface-border mt-3">
            <div className="text-sm">
              <span className="text-gray-400">Общо: </span>
              <span className="text-white font-semibold text-base">{computedTotal.toFixed(2)} €</span>
            </div>
          </div>
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/*<div> // TODO: statuses
              <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">Статус</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none">
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>*/}
{/*            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-400 mb-1">Падежна дата</label>
              <DatePicker
                id="dueDate"
                locale={bg}
                selected={dueDate ? new Date(dueDate + 'T00:00:00') : null}
                onChange={(date) => setDueDate(date ? date.toISOString().split('T')[0] : '')}
                dateFormat="dd.MM.yyyy"
                placeholderText="Изберете дата"
                className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none"
                wrapperClassName="w-full"
                popperClassName="react-datepicker-dark"
              />
            </div>*/}
          </div>

        <div className="flex gap-2 justify-end pt-2">
          <button type="button" className="btn-secondary" onClick={() => navigate('/invoices')}>Отказ</button>
          <button id="invoice-submit-btn" type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Запазване...' : isEdit ? 'Актуализиране' : 'Създаване'}
          </button>
        </div>
      </form>
    </div>
  );
}
