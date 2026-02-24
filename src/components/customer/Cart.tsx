import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import CartItem from './CartItem';

export default function Cart() {
  const { items, getCartTotal, getItemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-gray-600 mb-4">Tu carro está vacío</p>
        <Link to="/menu" className="btn-primary inline-block">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Cart ({getItemCount()} items)
        </h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <CartItem key={`${item.menuItem.id}-${index}`} cartItem={item} />
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Resúmen de orden</h3>
        <div className="space-y-2">
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Link to="/checkout" className="btn-primary w-full block text-center">
            Terminar orden
          </Link>
          <Link
            to="/menu"
            className="btn-secondary w-full block text-center"
          >
            Seguir ordenando
          </Link>
        </div>
      </div>
    </div>
  );
}
