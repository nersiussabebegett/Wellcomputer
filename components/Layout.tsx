
import React, { useState, useEffect } from 'react';
import { Role, User } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCallAsis: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab, onCallAsis }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on tab change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [activeTab]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: [Role.SUPERADMIN, Role.OWNER, Role.ADMIN, Role.SALES] },
    { id: 'stores', label: 'Stores', icon: '🏬', roles: [Role.SUPERADMIN, Role.OWNER, Role.ADMIN] },
    { id: 'products', label: 'Inventory', icon: '💻', roles: [Role.SUPERADMIN, Role.OWNER, Role.ADMIN] },
    { id: 'transactions', label: 'Transactions', icon: '🧾', roles: [Role.SUPERADMIN, Role.OWNER, Role.ADMIN, Role.SALES] },
    { id: 'users', label: 'User Hub', icon: '👥', roles: [Role.SUPERADMIN, Role.ADMIN] },
    { id: 'whatsapp', label: 'WA Control', icon: '📱', roles: [Role.SUPERADMIN, Role.SALES] },
    { id: 'reports', label: 'Analytics', icon: '📈', roles: [Role.SUPERADMIN, Role.OWNER, Role.ADMIN] },
    { id: 'backup', label: 'Data Backup', icon: '💾', roles: [Role.SUPERADMIN, Role.OWNER, Role.ADMIN] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));
  const assistantLabel = 'Asisten';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold shrink-0">
            W
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <span className="font-bold text-white tracking-tight truncate">WELL COMPUTER</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {filteredMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={isCollapsed && !isMobileOpen ? item.label : ''}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              activeTab === item.id 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-800">
          <button
            onClick={onCallAsis}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors group`}
            title={isCollapsed && !isMobileOpen ? assistantLabel : ''}
          >
            <span className="text-lg shrink-0">🤖</span>
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-sm font-medium">{assistantLabel}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className={`flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0 uppercase">
            {user.name.charAt(0)}
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{user.role}</p>
            </div>
          )}
        </div>
        <button 
          onClick={onLogout}
          className={`w-full mt-4 flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-400 transition-colors ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}
        >
          <span className="text-sm">🚪</span>
          {(!isCollapsed || isMobileOpen) && <span>LOGOUT</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside 
        className={`hidden lg:flex flex-col transition-all duration-300 border-r border-slate-200 shadow-sm
          ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <div 
            className="w-64 h-full animate-slide-right"
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-40">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              <span className="text-xl">☰</span>
            </button>
            
            {/* Desktop Collapse Toggle */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <span className="text-lg">{isCollapsed ? '→' : '←'}</span>
            </button>

            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-slate-800 leading-tight">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                System / {activeTab}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end pr-4 border-r border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Current Date</span>
              <span className="text-xs font-bold text-slate-700">
                {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button 
              onClick={onCallAsis}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 px-3"
            >
              <span className="text-lg">🤖</span>
              <span className="hidden md:inline text-xs font-bold">{assistantLabel}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto bg-slate-100/50 p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(0,0,0,0.05); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: rgba(59,130,246,0.2); 
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        
        .animate-slide-right {
          animation: slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Layout;
