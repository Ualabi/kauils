import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Order, OrderItem, CartItem, OrderStatus } from '../types';
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
  cartItems: CartItem[]
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
        customizations: cartItem.customizations,
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
