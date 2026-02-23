import { useState } from 'react';
import type { Ticket, TicketItemStatus } from '../../types';
import {
  removeItemFromTicket,
  updateTicketItemQuantity,
  updateTicketItemStatus,
} from '../../services/ticket.service';

interface TicketViewProps {
  ticket: Ticket;
}

const STAFF_STATUSES: { value: TicketItemStatus; label: string; classes: string }[] = [
  { value: 'received', label: 'Recibido', classes: 'bg-gray-100 text-gray-700 border-gray-300' },
  { value: 'served',   label: 'Servido',  classes: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'canceled', label: 'Cancelado',classes: 'bg-red-100 text-red-700 border-red-300'   },
];

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

  const handleUpdateStatus = async (index: number, status: TicketItemStatus) => {
    setProcessing(`status-${index}`);
    try {
      await updateTicketItemStatus(ticket.id, index, status);
    } catch (error) {
      console.error('Error updating item status:', error);
    } finally {
      setProcessing(null);
    }
  };

  if (ticket.items.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-gray-500">No hay artículos en este ticket</div>
        <div className="text-sm text-gray-400 mt-1">
          Usa el formulario de arriba para agregar artículos
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Artículos del Pedido</h2>

      <div className="space-y-4">
        {ticket.items.map((item, index) => {
          const currentStatus = item.status ?? 'received';
          const isCanceled = currentStatus === 'canceled';

          return (
            <div
              key={index}
              className={`border-b pb-4 last:border-0 ${isCanceled ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>

                  {item.customizations && item.customizations.length > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      {item.customizations.map((c) => c.name).join(', ')}
                    </div>
                  )}

                  <div className="text-sm text-gray-600 mt-1">
                    ${item.price.toFixed(2)} c/u
                  </div>
                </div>

                <div className="flex items-center space-x-3 ml-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                      disabled={processing === `quantity-${index}` || item.quantity <= 1}
                      className="btn-secondary px-2 py-1 text-sm"
                    >
                      -
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
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
                    title="Eliminar artículo"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Kitchen status badge */}
              {currentStatus === 'cooking' && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-orange-100 text-orange-700 border border-orange-300 text-xs font-semibold">
                  🍳 Cocinando
                </div>
              )}
              {currentStatus === 'ready' && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 border border-green-300 text-xs font-semibold">
                  ✓ ¡Listo para recoger!
                </div>
              )}

              {/* Status buttons */}
              <div className="flex gap-2 mt-2">
                {STAFF_STATUSES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => handleUpdateStatus(index, s.value)}
                    disabled={processing === `status-${index}`}
                    className={`text-xs px-2 py-1 rounded border font-medium transition-colors ${
                      currentStatus === s.value
                        ? s.classes + ' ring-2 ring-offset-1 ring-current'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
