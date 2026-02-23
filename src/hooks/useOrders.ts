import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Order } from '../types';
import { subscribeToActiveOrders } from '../services/order.service';

/**
 * Hook to get real-time orders for a customer
 * @param customerId - The customer's user ID
 */
export function useCustomerOrders(customerId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const ordersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        setOrders(ordersList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [customerId]);

  return { orders, loading, error };
}

/**
 * Hook to subscribe to all active orders for kitchen (real-time)
 */
export function useActiveOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToActiveOrders((updatedOrders) => {
      setOrders(updatedOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { orders, loading };
}
