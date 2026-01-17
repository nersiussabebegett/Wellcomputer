
import React, { useState, useMemo } from 'react';
import { Product, Store } from '../types';

interface InventoryProps {
  products: Product[];
  stores: Store[];
  onUpdateStock: (id: string, newStock: number) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, stores, onUpdateStock, onAddProduct, onDeleteProduct }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  
  const [newProd, setNewProd] = useState({ 
    code: '', 
    brand: '',
    name: '', 
    specs: '', 
    color: '',
    storeId: '', 
    buyPrice: 0, 
    sellPrice: 0, 
    stock: 0 
  });

  // Extract unique brands for classification menu
  const availableBrands = useMemo(() => {
    const brands = products.map(p => p.brand.toUpperCase());
    return Array.from(new Set(brands)).sort();
  }, [products]);

  // Group products by brand for the classified view
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    const brandsToInclude = selectedBrand === 'ALL' ? availableBrands : [selectedBrand];
    
    brandsToInclude.forEach(brand => {
      groups[brand] = products.filter(p => p.brand.toUpperCase() === brand);
    });

    return groups;
  }, [products, selectedBrand, availableBrands]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newProd.brand) {
      setError('Merek laptop harus diisi.');
      return;
    }

    const exists = products.some(p => p.code.toLowerCase() === newProd.code.toLowerCase());
    if (exists) {
      setError(`Kode laptop "${newProd.code}" sudah terdaftar. Silakan gunakan kode unik.`);
      return;
    }

    onAddProduct({
      ...newProd,
      id: `p${Date.now()}`,
      active: true,
      storeId: newProd.storeId || (stores[0]?.id || '')
    });
    
    setNewProd({ code: '', brand: '', name: '', specs: '', color: '', storeId: '', buyPrice: 0, sellPrice: 0, stock: 0 });
    setShowAdd(false);
  };

  const handleDuplicate = (p: Product) => {
    setNewProd({
      code: `${p.code}-COPY`,
      brand: p.brand,
      name: p.name,
      specs: p.specs,
      color: p.color,
      storeId: p.storeId,
      buyPrice: p.buyPrice,
      sellPrice: p.sellPrice,
      stock: p.stock
    });
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setError('Ubah kode laptop untuk membuat variasi produk baru.');
  };

  const inputClass = "w-full p-3 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-700 shadow-sm";

  return (
    <div className="space-y-8 pb-20">
      {/* Brand Menu with Counts */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedBrand('ALL')}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 flex items-center gap-2 ${
              selectedBrand === 'ALL' 
              ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
              : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
            }`}
          >
            <span>All Brands</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] ${selectedBrand === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {products.length}
            </span>
          </button>
          {availableBrands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 flex items-center gap-2 ${
                selectedBrand === brand 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
              }`}
            >
              <span>{brand}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] ${selectedBrand === brand ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {products.filter(p => p.brand.toUpperCase() === brand).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Katalog Inventaris</h3>
          <p className="text-sm text-slate-500 font-medium">Kelola stok unit laptop berdasarkan spesifikasi dan warna.</p>
        </div>
        <button 
          onClick={() => {
            if (showAdd) {
              setShowAdd(false);
              setError('');
            } else {
              setShowAdd(true);
            }
          }}
          className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
            showAdd 
            ? 'bg-slate-100 text-slate-600 border border-slate-200 shadow-none' 
            : 'bg-slate-900 hover:bg-blue-600 text-white shadow-blue-500/10'
          }`}
        >
          {showAdd ? 'Batal' : '+ Tambah Laptop Baru'}
        </button>
      </div>

      {/* Add Product Form Section */}
      {showAdd && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">💻</span>
              <h4 className="text-lg font-black text-slate-800">Registrasi Unit Baru</h4>
            </div>
            {error && (
              <div className={`mb-6 p-4 rounded-xl text-xs font-bold flex items-center gap-3 animate-shake bg-red-50 text-red-600 border border-red-100`}>
                <span>🚫</span>
                {error}
              </div>
            )}
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SKU / Kode Unit</label>
                  <input placeholder="AS-ROG-001" required className={`${inputClass} font-mono uppercase`} value={newProd.code} onChange={e=>setNewProd({...newProd, code: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Merek</label>
                  <input placeholder="ASUS, APPLE, HP..." required className={`${inputClass} uppercase`} value={newProd.brand} onChange={e=>setNewProd({...newProd, brand: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Varian Warna</label>
                  <input placeholder="e.g. Eclipse Gray" required className={inputClass} value={newProd.color} onChange={e=>setNewProd({...newProd, color: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Model</label>
                  <input placeholder="Zephyrus G14" required className={inputClass} value={newProd.name} onChange={e=>setNewProd({...newProd, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lokasi Stok</label>
                  <select required className={inputClass} value={newProd.storeId} onChange={e=>setNewProd({...newProd, storeId: e.target.value})}>
                    <option value="">Pilih Cabang</option>
                    {stores.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Spesifikasi Detail (Prosesor, RAM, SSD, GPU)</label>
                <textarea placeholder="Ryzen 9, 32GB RAM, RTX 4070..." required className={`${inputClass} h-20 resize-none`} value={newProd.specs} onChange={e=>setNewProd({...newProd, specs: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga Beli</label>
                  <input placeholder="0" required type="number" className={inputClass} value={newProd.buyPrice || ''} onChange={e=>setNewProd({...newProd, buyPrice: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga Jual</label>
                  <input placeholder="0" required type="number" className={inputClass} value={newProd.sellPrice || ''} onChange={e=>setNewProd({...newProd, sellPrice: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stok Unit</label>
                  <input placeholder="0" required type="number" className={inputClass} value={newProd.stock || ''} onChange={e=>setNewProd({...newProd, stock: parseInt(e.target.value)})} />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/10 transition-all active:scale-[0.98]">
                Konfirmasi Penambahan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Grouped Laptop List */}
      <div className="space-y-12">
        {(Object.entries(groupedProducts) as [string, Product[]][]).map(([brand, brandProducts]) => (
          <div key={brand} className="animate-fade-in">
            <div className="flex items-center gap-4 mb-6 px-2">
              <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border-2 border-slate-700">
                {brand.charAt(0)}
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{brand}</h4>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{brandProducts.length} Variasi Unit Tersedia</p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Model & SKU</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Varian Warna</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cabang</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stok Unit</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {brandProducts.map(p => {
                      const store = stores.find(s => s.id === p.storeId);
                      return (
                        <tr key={p.id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="bg-slate-100 text-slate-900 text-[9px] font-black font-mono px-2 py-0.5 rounded leading-none shadow-sm uppercase tracking-tight border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                  {p.code}
                                </span>
                                <span className="font-bold text-slate-800 text-base">{p.name}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-sm italic">
                                {p.specs}
                              </p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></span>
                              <span className="text-xs font-bold text-slate-600">{p.color}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold text-slate-500">{store?.name || 'Loading...'}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-center gap-4">
                              <button 
                                onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 1))}
                                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-md text-slate-400 hover:text-red-500 transition-all font-black text-lg"
                              >
                                -
                              </button>
                              <div className="flex flex-col items-center min-w-[3rem]">
                                <span className={`text-sm font-black ${p.stock < 5 ? 'text-red-500' : 'text-slate-800'}`}>
                                  {p.stock}
                                </span>
                                <span className="text-[8px] font-black uppercase text-slate-300 tracking-tighter">Units</span>
                              </div>
                              <button 
                                onClick={() => onUpdateStock(p.id, p.stock + 1)}
                                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-md text-slate-400 hover:text-emerald-500 transition-all font-black text-lg"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleDuplicate(p)}
                                className="p-2.5 bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm flex items-center gap-2 px-4"
                                title="Buat Variasi Baru (Warna/Kode)"
                              >
                                <span className="text-sm">👯</span>
                                <span className="text-[9px] font-black uppercase tracking-widest">Varian</span>
                              </button>
                              <button 
                                onClick={() => confirm(`Hapus ${p.name}?`) && onDeleteProduct(p.id)}
                                className="p-2.5 bg-red-50 text-red-300 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-50"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; animation-iteration-count: 2; }
      `}</style>
    </div>
  );
};

export default Inventory;
