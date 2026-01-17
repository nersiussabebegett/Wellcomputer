
import React, { useState } from 'react';
import { Store, Role, User } from '../types';

interface StoreManagementProps {
  stores: Store[];
  onAddStore: (store: Store) => void;
  onUpdateStore: (store: Store) => void;
  onDeleteStore: (id: string) => void;
  currentUser: User;
}

const StoreManagement: React.FC<StoreManagementProps> = ({ stores, onAddStore, onUpdateStore, onDeleteStore, currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', phone: '', active: true });

  const resetForm = () => {
    setFormData({ name: '', address: '', phone: '', active: true });
    setEditingStore(null);
    setShowForm(false);
  };

  const handleEditClick = (store: Store) => {
    setEditingStore(store);
    setFormData({ 
      name: store.name, 
      address: store.address, 
      phone: store.phone, 
      active: store.active 
    });
    setShowForm(true);
    // Smooth scroll ke atas agar form terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStore) {
      onUpdateStore({
        ...editingStore,
        ...formData
      });
    } else {
      onAddStore({
        ...formData,
        id: `s${Date.now()}`
      });
    }
    resetForm();
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm text-sm placeholder:text-slate-300";

  // Sesuai permintaan: Superadmin, Owner, dan Admin bisa mengelola toko
  const canManage = [Role.SUPERADMIN, Role.OWNER, Role.ADMIN].includes(currentUser.role);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="text-2xl">🏬</span> Manajemen Cabang
          </h3>
          <p className="text-sm text-slate-500 font-medium">Monitoring dan konfigurasi seluruh outlet Well Computer.</p>
        </div>
        {canManage && (
          <button 
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 ${
              showForm ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-blue-600'
            }`}
          >
            {showForm ? 'Batal' : '+ Tambah Outlet'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-[2rem] border-2 border-blue-50 shadow-xl shadow-blue-500/5 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">
              {editingStore ? '📝' : '✨'}
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">
                {editingStore ? `Edit: ${editingStore.name}` : 'Registrasi Cabang Baru'}
              </h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Informasi Identitas Toko</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Outlet</label>
                <input 
                  required
                  className={inputClass}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Misal: Well Computer - Galaxy Mall"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telepon Bisnis</label>
                <input 
                  required
                  className={inputClass}
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="Misal: 031-5912345"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Lokasi Lengkap</label>
              <textarea 
                required
                className={`${inputClass} h-24 resize-none`}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Jl. Raya Kertajaya No. 123, Surabaya"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${formData.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <label htmlFor="active-toggle" className="text-sm font-bold text-slate-700">Status Operasional Aktif</label>
              </div>
              <input 
                type="checkbox" 
                id="active-toggle"
                checked={formData.active}
                onChange={e => setFormData({...formData, active: e.target.checked})}
                className="w-10 h-5 bg-slate-300 rounded-full appearance-none cursor-pointer checked:bg-blue-600 transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform checked:after:translate-x-5"
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-blue-500/10 transition-all active:scale-[0.98]">
              {editingStore ? 'Simpan Perubahan Data' : 'Daftarkan Cabang Sekarang'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map(store => (
          <div key={store.id} className={`bg-white p-6 rounded-[2rem] border transition-all relative group overflow-hidden ${store.active ? 'border-slate-200 shadow-sm' : 'border-red-100 bg-red-50/20 grayscale'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 duration-300 ${store.active ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                🏬
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${store.active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {store.active ? 'Beroperasi' : 'Tutup'}
              </span>
            </div>
            
            <h4 className="text-lg font-black text-slate-800 truncate mb-1">{store.name}</h4>
            <div className="flex items-start gap-2 text-slate-400 mb-6">
              <span className="text-xs">📍</span>
              <p className="text-xs font-medium line-clamp-2 h-8 leading-relaxed italic">{store.address}</p>
            </div>
            
            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Kontak Outlet</span>
                <span className="text-xs font-bold text-slate-700">{store.phone}</span>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditClick(store)}
                  className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"
                  title="Edit Data Toko"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                {canManage && (
                  <button 
                    onClick={() => {
                      if (confirm(`Peringatan: Hapus data permanen untuk "${store.name}"?`)) {
                        onDeleteStore(store.id);
                      }
                    }}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
                    title="Hapus Toko"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {stores.length === 0 && (
          <div className="col-span-full py-24 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-50">🏢</div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Database Toko Kosong</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Klik tombol tambah di atas untuk mendaftarkan outlet pertama Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManagement;
