import { useAuth } from '../../contexts/AuthContext';
import { useCustomerOrders } from '../../hooks/useOrders';
import type { Order, OrderStatus } from '../../types';
import { format } from 'date-fns';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function OrderCard({ order }: { order: Order }) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-red-600">{order.pickupCode}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Ordered {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
          <p className="text-sm text-gray-600">{order.items.length} items</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
        <ul className="space-y-2">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.quantity}x {item.menuItemName}
                {item.customizations && item.customizations.length > 0 && (
                  <span className="text-gray-500 text-xs ml-2">
                    ({item.customizations.map((c) => c.name).join(', ')})
                  </span>
                )}
              </span>
              <span className="font-medium text-gray-900">
                ${item.itemTotal.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {order.status === 'ready' && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium text-center">
            🎉 Your order is ready! Show code <strong>{order.pickupCode}</strong> at the counter
          </p>
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  const { user } = useAuth();
  const { orders, loading, error } = useCustomerOrders(user?.uid);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
          <a href="/menu" className="btn-primary inline-block">
            Browse Menu
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
