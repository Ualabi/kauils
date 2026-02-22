import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User, UserRole } from '../types';

/**
 * Sign up a new customer with email and password
 * Creates a user document in Firestore with role: 'customer'
 */
export async function signup(
  email: string,
  phone: string,
  password: string,
  displayName: string
): Promise<void> {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      phone,
      role: 'customer',
      displayName,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

/**
 * Log in with email and password
 */
export async function login(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

/**
 * Get user role from Firestore
 * Returns null if user document doesn't exist
 */
export async function getUserRole(uid: string): Promise<UserRole | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data() as User;
      return data.role;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Get full user data from Firestore
 * Returns null if user document doesn't exist
 */
export async function getUserData(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

/**
 * Create a staff user (should be called by admin only)
 * This function is for manual staff account creation
 */
export async function createStaffUser(
  email: string,
  password: string,
  displayName: string,
  employeeId?: string
): Promise<void> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      role: 'staff',
      displayName,
      employeeId: employeeId || uid.slice(0, 8),
      assignedTables: [],
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating staff user:', error);
    throw error;
  }
}
