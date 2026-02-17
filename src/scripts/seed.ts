/**
 * Seed script to populate Firestore with sample menu items
 * Run this once to add sample data to your database
 *
 * To run: Create a temporary page that calls this function on mount
 * Or use Firebase Admin SDK in a Node script
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { initializeTables } from '../services/table.service';

export async function seedMenuItems() {
  const menuItems = [
    {
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, onion, and special sauce',
      basePrice: 8.99,
      category: 'burger',
      available: true,
      ingredients: ['Beef Patty', 'Lettuce', 'Tomato', 'Onion', 'Pickles', 'Special Sauce'],
      customizations: [
        { name: 'Extra Cheese', price: 1.50 },
        { name: 'Bacon', price: 2.00 },
        { name: 'Extra Patty', price: 3.50 },
        { name: 'Avocado', price: 2.00 },
      ],
    },
    {
      name: 'Cheese Burger',
      description: 'Classic burger topped with melted American cheese',
      basePrice: 9.99,
      category: 'burger',
      available: true,
      ingredients: ['Beef Patty', 'American Cheese', 'Lettuce', 'Tomato', 'Pickles', 'Ketchup', 'Mustard'],
      customizations: [
        { name: 'Extra Cheese', price: 1.50 },
        { name: 'Bacon', price: 2.00 },
        { name: 'Grilled Onions', price: 1.00 },
      ],
    },
    {
      name: 'Bacon BBQ Burger',
      description: 'Loaded with crispy bacon, cheddar cheese, and tangy BBQ sauce',
      basePrice: 11.99,
      category: 'burger',
      available: true,
      ingredients: ['Beef Patty', 'Bacon', 'Cheddar Cheese', 'BBQ Sauce', 'Onion Rings', 'Lettuce'],
      customizations: [
        { name: 'Extra Bacon', price: 2.50 },
        { name: 'Extra Patty', price: 3.50 },
        { name: 'Jalapeños', price: 0.75 },
      ],
    },
    {
      name: 'Mushroom Swiss Burger',
      description: 'Sautéed mushrooms and Swiss cheese on a premium beef patty',
      basePrice: 10.99,
      category: 'burger',
      available: true,
      ingredients: ['Beef Patty', 'Swiss Cheese', 'Sautéed Mushrooms', 'Caramelized Onions', 'Garlic Aioli'],
      customizations: [
        { name: 'Extra Mushrooms', price: 1.50 },
        { name: 'Bacon', price: 2.00 },
      ],
    },
    {
      name: 'Veggie Burger',
      description: 'Plant-based patty with fresh vegetables and special sauce',
      basePrice: 9.49,
      category: 'burger',
      available: true,
      ingredients: ['Veggie Patty', 'Lettuce', 'Tomato', 'Avocado', 'Red Onion', 'Vegan Mayo'],
      customizations: [
        { name: 'Extra Avocado', price: 2.00 },
        { name: 'Grilled Peppers', price: 1.00 },
      ],
    },
    {
      name: 'French Fries',
      description: 'Crispy golden fries, perfectly seasoned',
      basePrice: 3.99,
      category: 'side',
      available: true,
      ingredients: ['Potatoes', 'Salt'],
      customizations: [
        { name: 'Cheese Sauce', price: 1.50 },
        { name: 'Bacon Bits', price: 2.00 },
        { name: 'Cajun Seasoning', price: 0.50 },
      ],
    },
    {
      name: 'Onion Rings',
      description: 'Thick-cut onion rings with crispy breading',
      basePrice: 4.49,
      category: 'side',
      available: true,
      ingredients: ['Onions', 'Breading', 'Ranch Dipping Sauce'],
    },
    {
      name: 'Coca-Cola',
      description: 'Classic Coca-Cola (16 oz)',
      basePrice: 2.49,
      category: 'drink',
      available: true,
      ingredients: ['Coca-Cola'],
      customizations: [
        { name: 'Large (24 oz)', price: 0.75 },
      ],
    },
    {
      name: 'Sprite',
      description: 'Refreshing lemon-lime soda (16 oz)',
      basePrice: 2.49,
      category: 'drink',
      available: true,
      ingredients: ['Sprite'],
      customizations: [
        { name: 'Large (24 oz)', price: 0.75 },
      ],
    },
    {
      name: 'Iced Tea',
      description: 'Freshly brewed iced tea (16 oz)',
      basePrice: 2.29,
      category: 'drink',
      available: true,
      ingredients: ['Iced Tea'],
      customizations: [
        { name: 'Sweet Tea', price: 0.00 },
        { name: 'Large (24 oz)', price: 0.75 },
      ],
    },
  ];

  const menuRef = collection(db, 'menuItems');

  try {
    for (const item of menuItems) {
      await addDoc(menuRef, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`Added: ${item.name}`);
    }
    console.log('✅ All menu items added successfully!');
  } catch (error) {
    console.error('Error seeding menu items:', error);
    throw error;
  }
}

/**
 * Initialize tables in the database
 */
export async function seedTables(count: number = 20): Promise<void> {
  try {
    await initializeTables(count);
    console.log(`✅ Initialized ${count} tables successfully!`);
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
}
