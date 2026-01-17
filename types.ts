
export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  SALES = 'SALES'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  phone: string;
  email: string;
  password?: string;
  active: boolean;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  active: boolean;
}

export interface Product {
  id: string;
  code: string;
  brand: string;
  name: string;
  specs: string;
  color: string;
  storeId: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  active: boolean;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productCode: string;
  productName: string;
  storeName: string;
  salesId: string;
  salesName: string;
  price: number;
  paymentMethod: 'CASH' | 'TRANSFER' | 'CREDIT';
  date: string;
  note?: string;
}

export interface AppState {
  users: User[];
  products: Product[];
  transactions: Transaction[];
  currentUser: User | null;
  stores: Store[];
}
