import React, { useState } from 'react';
import { CartContext } from './CartContext'
import type { CartContextType, CartItem, MenuItem, Customization } from '../types';

// Tax rate from environment variable (default 8%)
const TAX_RATE = Number(import.meta.env.VITE_TAX_RATE) || 0.08;

// Cart Provider Component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (
    menuItem: MenuItem,
    quantity: number,
    customizations?: Customization[]
  ): void => {
    setItems((prevItems) => {
      // Check if item with same customizations already exists
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.menuItem.id === menuItem.id &&
          JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, { menuItem, quantity, customizations }];
      }
    });
  };

  const removeItem = (menuItemId: string): void => {
    setItems((prevItems) => prevItems.filter((item) => item.menuItem.id !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const getCartSubtotal = (): number => {
    return items.reduce((total, item) => {
      const basePrice = item.menuItem.basePrice * item.quantity;
      const customizationsPrice =
        (item.customizations?.reduce((sum, custom) => sum + custom.price, 0) || 0) *
        item.quantity;
      return total + basePrice + customizationsPrice;
    }, 0);
  };

  const getCartTax = (): number => {
    return getCartSubtotal() * TAX_RATE;
  };

  const getCartTotal = (): number => {
    return getCartSubtotal() + getCartTax();
  };

  const getItemCount = (): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    getCartTax,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}