
import React, { useState } from 'react';
import { parseWhatsAppMessage } from '../services/geminiService';
import { Product } from '../types';

interface WhatsAppHubProps {
  products: Product[];
  onNewTransaction: (data: any) => void;
}

const WhatsAppHub: React.FC<WhatsAppHubProps> = ({ products, onNewTransaction }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [logs, setLogs] = useState<{ id: number; message: string; status: 'pending' | 'success' | 'error'; reply?: string }[]>([]);

  const productNames = products.map(p => p.name);

  const handleSimulate = async () => {
    if (!inputMessage.trim()) return;

    const newLogId = Date.now();
    setLogs(prev => [{ id: newLogId, message: inputMessage, status: 'pending' }, ...prev]);
    setIsParsing(true);

    const result = await parseWhatsAppMessage(inputMessage, productNames);

    if (result.success && result.productName) {
      const matchedProduct = products.find(p => p.name.includes(result.productName) || result.productName.includes(p.name));
      
      if (matchedProduct) {
        if (matchedProduct.stock > 0) {
          onNewTransaction({
            customerName: result.customerName,
            productId: matchedProduct.id,
            productName: matchedProduct.name,
            price: result.price || matchedProduct.sellPrice,
            paymentMethod: result.paymentMethod || 'TRANSFER'
          });
          
          setLogs(prev => prev.map(log => log.id === newLogId ? {
            ...log,
            status: 'success',
            reply: `✅ Transaksi berhasil dicatat!\nProduk: ${matchedProduct.name}\nHarga: Rp ${result.price?.toLocaleString() || matchedProduct.sellPrice.toLocaleString()}\nStatus: Lunas via ${result.paymentMethod}`
          } : log));
        } else {
          setLogs(prev => prev.map(log => log.id === newLogId ? {
            ...log,
            status: 'error',
            reply: `❌ Gagal: Stok untuk ${matchedProduct.name} habis.`
          } : log));
        }
      } else {
        setLogs(prev => prev.map(log => log.id === newLogId ? {
          ...log,
          status: 'error',
          reply: `❌ Gagal: Produk tidak ditemukan di katalog.`
        } : log));
      }
    } else {
      setLogs(prev => prev.map(log => log.id === newLogId ? {
        ...log,
        status: 'error',
        reply: `❌ Format tidak dikenali. Gunakan format:\nPENJUALAN\nNama: [Nama]\nProduk: [Produk]\nHarga: [Harga]`
      } : log));
    }

    setInputMessage('');
    setIsParsing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-2">WhatsApp Simulation Hub</h3>
        <p className="text-sm text-slate-500 mb-6">Type a transaction message like a sales agent would send via WhatsApp.</p>
        
        <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4 font-mono text-sm overflow-y-auto min-h-[300px]">
          <div className="mb-4">
            <p className="text-xs text-slate-400 mb-2">// Suggested Format Example:</p>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-600">
              PENJUALAN<br/>
              Nama: Andi Wijaya<br/>
              Produk: ROG Zephyrus G14<br/>
              Harga: 25000000<br/>
              Metode: Transfer
            </div>
          </div>
          
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isParsing}
            placeholder="Type WhatsApp message here..."
            className="w-full bg-white border border-slate-200 rounded-lg p-3 h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
          />
        </div>

        <button
          onClick={handleSimulate}
          disabled={isParsing || !inputMessage.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isParsing ? '🔄 Parsing via AI...' : '💬 Send Message'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Live Logs & Auto-Replies</h3>
        <div className="flex-1 overflow-y-auto space-y-4 max-h-[500px] pr-2">
          {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
              <p>No activity yet.</p>
            </div>
          )}
          {logs.map(log => (
            <div key={log.id} className="space-y-2">
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-700 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm shadow-sm">
                  {log.message.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                </div>
              </div>
              {log.status === 'pending' ? (
                <div className="flex justify-end italic text-xs text-slate-400">Processing...</div>
              ) : (
                <div className="flex justify-end">
                  <div className={`p-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm shadow-sm ${log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {log.reply?.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppHub;
