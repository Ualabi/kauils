import type { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  cartItem: CartItemType;
}

export default function CartItem({ cartItem }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { menuItem, quantity, customizations } = cartItem;

  const calculateItemTotal = () => {
    const basePrice = menuItem.basePrice;
    const customizationsPrice =
      customizations?.reduce((sum, custom) => sum + custom.price, 0) || 0;
    return (basePrice + customizationsPrice) * quantity;
  };

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      {menuItem.imageUrl && (
        <img
          src={menuItem.imageUrl}
          alt={menuItem.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
      )}

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-gray-900">{menuItem.name}</h4>
            <p className="text-sm text-gray-600">{menuItem.description}</p>

            {customizations && customizations.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700">Customizations:</p>
                <ul className="text-xs text-gray-600 ml-4 list-disc">
                  {customizations.map((custom, index) => (
                    <li key={index}>
                      {custom.name} (+${custom.price.toFixed(2)})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => removeItem(menuItem.id)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Remove
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => updateQuantity(menuItem.id, quantity - 1)}
              className="px-3 py-1 hover:bg-gray-100 transition-colors"
            >
              −
            </button>
            <span className="px-4 py-1 font-medium">{quantity}</span>
            <button
              onClick={() => updateQuantity(menuItem.id, quantity + 1)}
              className="px-3 py-1 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-600">
              ${menuItem.basePrice.toFixed(2)} each
            </p>
            <p className="text-lg font-bold text-gray-900">
              ${calculateItemTotal().toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
