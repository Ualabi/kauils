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
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { MenuItem } from '../types';

/**
 * Get all available menu items
 */
export async function getAvailableMenuItems(): Promise<MenuItem[]> {
  try {
    const menuRef = collection(db, 'menuItems');
    const q = query(menuRef, where('available', '==', true));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];
  } catch (error) {
    console.error('Error getting available menu items:', error);
    throw error;
  }
}

/**
 * Get all menu items (including unavailable)
 */
export async function getAllMenuItems(): Promise<MenuItem[]> {
  try {
    const menuRef = collection(db, 'menuItems');
    const snapshot = await getDocs(menuRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];
  } catch (error) {
    console.error('Error getting all menu items:', error);
    throw error;
  }
}

/**
 * Get menu items by category
 */
export async function getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
  try {
    const menuRef = collection(db, 'menuItems');
    const q = query(
      menuRef,
      where('category', '==', category),
      where('available', '==', true)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];
  } catch (error) {
    console.error('Error getting menu items by category:', error);
    throw error;
  }
}

/**
 * Get a single menu item by ID
 */
export async function getMenuItem(id: string): Promise<MenuItem | null> {
  try {
    const docRef = doc(db, 'menuItems', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as MenuItem;
    }
    return null;
  } catch (error) {
    console.error('Error getting menu item:', error);
    throw error;
  }
}

/**
 * Create a new menu item (staff only)
 */
export async function createMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<string> {
  try {
    const menuRef = collection(db, 'menuItems');
    const docRef = await addDoc(menuRef, {
      ...menuItem,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
}

/**
 * Update a menu item (staff only)
 */
export async function updateMenuItem(
  id: string,
  updates: Partial<MenuItem>
): Promise<void> {
  try {
    const docRef = doc(db, 'menuItems', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
}
