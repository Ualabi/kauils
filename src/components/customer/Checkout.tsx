import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder } from '../../services/order.service';

interface CheckoutProps {
  onOrderCreated: (orderId: string, pickupCode: string) => void;
}

export default function Checkout({ onOrderCreated }: CheckoutProps) {
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitOrder = async () => {
    if (!user) {
      setError('You must be logged in to place an order');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const order = await createOrder(user.uid, user.email, items, user.displayName);
      clearCart();
      onOrderCreated(order.id, order.pickupCode);
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Review</h2>
        <div className="space-y-4">
          {items.map((item, index) => {
            const customizationsPrice =
              item.customizations?.reduce((sum, custom) => sum + custom.price, 0) || 0;
            const itemTotal =
              (item.menuItem.basePrice + customizationsPrice) * item.quantity;

            return (
              <div key={`${item.menuItem.id}-${index}`} className="flex justify-between py-2 border-b border-gray-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.quantity}x {item.menuItem.name}
                  </p>
                  {item.customizations && item.customizations.length > 0 && (
                    <p className="text-sm text-gray-600">
                      + {item.customizations.map((c) => c.name).join(', ')}
                    </p>
                  )}
                </div>
                <p className="font-medium text-gray-900">${itemTotal.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Order Total</h3>
        <div className="space-y-2">
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmitOrder}
          disabled={loading}
          className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
