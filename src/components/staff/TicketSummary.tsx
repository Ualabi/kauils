import { useState } from 'react';
import type { Ticket } from '../../types';
import { closeTicket } from '../../services/ticket.service';
import { clearTable } from '../../services/table.service';
import { useNavigate } from 'react-router-dom';

interface TicketSummaryProps {
  ticket: Ticket;
  tableNumber: number;
}

export function TicketSummary({ ticket, tableNumber }: TicketSummaryProps) {
  const navigate = useNavigate();
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCloseTicket = async () => {
    if (!confirm('Close this ticket and clear the table?')) {
      return;
    }

    setClosing(true);
    setError(null);

    try {
      await closeTicket(ticket.id);
      await clearTable(tableNumber);
      navigate('/staff');
    } catch (err) {
      console.error('Error closing ticket:', err);
      setError('Failed to close ticket');
      setClosing(false);
    }
  };

  const itemCount = ticket.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="card bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Ticket Summary</h2>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Table:</span>
          <span className="font-semibold">{tableNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Items:</span>
          <span className="font-semibold">{itemCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span
            className={`font-semibold ${
              ticket.status === 'open' ? 'text-green-600' : 'text-gray-600'
            }`}
          >
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
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
        <button
          onClick={handleCloseTicket}
          disabled={closing}
          className="btn-primary w-full"
        >
          {closing ? 'Closing...' : 'Close Ticket & Clear Table'}
        </button>
      )}
    </div>
  );
}
