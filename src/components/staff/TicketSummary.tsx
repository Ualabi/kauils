import { useState } from 'react';
import type { Ticket } from '../../types';
import { closeTicket, sendTicketToKitchen } from '../../services/ticket.service';
import { clearTable } from '../../services/table.service';
import { useNavigate } from 'react-router-dom';

interface TicketSummaryProps {
  ticket: Ticket;
  tableNumber?: number;
}

export function TicketSummary({ ticket, tableNumber }: TicketSummaryProps) {
  const navigate = useNavigate();
  const [closing, setClosing] = useState(false);
  const [sendingToKitchen, setSendingToKitchen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alreadySent = ticket.kitchenStatus === 'sent';

  const handleSendToKitchen = async () => {
    setSendingToKitchen(true);
    setError(null);
    try {
      await sendTicketToKitchen(ticket.id);
    } catch (err) {
      console.error('Error enviando a cocina:', err);
      setError('No se pudo enviar a cocina');
    } finally {
      setSendingToKitchen(false);
    }
  };

  const isTogo = ticket.type === 'togo';

  const handleCloseTicket = async () => {
    const msg = isTogo
      ? `¿Cerrar el ticket de ${ticket.customerName}?`
      : '¿Cerrar este ticket y liberar la mesa?';
    if (!confirm(msg)) return;

    setClosing(true);
    setError(null);

    try {
      await closeTicket(ticket.id);
      if (!isTogo && tableNumber !== undefined) {
        await clearTable(tableNumber);
      }
      navigate('/staff');
    } catch (err) {
      console.error('Error closing ticket:', err);
      setError('No se pudo cerrar el ticket');
      setClosing(false);
    }
  };

  const itemCount = ticket.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="card bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Resumen del Ticket</h2>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          {isTogo ? (
            <>
              <span className="text-gray-600">Cliente:</span>
              <span className="font-semibold">{ticket.customerName}</span>
            </>
          ) : (
            <>
              <span className="text-gray-600">Mesa:</span>
              <span className="font-semibold">{tableNumber}</span>
            </>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Artículos:</span>
          <span className="font-semibold">{itemCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Estado:</span>
          <span className={`font-semibold ${ticket.status === 'open' ? 'text-green-600' : 'text-gray-600'}`}>
            {ticket.status === 'open' ? 'Abierto' : 'Cerrado'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Expo:</span>
          <span className={`font-semibold ${alreadySent ? 'text-orange-600' : 'text-gray-400'}`}>
            {alreadySent ? 'Enviado' : 'No enviado'}
          </span>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-bold text-red-600">
            ${ticket.total.toFixed(2)}
          </span>
        </div>
      </div>

      {ticket.status === 'open' && ticket.items.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={handleSendToKitchen}
            disabled={sendingToKitchen}
            className={`w-full font-semibold py-2 px-4 rounded transition-colors ${
              alreadySent
                ? 'bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {sendingToKitchen
              ? 'Enviando...'
              : alreadySent
              ? 'Actualizar expo'
              : 'Enviar a expo'}
          </button>

          <button
            onClick={handleCloseTicket}
            disabled={closing}
            className="btn-primary w-full"
          >
            {closing ? 'Cerrando...' : isTogo ? 'Cerrar Ticket' : 'Cerrar Ticket y Limpiar Mesa'}
          </button>
        </div>
      )}
    </div>
  );
}
