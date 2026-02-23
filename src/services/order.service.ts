import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Order, OrderItem, CartItem, OrderStatus, TicketItemStatus } from '../types';
import { generateUniquePickupCode } from './pickupCode.service';

// Tax rate from environment
const TAX_RATE = Number(import.meta.env.VITE_TAX_RATE) || 0.08;

/**
 * Create a new order from cart items
 * @returns The created order with pickup code
 */
export async function createOrder(
  customerId: string,
  customerEmail: string,
  cartItems: CartItem[],
  customerName?: string
): Promise<Order> {
  try {
    // Generate unique pickup code
    const pickupCode = await generateUniquePickupCode();
    console.log(`Generated pickup code: ${pickupCode}`); // Debug log
    // Convert cart items to order items
    const orderItems: OrderItem[] = cartItems.map((cartItem) => {
      const customizationsPrice =
        cartItem.customizations?.reduce((sum, custom) => sum + custom.price, 0) || 0;
      const itemTotal =
        (cartItem.menuItem.basePrice + customizationsPrice) * cartItem.quantity;

      return {
        menuItemId: cartItem.menuItem.id,
        menuItemName: cartItem.menuItem.name,
        quantity: cartItem.quantity,
        basePrice: cartItem.menuItem.basePrice,
        customizations: cartItem.customizations ?? [],
        itemTotal,
      };
    });

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.itemTotal, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // Create order document
    const orderData = {
      pickupCode,
      customerId,
      customerEmail,
      ...(customerName ? { customerName } : {}),
      status: 'pending' as OrderStatus,
      items: orderItems,
      subtotal,
      tax,
      total,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    console.log('Creating order with data:', orderData); // Debug log 
    const ordersRef = collection(db, 'orders');
    console.log('Orders collection reference:', ordersRef); // Debug log
    const docRef = await addDoc(ordersRef, orderData);

    // Return the created order with the generated ID
    return {
      id: docRef.id,
      ...orderData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    } as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Get orders for a specific customer
 */
export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('customerId', '==', customerId)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error('Error getting customer orders:', error);
    throw error;
  }
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
}

/**
 * Update order status (staff only)
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  try {
    const docRef = doc(db, 'orders', orderId);
    const updates: any = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (status === 'ready') {
      updates.readyAt = serverTimestamp();
    } else if (status === 'completed') {
      updates.completedAt = serverTimestamp();
    }

    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

/**
 * Update the status of a single item inside an order (kitchen use)
 */
export async function updateOrderItemStatus(
  orderId: string,
  itemIndex: number,
  status: TicketItemStatus
): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists()) throw new Error('Order not found');

    const order = orderDoc.data() as Order;
    const updatedItems = [...order.items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], status };

    await updateDoc(orderRef, {
      items: updatedItems,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating order item status:', error);
    throw error;
  }
}

/**
 * Subscribe to all active orders for kitchen (pending, preparing, ready)
 */
export function subscribeToActiveOrders(
  callback: (orders: Order[]) => void
): () => void {
  const q = query(
    collection(db, 'orders'),
    where('status', 'in', ['pending', 'preparing', 'ready'])
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() } as Order))
        .sort((a, b) => {
          const aSeconds = (a.createdAt as Timestamp)?.seconds ?? 0;
          const bSeconds = (b.createdAt as Timestamp)?.seconds ?? 0;
          return aSeconds - bSeconds;
        });
      callback(orders);
    },
    (error) => {
      console.error('Error subscribing to active orders:', error);
      callback([]);
    }
  );
}

/**
 * Get all orders (staff only)
 */
export async function getAllOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const snapshot = await getDocs(ordersRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
}
