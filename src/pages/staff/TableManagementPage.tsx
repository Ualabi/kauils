import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTable } from '../../hooks/useTables';
import { useTableTickets } from '../../hooks/useTickets';
import { createTicket } from '../../services/ticket.service';
import { assignTicketToTable } from '../../services/table.service';
import { OrderForm } from '../../components/staff/OrderForm';
import { TicketView } from '../../components/staff/TicketView';
import { TicketSummary } from '../../components/staff/TicketSummary';

export default function TableManagementPage() {
  const { tableNumber: tableNumberParam } = useParams<{ tableNumber: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tableNumber = tableNumberParam ? parseInt(tableNumberParam, 10) : null;

  const { table, loading: tableLoading } = useTable(tableNumber);
  const { tickets, loading: ticketsLoading } = useTableTickets(tableNumber);

  const [creatingTicket, setCreatingTicket] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTicket = tickets.length > 0 ? tickets[0] : null;

  useEffect(() => {
    if (tableNumber === null || isNaN(tableNumber)) {
      navigate('/staff');
    }
  }, [tableNumber, navigate]);

  const handleCreateTicket = async () => {
    if (!user || !tableNumber) return;

    setCreatingTicket(true);
    setError(null);

    try {
      const ticketId = await createTicket(tableNumber, user.uid);
      await assignTicketToTable(tableNumber, ticketId, user.uid);
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError('Failed to create ticket');
    } finally {
      setCreatingTicket(false);
    }
  };

  if (tableLoading || ticketsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Table not found</div>
          <Link to="/staff" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <Link
                to="/staff"
                className="text-gray-600 hover:text-gray-900"
                title="Back to Dashboard"
              >
                ← Back
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Table {tableNumber}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  table.status === 'occupied'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!currentTicket ? (
          <div className="card text-center py-12">
            <div className="mb-4">
              <div className="text-gray-600 mb-2">No active ticket for this table</div>
              <div className="text-sm text-gray-500">
                Create a new ticket to start taking orders
              </div>
            </div>
            <button
              onClick={handleCreateTicket}
              disabled={creatingTicket}
              className="btn-primary"
            >
              {creatingTicket ? 'Creating...' : 'Create New Ticket'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <OrderForm ticketId={currentTicket.id} />
              <TicketView ticket={currentTicket} />
            </div>

            <div className="lg:col-span-1">
              <TicketSummary ticket={currentTicket} tableNumber={tableNumber!} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
