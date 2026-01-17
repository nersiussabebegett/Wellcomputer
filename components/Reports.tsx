
import React from 'react';
import { Transaction, Product } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';

interface ReportsProps {
  transactions: Transaction[];
  products: Product[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, products }) => {
  // 1. Daily Revenue Trend
  const revenueTrendData = [...transactions].reverse().map(t => ({
    date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: t.price
  }));

  // 2. Units Sold by Product (Top Selling)
  const productSalesCount = transactions.reduce((acc: any, curr) => {
    acc[curr.productName] = (acc[curr.productName] || 0) + 1;
    return acc;
  }, {});

  const bestSellerData = Object.keys(productSalesCount).map(name => ({
    name,
    units: productSalesCount[name]
  })).sort((a, b) => b.units - a.units);

  // 3. Performance by Sales Agent
  const salesPerformance = transactions.reduce((acc: any, curr) => {
    acc[curr.salesName] = (acc[curr.salesName] || 0) + curr.price;
    return acc;
  }, {});
  const performanceData = Object.keys(salesPerformance).map(name => ({
    name,
    total: salesPerformance[name]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Export to Excel (CSV format)
  const exportToExcel = () => {
    const headers = ['Invoice ID', 'Date', 'Customer', 'Product', 'Sales Rep', 'Method', 'Amount'];
    const rows = transactions.map(t => [
      t.id,
      new Date(t.date).toLocaleDateString(),
      t.customerName,
      t.productName,
      t.salesName,
      t.paymentMethod,
      t.price
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `WellComputer_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF (Simulated via Print)
  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 print:p-0">
      {/* Report Header - Hidden on Print */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Automated Sales Analytics</h3>
          <p className="text-sm text-slate-500 italic">Generated instantly from synchronized transaction records.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <span>📊</span> Export CSV (Excel)
          </button>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <span>📄</span> Export PDF / Print
          </button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8 text-center border-b pb-4">
        <h1 className="text-3xl font-bold">Well Computer Sales Report</h1>
        <p className="text-slate-500">Generated on: {new Date().toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TOP SELLING CHART - NEW */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Produk Paling Laris (Units Sold)</h4>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestSellerData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={150} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="units" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30}>
                  {bestSellerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Growth Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Revenue Growth Trend</h4>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Rep Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Performance Leaderboard</h4>
          <div className="space-y-6">
            {performanceData.sort((a,b) => b.total - a.total).map((agent, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">{agent.name}</span>
                  <span className="text-slate-500">Rp {agent.total.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full" 
                    style={{ width: `${(agent.total / Math.max(...performanceData.map(p => p.total))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Summary Stats */}
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Net Gross Sales</h4>
              <p className="text-4xl font-extrabold tracking-tight">
                Rp {transactions.reduce((acc, t) => acc + t.price, 0).toLocaleString()}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-slate-500 text-[10px] font-bold uppercase">Total Units</p>
                <p className="text-xl font-bold">{transactions.length} Units</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-slate-500 text-[10px] font-bold uppercase">Inventory Valuation</p>
                <p className="text-xl font-bold">Rp {products.reduce((acc, p) => acc + (p.buyPrice * p.stock), 0).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-slate-500 text-[10px] font-bold uppercase">Est. Margin</p>
                <p className="text-xl font-bold text-emerald-400">Rp {(transactions.reduce((acc, t) => {
                  const p = products.find(prod => prod.id === t.productId);
                  return acc + (t.price - (p?.buyPrice || 0));
                }, 0)).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-slate-500 text-[10px] font-bold uppercase">Stock Levels</p>
                <p className="text-xl font-bold">{products.reduce((acc, p) => acc + p.stock, 0)} Total</p>
              </div>
            </div>
          </div>
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
        </div>
      </div>

      {/* Detail Transaction Table for PDF/Print view */}
      <div className="hidden print:block mt-8">
        <h4 className="text-lg font-bold mb-4">Detailed Transaction History</h4>
        <table className="w-full text-sm border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Customer</th>
              <th className="border p-2 text-left">Product</th>
              <th className="border p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td className="border p-2">{new Date(t.date).toLocaleDateString()}</td>
                <td className="border p-2">{t.customerName}</td>
                <td className="border p-2">{t.productName}</td>
                <td className="border p-2 text-right">Rp {t.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
