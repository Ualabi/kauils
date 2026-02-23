import { useState } from 'react';
import type { MenuItem, Customization } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface MenuItemCardProps {
  menuItem: MenuItem;
}

export default function MenuItemCard({ menuItem }: MenuItemCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Customization[]>([]);
  const [showCustomizations, setShowCustomizations] = useState(false);
  const [added, setAdded] = useState(false);

  const toggleCustomization = (customization: Customization) => {
    setSelectedCustomizations((prev) => {
      const exists = prev.find((c) => c.name === customization.name);
      if (exists) {
        return prev.filter((c) => c.name !== customization.name);
      } else {
        return [...prev, customization];
      }
    });
  };

  const calculatePrice = () => {
    const customizationsTotal = selectedCustomizations.reduce(
      (sum, custom) => sum + custom.price,
      0
    );
    return menuItem.basePrice + customizationsTotal;
  };

  const handleAddToCart = () => {
    addItem(menuItem, quantity, selectedCustomizations.length > 0 ? selectedCustomizations : undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setQuantity(1);
    setSelectedCustomizations([]);
    setShowCustomizations(false);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      {menuItem.imageUrl && (
        <img
          src={menuItem.imageUrl}
          alt={menuItem.name}
          className="w-full h-48 object-cover rounded-t-lg -mx-6 -mt-6 mb-4"
        />
      )}

      <h3 className="text-xl font-bold text-gray-900">{menuItem.name}</h3>
      <p className="text-gray-600 mt-2 text-sm">{menuItem.description}</p>

      {menuItem.ingredients && menuItem.ingredients.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {menuItem.ingredients.join(', ')}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-red-600">
          ${calculatePrice().toFixed(2)}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {menuItem.category}
        </span>
      </div>

      {menuItem.customizations && menuItem.customizations.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowCustomizations(!showCustomizations)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            {showCustomizations ? 'Ocultar' : 'Ver'} personalizaciones
          </button>

          {showCustomizations && (
            <div className="mt-2 space-y-2">
              {menuItem.customizations.map((customization) => (
                <label
                  key={customization.name}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCustomizations.some(
                        (c) => c.name === customization.name
                      )}
                      onChange={() => toggleCustomization(customization)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm">{customization.name}</span>
                  </span>
                  <span className="text-sm font-medium">
                    +${customization.price.toFixed(2)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            −
          </button>
          <span className="px-4 py-2 font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex-1 btn-primary"
          disabled={added}
        >
          {added ? '✓ Agregado' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
