import { createContext, useContext } from 'react';
import type { AuthContextType } from '../types';

// Create Auth Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use Auth Context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
