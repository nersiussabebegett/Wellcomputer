
import React from 'react';
import { Transaction, Product, Role, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  products: Product[];
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, products, user }) => {
  const totalOmzet = transactions.reduce((acc, curr) => acc + curr.price, 0);
  const totalUnits = transactions.length;
  const lowStockCount = products.filter(p => p.stock < 5).length;
  
  // Sales by Revenue for Chart
  // Fixed: Added explicit Record type for accumulator to avoid 'any' or 'unknown' issues in arithmetic
  const salesByProduct = transactions.reduce((acc: Record<string, number>, curr) => {
    acc[curr.productName] = (acc[curr.productName] || 0) + curr.price;
    return acc;
  }, {} as Record<string, number>);

  // Fixed: Cast value to number to satisfy TypeScript arithmetic operation requirements
  const chartData = Object.keys(salesByProduct).map(name => ({
    name,
    value: salesByProduct[name] as number
  })).sort((a, b) => b.value - a.value);

  // Leaderboard Calculation: Units Sold per Sales Representative
  // Fixed: Added explicit Record type for accumulator
  const unitsPerSales = transactions.reduce((acc: Record<string, number>, curr) => {
    acc[curr.salesName] = (acc[curr.salesName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Fixed: Explicitly cast units to number to resolve sort arithmetic errors
  const leaderboardData = Object.entries(unitsPerSales)
    .map(([name, units]) => ({ name, units: units as number }))
    .sort((a, b) => b.units - a.units);

  const maxUnits = leaderboardData.length > 0 ? leaderboardData[0].units : 1;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const canSeeLeaderboard = [Role.OWNER, Role.SUPERADMIN, Role.ADMIN].includes(user.role);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Total Omzet</p>
          <p className="text-2xl font-black text-slate-900 mt-2">Rp {totalOmzet.toLocaleString()}</p>
          <div className="mt-4 flex items-center text-emerald-600 text-[10px] font-black uppercase">
            <span>↑ 12% Performa</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Units Sold</p>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalUnits} Laptops</p>
          <div className="mt-4 flex items-center text-blue-600 text-[10px] font-black uppercase">
            <span>Volume Stabil</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-red-500">Low Stock Alert</p>
          <p className="text-2xl font-black text-red-600 mt-2">{lowStockCount} Models</p>
          <div className="mt-4 flex items-center text-red-600 text-[10px] font-black uppercase">
            <span>Butuh Restock</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Profit Margin</p>
          <p className="text-2xl font-black text-slate-900 mt-2">~14.5%</p>
          <div className="mt-4 flex items-center text-emerald-600 text-[10px] font-black uppercase">
            <span>Efisiensi Tinggi</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales by Model Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Revenue by Model</h3>
              <p className="text-xs text-slate-400 font-medium">Distribusi pendapatan per laptop</p>
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={140} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard Sales (Role: OWNER/ADMIN specific) */}
        {canSeeLeaderboard ? (
          <div className="bg-slate-950 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
            <div className="mb-8">
              <h3 className="text-lg font-black tracking-tight">Sales Leaderboard</h3>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Units Sold Volume</p>
            </div>

            <div className="flex-1 space-y-6">
              {leaderboardData.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">Belum ada data penjualan.</div>
              ) : (
                leaderboardData.slice(0, 5).map((agent, idx) => (
                  <div key={agent.name} className="space-y-2 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border ${
                          idx === 0 ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' :
                          idx === 1 ? 'bg-slate-400/20 border-slate-400/50 text-slate-300' :
                          idx === 2 ? 'bg-orange-700/20 border-orange-700/50 text-orange-500' :
                          'bg-white/5 border-white/10 text-slate-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-sm font-bold truncate max-w-[120px]">{agent.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-blue-400">{agent.units}</span>
                        <span className="text-[10px] text-slate-500 ml-1">Units</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          idx === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/20'
                        }`}
                        style={{ width: `${(agent.units / maxUnits) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Lihat Semua Ranking
              </button>
            </div>
          </div>
        ) : (
          /* Recent Sales Placeholder for Sales Role */
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-black text-slate-800 mb-6 tracking-tight">Recent Sales</h3>
            <div className="flex-1 space-y-4">
              {transactions.slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-bold text-slate-800 truncate">{t.productName}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-black text-blue-600">Rp {t.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Table */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <h3 className="text-lg font-black text-slate-800 mb-6 tracking-tight">Log Transaksi Terakhir</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produk</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nama Sales</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.slice(0, 5).map(t => (
                <tr key={t.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-4">
                    <p className="text-sm font-bold text-slate-800">{t.productName}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">REF: #{t.id.slice(-6).toUpperCase()}</p>
                  </td>
                  <td className="py-4 text-center">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors italic">
                      {t.salesName}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-sm font-black text-slate-900">Rp {t.price.toLocaleString()}</p>
                    <div className="flex justify-end gap-1 mt-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                      <span className="text-[9px] text-emerald-600 font-black uppercase tracking-tighter">Success</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
