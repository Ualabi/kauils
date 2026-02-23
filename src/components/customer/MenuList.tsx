import { useState } from 'react';
import { useMenu } from '../../hooks/useMenu';
import MenuItemCard from './MenuItemCard';
import type { MenuCategory } from '../../types';

export default function MenuList() {
  const { menuItems, loading, error } = useMenu(true);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');

  const categories: { value: MenuCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Items' },
    { value: 'burger', label: 'Hamburguesas' },
    { value: 'extras', label: 'Extras' },
    { value: 'drink', label: 'Bebidas' },
    { value: 'dessert', label: 'Postres' },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando menú...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          No menu items available. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.value
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-600 py-8">
          No items in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} menuItem={item} />
          ))}
        </div>
      )}
    </div>
  );
}
