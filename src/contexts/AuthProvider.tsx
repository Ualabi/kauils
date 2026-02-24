import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import type { AuthContextType, User, UserRole } from '../types';
import * as authService from '../services/auth.service';


// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch user data from Firestore
        try {
          const userData = await authService.getUserData(firebaseUser.uid);
          if (userData) {
            setUser(userData);
            setUserRole(userData.role);
          } else {
            // User authenticated but no Firestore document (shouldn't happen)
            console.error('User authenticated but no Firestore document found');
            setUser(null);
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setUserRole(null);
        }
      } else {
        // User is signed out
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const role = await authService.login(email, password);
    // User state will be updated by onAuthStateChanged listener
    return role;
  };

  const signup = async (email: string, phone: string, password: string, displayName: string): Promise<void> => {
    await authService.signup(email, phone, password, displayName);
    // User state will be updated by onAuthStateChanged listener
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    // User state will be updated by onAuthStateChanged listener
  };

  const value: AuthContextType = {
    user,
    userRole,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}