import { Link } from 'react-router-dom';

interface OrderConfirmationProps {
  orderId: string;
  pickupCode: string;
}

export default function OrderConfirmation({ pickupCode }: OrderConfirmationProps) {
  return (
    <div className="card text-center max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600">Your order has been placed successfully</p>
      </div>

      <div className="bg-red-50 border-2 border-red-600 rounded-lg p-8 mb-6">
        <p className="text-sm text-gray-700 mb-2 font-medium">Your Pickup Code</p>
        <p className="text-5xl font-bold text-red-600 tracking-wider mb-2">{pickupCode}</p>
        <p className="text-sm text-gray-600">
          Please show this code when picking up your order
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-bold text-gray-900 mb-2">What's Next?</h3>
        <ul className="text-sm text-gray-600 space-y-2 text-left">
          <li className="flex items-start gap-2">
            <span className="text-red-600 font-bold">1.</span>
            <span>Your order is being prepared</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 font-bold">2.</span>
            <span>You'll see the status update in "My Orders"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 font-bold">3.</span>
            <span>When ready, come to the counter and provide your pickup code</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/orders" className="btn-primary flex-1">
          View My Orders
        </Link>
        <Link to="/menu" className="btn-secondary flex-1">
          Order More
        </Link>
      </div>
    </div>
  );
}
