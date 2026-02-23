import { useState } from 'react';
import Checkout from '../../components/customer/Checkout';
import OrderConfirmation from '../../components/customer/OrderConfirmation';

export default function CheckoutPage() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [pickupCode, setPickupCode] = useState('');

  const handleOrderCreated = (newOrderId: string, newPickupCode: string) => {
    setOrderId(newOrderId);
    setPickupCode(newPickupCode);
    setOrderPlaced(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!orderPlaced ? (
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Pedido</h1>
          <Checkout onOrderCreated={handleOrderCreated} />
        </>
      ) : (
        <OrderConfirmation orderId={orderId} pickupCode={pickupCode} />
      )}
    </div>
  );
}
