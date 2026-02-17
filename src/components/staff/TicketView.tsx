import { useState } from 'react';
import type { Ticket } from '../../types';
import {
  removeItemFromTicket,
  updateTicketItemQuantity,
} from '../../services/ticket.service';

interface TicketViewProps {
  ticket: Ticket;
}

export function TicketView({ ticket }: TicketViewProps) {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleRemoveItem = async (index: number) => {
    setProcessing(`remove-${index}`);
    try {
      await removeItemFromTicket(ticket.id, index);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleUpdateQuantity = async (index: number, quantity: number) => {
    setProcessing(`quantity-${index}`);
    try {
      await updateTicketItemQuantity(ticket.id, index, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setProcessing(null);
    }
  };

  if (ticket.items.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-gray-500">No items in this ticket</div>
        <div className="text-sm text-gray-400 mt-1">
          Use the form above to add items
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Order Items</h2>

      <div className="space-y-3">
        {ticket.items.map((item, index) => (
          <div
            key={index}
            className="flex items-start justify-between border-b pb-3 last:border-0"
          >
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>

              {item.customizations && item.customizations.length > 0 && (
                <div className="text-sm text-gray-600 mt-1">
                  {item.customizations.map((c) => c.name).join(', ')}
                </div>
              )}

              <div className="text-sm text-gray-600 mt-1">
                ${item.price.toFixed(2)} each
              </div>
            </div>

            <div className="flex items-center space-x-3 ml-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleUpdateQuantity(index, item.quantity - 1)
                  }
                  disabled={
                    processing === `quantity-${index}` || item.quantity <= 1
                  }
                  className="btn-secondary px-2 py-1 text-sm"
                >
                  -
                </button>
                <span className="font-semibold w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleUpdateQuantity(index, item.quantity + 1)
                  }
                  disabled={processing === `quantity-${index}`}
                  className="btn-secondary px-2 py-1 text-sm"
                >
                  +
                </button>
              </div>

              <div className="font-semibold w-16 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => handleRemoveItem(index)}
                disabled={processing === `remove-${index}`}
                className="text-red-600 hover:text-red-700 px-2"
                title="Remove item"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
