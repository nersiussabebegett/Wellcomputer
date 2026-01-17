
import React, { useState } from 'react';
import { Role, User, Product, Transaction, Store } from '../types';

interface BackupManagerProps {
  products: Product[];
  transactions: Transaction[];
  users: User[];
  stores: Store[];
  currentUser: User;
  onRestore: (data: { products: Product[], transactions: Transaction[], users: User[], stores: Store[] }) => void;
}

export const BackupManager: React.FC<BackupManagerProps> = ({ products, transactions, users, stores, currentUser, onRestore }) => {
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  const handleExport = () => {
    const backupData = {
      version: '1.2',
      timestamp: new Date().toISOString(),
      exportedBy: currentUser.name,
      data: {
        products,
        transactions,
        users,
        stores
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WellComputer_Database_Snapshot_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportSuccess('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        if (!json.data || !json.data.products || !json.data.transactions || !json.data.users) {
          throw new Error('Format file backup tidak valid atau rusak.');
        }

        if (confirm('PERINGATAN KRITIKAL: Mengimpor data akan menggantikan SELURUH database saat ini. Lanjutkan?')) {
          onRestore({
            ...json.data,
            stores: json.data.stores || []
          });
          setImportSuccess('Seluruh database berhasil disinkronisasi ulang!');
        }
      } catch (err) {
        setImportError('Gagal memulihkan data. Pastikan file JSON dalam kondisi baik.');
      }
    };
    reader.readAsText(file);
  };

  const canRestore = currentUser.role === Role.SUPERADMIN;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24"></div>
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-3xl">💾</span>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">System Reliability Hub</h3>
          </div>
          <p className="text-sm text-slate-500 font-medium ml-12">Lakukan pencadangan rutin untuk menjamin keberlangsungan operasional toko.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="group p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">📥</div>
              <h4 className="font-black text-slate-800 text-lg">Ekspor Full Database</h4>
              <p className="text-xs text-slate-400 mt-2 mb-8 font-medium leading-relaxed">
                Snapshot lengkap: Produk, Riwayat Transaksi, Data Staff, dan Konfigurasi Cabang.
              </p>
              <button 
                onClick={handleExport}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-xs"
              >
                Unduh Snaphot (.json)
              </button>
            </div>

            <div className={`group p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center transition-all duration-300 ${!canRestore ? 'opacity-50 grayscale' : 'hover:border-emerald-300 hover:bg-emerald-50/30'}`}>
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">📤</div>
              <h4 className="font-black text-slate-800 text-lg">Restore Point</h4>
              <p className="text-xs text-slate-400 mt-2 mb-8 font-medium leading-relaxed">
                Pulihkan sistem ke kondisi sebelumnya menggunakan file pencadangan yang sah.
              </p>
              
              {canRestore ? (
                <label className="w-full">
                  <span className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-emerald-200 cursor-pointer uppercase tracking-widest text-xs">
                    Unggah File Backup
                  </span>
                  <input 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    onChange={handleImport}
                  />
                </label>
              ) : (
                <div className="w-full bg-slate-200 text-slate-500 font-black py-4 rounded-xl cursor-not-allowed text-[10px] uppercase tracking-widest">
                  Hanya Superadmin
                </div>
              )}
            </div>
          </div>

          {(importError || importSuccess) && (
            <div className={`mt-10 p-5 rounded-2xl text-sm font-bold flex items-center gap-4 animate-fade-in border ${importError ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
              <span className="text-xl">{importError ? '🚨' : '🎉'}</span>
              {importError || importSuccess}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-10"></div>
        <div className="relative">
          <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Protokol Keamanan Data
          </h4>
          <ul className="text-xs text-slate-400 space-y-4 font-medium">
            <li className="flex gap-4">
              <span className="text-blue-500 font-bold">01</span>
              File backup mengandung data finansial sensitif. Simpan di media penyimpanan terenkripsi atau offline.
            </li>
            <li className="flex gap-4">
              <span className="text-blue-500 font-bold">02</span>
              Melakukan "Restore" akan menghapus aktivitas yang terjadi SETELAH file backup tersebut dibuat.
            </li>
            <li className="flex gap-4">
              <span className="text-blue-500 font-bold">03</span>
              Well Computer menyarankan backup data dilakukan setiap penutupan buku harian (Daily Closure).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
