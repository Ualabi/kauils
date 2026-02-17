import { createContext, useContext } from 'react';
import type { CartContextType } from '../types';

// Create Cart Context
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use Cart Context
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
