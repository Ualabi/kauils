import { customAlphabet } from 'nanoid';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

// Custom alphabet excluding ambiguous characters (0, O, I, l, 1)
const generateCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

/**
 * Generate a unique pickup code for orders
 * Checks Firestore to ensure uniqueness
 * @returns A 6-character unique pickup code (e.g., "A3X7K2")
 */
export async function generateUniquePickupCode(): Promise<string> {
  const maxAttempts = 5;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const code = generateCode();

    // Check if code exists in orders collection
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('pickupCode', '==', code));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return code;
    }

    attempts++;
  }

  // Fallback: if all attempts fail, use timestamp + random
  const timestamp = Date.now().toString(36).slice(-3).toUpperCase();
  const random = generateCode().slice(0, 3);
  return `${timestamp}${random}`;
}
