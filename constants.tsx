
import { Role, User, Product, Transaction, Store } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Zaki Superadmin', role: Role.SUPERADMIN, phone: '08123456789', email: 'superadmin@wellcomputer.com', password: 'password123', active: true },
  { id: 'u2', name: 'Budi Owner', role: Role.OWNER, phone: '08123456788', email: 'owner@wellcomputer.com', password: 'password123', active: true },
  { id: 'u3', name: 'Siti Admin', role: Role.ADMIN, phone: '08123456787', email: 'admin@wellcomputer.com', password: 'password123', active: true },
  { id: 'u4', name: 'Andi Sales', role: Role.SALES, phone: '08123456786', email: 'sales@wellcomputer.com', password: 'password123', active: true },
];

export const INITIAL_STORES: Store[] = [
  { id: 's1', name: 'Well Computer - Pusat', address: 'Jl. Utama No. 123, Jakarta', phone: '021-5551234', active: true },
  { id: 's2', name: 'Well Computer - Bandung', address: 'Jl. Merdeka No. 45, Bandung', phone: '022-4445678', active: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', code: 'AS-ROG-G14-01', brand: 'ASUS', name: 'ASUS ROG Zephyrus G14', specs: 'Ryzen 9, 32GB RAM, 1TB SSD, RTX 4070', color: 'Eclipse Gray', storeId: 's1', buyPrice: 22000000, sellPrice: 25000000, stock: 5, active: true },
  { id: 'p2', code: 'AP-MBA-M2-02', brand: 'APPLE', name: 'MacBook Air M2', specs: '8GB RAM, 256GB SSD', color: 'Midnight', storeId: 's1', buyPrice: 15000000, sellPrice: 17500000, stock: 12, active: true },
  { id: 'p3', code: 'LN-LEG-5I-03', brand: 'LENOVO', name: 'Lenovo Legion 5i', specs: 'i7-13700H, 16GB RAM, RTX 4060', color: 'Storm Grey', storeId: 's2', buyPrice: 18000000, sellPrice: 21000000, stock: 3, active: true },
  { id: 'p4', code: 'HP-VIC-16-04', brand: 'HP', name: 'HP Victus 16', specs: 'Ryzen 7, 16GB RAM, RTX 4050', color: 'Performance Blue', storeId: 's2', buyPrice: 12500000, sellPrice: 14000000, stock: 8, active: true },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    customerId: 'c1',
    customerName: 'Budi Santoso',
    productId: 'p1',
    productCode: 'AS-ROG-G14-01',
    productName: 'ASUS ROG Zephyrus G14',
    storeName: 'Well Computer - Pusat',
    salesId: 'u4',
    salesName: 'Andi Sales',
    price: 25000000,
    paymentMethod: 'TRANSFER',
    date: new Date(Date.now() - 86400000).toISOString(),
    note: 'Lunas via BCA'
  },
  {
    id: 't2',
    customerId: 'c2',
    customerName: 'Ani Wijaya',
    productId: 'p2',
    productCode: 'AP-MBA-M2-02',
    productName: 'MacBook Air M2',
    storeName: 'Well Computer - Pusat',
    salesId: 'u4',
    salesName: 'Andi Sales',
    price: 17500000,
    paymentMethod: 'CASH',
    date: new Date(Date.now() - 172800000).toISOString(),
    note: 'Ambil di toko'
  }
];
