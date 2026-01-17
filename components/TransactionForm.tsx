
import React, { useState, useMemo } from 'react';
import { Product, Store, User } from '../types';

interface TransactionFormProps {
  products: Product[];
  stores: Store[];
  onSubmit: (data: any) => void;
  currentUser: User;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ products, stores, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    productId: '',
    price: 0,
    paymentMethod: 'TRANSFER' as const,
    note: ''
  });

  const activeProducts = products.filter(p => p.active && p.stock > 0);

  // Find the currently selected product and its associated store
  const selectedProduct = useMemo(() => 
    products.find(p => p.id === formData.productId), 
    [formData.productId, products]
  );

  const selectedStore = useMemo(() => 
    stores.find(s => s.id === selectedProduct?.storeId),
    [selectedProduct, stores]
  );

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const product = products.find(p => p.id === e.target.value);
    if (product) {
      setFormData({
        ...formData,
        productId: product.id,
        price: product.sellPrice
      });
    } else {
      setFormData({
        ...formData,
        productId: '',
        price: 0
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.customerName) return;
    
    onSubmit({
      ...formData,
      productName: selectedProduct?.name || '',
      productCode: selectedProduct?.code || '',
      storeName: selectedStore?.name || ''
    });
    
    setFormData({
      customerName: '',
      productId: '',
      price: 0,
      paymentMethod: 'TRANSFER',
      note: ''
    });
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm text-sm";
  const displayInfoClass = "w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-600 text-sm font-bold flex items-center gap-2";

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/20 max-w-2xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
      
      <div className="mb-8 relative">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">New Sale Entry</h3>
        <p className="text-sm text-slate-500 font-medium">Record a manual transaction for a customer.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Name</label>
          <input
            required
            type="text"
            value={formData.customerName}
            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
            className={inputClass}
            placeholder="e.g. Andi Wijaya"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Selection</label>
            <select
              required
              value={formData.productId}
              onChange={handleProductChange}
              className={inputClass}
            >
              <option value="">Select a laptop</option>
              {activeProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selling Price (IDR)</label>
            <input
              required
              type="number"
              value={formData.price || ''}
              onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
              className={inputClass}
              placeholder="0"
            />
          </div>
        </div>

        {/* Auto-filled Product Metadata */}
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Laptop Code (SKU)</label>
              <div className={displayInfoClass}>
                <span className="text-blue-500">🏷️</span>
                <span className="font-mono tracking-tight">{selectedProduct.code}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Origin Branch</label>
              <div className={displayInfoClass}>
                <span className="text-emerald-500">🏬</span>
                <span>{selectedStore?.name || 'Loading branch...'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {(['TRANSFER', 'CASH', 'CREDIT'] as const).map(method => (
              <button
                key={method}
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: method })}
                className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                  formData.paymentMethod === method 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Notes</label>
          <textarea
            value={formData.note}
            onChange={e => setFormData({ ...formData, note: e.target.value })}
            className={`${inputClass} h-24 resize-none placeholder:italic`}
            placeholder="Warranty details, specific requests, etc."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
          >
            <span>💾</span>
            Finalize Transaction
          </button>
        </div>
      </form>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TransactionForm;
