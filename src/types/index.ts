import { Timestamp } from 'firebase/firestore';

// User roles
export type UserRole = 'customer' | 'staff';

// User interface
export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  createdAt: Timestamp;
  // Staff-specific fields
  employeeId?: string;
  assignedTables?: number[];
}

// Menu item category
export type MenuCategory = 'burger' | 'side' | 'drink';

// Customization option
export interface Customization {
  name: string;
  price: number;
}

// Menu item interface
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: MenuCategory;
  imageUrl?: string;
  available: boolean;
  ingredients?: string[];
  customizations?: Customization[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Order status
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

// Order item
export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  basePrice: number;
  customizations?: Customization[];
  itemTotal: number;
}

// Order interface (Customer pickup orders)
export interface Order {
  id: string;
  pickupCode: string;
  customerId: string;
  customerEmail: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  readyAt?: Timestamp;
  completedAt?: Timestamp;
}

// Table status
export type TableStatus = 'available' | 'occupied' | 'reserved';

// Table interface
export interface Table {
  tableNumber: number;
  status: TableStatus;
  currentTicketId?: string;
  assignedStaffId?: string;
  lastUpdated: Timestamp;
}

// Ticket status
export type TicketStatus = 'open' | 'closed';

// Ticket item (similar to order item but with staff tracking)
export interface TicketItem {
  menuItemId: string;
  menuItemName?: string;
  name: string;
  price: number;
  quantity: number;
  basePrice?: number;
  customizations?: Customization[];
  itemTotal?: number;
  addedAt?: Timestamp;
  addedBy?: string; // Staff UID
}

// Ticket interface (Staff table orders)
export interface Ticket {
  id: string;
  tableNumber: number;
  staffId: string;
  staffName: string;
  status: TicketStatus;
  items: TicketItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  closedAt?: Timestamp;
}

// Cart item (client-side only, not stored in Firestore)
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customizations?: Customization[];
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Cart context type
export interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity: number, customizations?: Customization[]) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartTax: () => number;
  getItemCount: () => number;
}
