import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { MenuItem } from '../types';

/**
 * Hook to get real-time menu items
 * @param availableOnly - If true, only returns available items
 */
export function useMenu(availableOnly: boolean = true) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const menuRef = collection(db, 'menuItems');
    const q = availableOnly
      ? query(menuRef, where('available', '==', true))
      : menuRef;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MenuItem[];

        setMenuItems(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [availableOnly]);

  return { menuItems, loading, error };
}
