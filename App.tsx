
import React, { useState, useEffect } from 'react';
import { Role, User, Product, Transaction, Store } from './types';
import { INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_TRANSACTIONS, INITIAL_STORES } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import WhatsAppHub from './components/WhatsAppHub';
import TransactionForm from './components/TransactionForm';
import TransactionsList from './components/TransactionsList';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import StoreManagement from './components/StoreManagement';
import { BackupManager } from './components/BackupManager';
import Login from './components/Login';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('wellcomputer_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState<{id: string, message: string}[]>([]);
  const [isAsisOpen, setIsAsisOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('wellcomputer_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('wellcomputer_session');
    }
  }, [currentUser]);

  const triggerNotification = (message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [{id, message}, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  const handleAddProduct = (p: Product) => setProducts([p, ...products]);
  const handleDeleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  const handleAddUser = (u: User) => {
    setUsers([...users, u]);
    triggerNotification(`${u.name} (${u.role}) berhasil diaktifkan.`);
  };
  
  const handleDeleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  const handleAddStore = (s: Store) => {
    setStores([...stores, s]);
    triggerNotification(`Cabang "${s.name}" telah didaftarkan.`);
  };

  const handleUpdateStore = (updatedStore: Store) => {
    setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
    triggerNotification(`Data toko "${updatedStore.name}" berhasil diperbarui.`);
  };

  const handleDeleteStore = (id: string) => {
    const storeName = stores.find(s => s.id === id)?.name;
    setStores(stores.filter(s => s.id !== id));
    triggerNotification(`Outlet "${storeName}" telah dihapus dari sistem.`);
  };

  const handleNewTransaction = (data: any) => {
    if (!currentUser) return;
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      customerId: `c${Date.now()}`,
      customerName: data.customerName,
      productId: data.productId,
      productCode: data.productCode,
      productName: data.productName,
      storeName: data.storeName,
      salesId: currentUser.id,
      salesName: currentUser.name,
      price: data.price,
      paymentMethod: data.paymentMethod,
      date: new Date().toISOString(),
      note: data.note
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setProducts(prev => prev.map(p => p.id === data.productId ? { ...p, stock: p.stock - 1 } : p));
    triggerNotification(`Invoice untuk ${data.customerName} berhasil dibuat.`);
    setActiveTab('transactions');
  };

  const handleRestoreData = (data: { products: Product[], transactions: Transaction[], users: User[], stores?: Store[] }) => {
    setProducts(data.products);
    setTransactions(data.transactions);
    setUsers(data.users);
    if (data.stores) setStores(data.stores);
    triggerNotification("Sistem Berhasil Dipulihkan: Database sinkron.");
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} availableUsers={users} />;
  }

  const visibleTransactions = currentUser.role === Role.SALES
    ? transactions.filter(t => t.salesId === currentUser.id)
    : transactions;

  const rolePermissions: Record<Role, string[]> = {
    [Role.SUPERADMIN]: ['dashboard', 'stores', 'products', 'transactions', 'users', 'whatsapp', 'reports', 'backup'],
    [Role.OWNER]: ['dashboard', 'stores', 'products', 'transactions', 'reports', 'backup'],
    [Role.ADMIN]: ['dashboard', 'stores', 'products', 'transactions', 'reports', 'users', 'backup'],
    [Role.SALES]: ['dashboard', 'transactions', 'whatsapp'],
  };

  const isAllowed = (tab: string) => rolePermissions[currentUser.role].includes(tab);

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onCallAsis={() => setIsAsisOpen(true)}
    >
      <div className="fixed top-24 right-8 z-[100] space-y-3 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in pointer-events-auto border border-white/10">
            <span className="text-xl">✨</span>
            <span className="text-sm font-bold">{n.message}</span>
          </div>
        ))}
      </div>

      {activeTab === 'dashboard' && isAllowed('dashboard') && (
        <Dashboard transactions={visibleTransactions} products={products} user={currentUser} />
      )}

      {activeTab === 'stores' && isAllowed('stores') && (
        <StoreManagement 
          stores={stores} 
          onAddStore={handleAddStore} 
          onUpdateStore={handleUpdateStore}
          onDeleteStore={handleDeleteStore} 
          currentUser={currentUser}
        />
      )}
      
      {activeTab === 'products' && isAllowed('products') && (
        <Inventory 
          products={products} 
          stores={stores}
          onUpdateStock={handleUpdateStock} 
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}
      
      {activeTab === 'whatsapp' && isAllowed('whatsapp') && (
        <div className="space-y-12">
          {currentUser.role === Role.SALES && (
            <TransactionForm 
              products={products} 
              stores={stores}
              onSubmit={handleNewTransaction} 
              currentUser={currentUser} 
            />
          )}
          <WhatsAppHub products={products} onNewTransaction={handleNewTransaction} />
        </div>
      )}
      
      {activeTab === 'transactions' && isAllowed('transactions') && (
        <TransactionsList transactions={visibleTransactions} />
      )}
      
      {activeTab === 'reports' && isAllowed('reports') && (
        <Reports transactions={visibleTransactions} products={products} />
      )}
      
      {activeTab === 'users' && isAllowed('users') && (
        <UserManagement 
          users={users} 
          onAddUser={handleAddUser} 
          onDeleteUser={handleDeleteUser} 
          currentUser={currentUser}
        />
      )}

      {activeTab === 'backup' && isAllowed('backup') && (
        <BackupManager 
          products={products} 
          transactions={transactions} 
          users={users} 
          stores={stores}
          currentUser={currentUser} 
          onRestore={handleRestoreData} 
        />
      )}

      {!isAllowed(activeTab) && (
        <div className="bg-white p-12 rounded-3xl border border-red-100 text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h2 className="text-2xl font-bold text-slate-800">Akses Dibatasi</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Role Anda ({currentUser.role}) tidak diizinkan mengakses modul <strong>{activeTab}</strong>.
          </p>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg"
          >
            Kembali ke Dashboard
          </button>
        </div>
      )}

      <AIAssistant 
        products={products} 
        transactions={transactions} 
        isOpen={isAsisOpen} 
        onClose={() => setIsAsisOpen(false)} 
      />

      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Layout>
  );
};

export default App;
