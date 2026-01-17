
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Product, Transaction } from '../types';

interface AIAssistantProps {
  products: Product[];
  transactions: Transaction[];
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ products, transactions, isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'asis'; text: string }[]>([
    { role: 'asis', text: 'Halo! Saya Asisten AI Well Computer. Ada yang bisa saya bantu dengan data penjualan atau inventaris hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Anda adalah "Asisten", asisten pintar untuk aplikasi manajemen penjualan laptop "Well Computer".
        
        DATA TOKO SAAT INI:
        - Produk: ${JSON.stringify(products.map(p => ({ name: p.name, stock: p.stock, price: p.sellPrice })))}
        - Transaksi Terakhir: ${JSON.stringify(transactions.slice(0, 10).map(t => ({ sales: t.salesName, product: t.productName, price: t.price })))}
        
        TUGAS ANDA:
        1. Jawab pertanyaan pengguna berdasarkan data di atas secara singkat dan profesional.
        2. Gunakan Bahasa Indonesia yang ramah.
        3. Jika ditanya tentang stok, sebutkan angka pastinya.
        4. Jika ditanya tentang performa, sebutkan siapa sales paling aktif.
        
        PERTANYAAN PENGGUNA: "${userMessage}"
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setMessages(prev => [...prev, { role: 'asis', text: response.text || "Maaf, saya sedang mengalami kendala teknis." }]);
    } catch (error) {
      console.error("Asis Error:", error);
      setMessages(prev => [...prev, { role: 'asis', text: "Maaf, koneksi ke otak AI saya terputus." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-end p-6 pointer-events-none">
      <div className="w-full max-w-md h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col pointer-events-auto animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg">🤖</div>
            <div>
              <h3 className="font-bold">Asisten</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">AI Powered Store Expert</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
          <input 
            type="text" 
            placeholder="Tanya Asisten (misal: Sisa stok Asus?)" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all shadow-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="bg-slate-900 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            🚀
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AIAssistant;
