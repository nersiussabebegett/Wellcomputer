
import React, { useState } from 'react';
import { Transaction } from '../types';

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(t => 
    t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.productCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.salesName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">History Penjualan</h3>
          <p className="text-sm text-slate-500">Daftar transaksi berdasarkan nama Sales dan Produk.</p>
        </div>
        <div className="w-full md:w-64">
          <input 
            type="text" 
            placeholder="Cari sales, produk, branch..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Invoice</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Product & Code</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Branch</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nama Sales</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-blue-600 font-medium">
                  #{t.id.slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">{t.productName}</span>
                    <span className="text-[10px] font-mono text-slate-400 tracking-tighter uppercase font-bold">{t.productCode || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">🏬</span>
                    <span className="text-xs font-bold text-slate-600">{t.storeName || 'Pusat'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-700">{t.salesName}</span>
                  <p className="text-[10px] text-slate-400 italic">{t.customerName}</p>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">
                  Rp {t.price.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400 italic">
            No transactions found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
