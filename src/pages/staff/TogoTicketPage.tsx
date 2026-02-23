import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTicket } from '../../hooks/useTickets';
import { OrderForm } from '../../components/staff/OrderForm';
import { TicketView } from '../../components/staff/TicketView';
import { TicketSummary } from '../../components/staff/TicketSummary';

export default function TogoTicketPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();

  const { ticket, loading } = useTicket(ticketId ?? null);

  useEffect(() => {
    if (!ticketId) navigate('/staff');
  }, [ticketId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Ticket no encontrado</div>
          <Link to="/staff" className="btn-primary">
            Volver al panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Link to="/staff" className="text-gray-600 hover:text-gray-900">
            ← Volver
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            🥡 {ticket.customerName}
          </h1>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
            Para llevar
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OrderForm ticketId={ticket.id} />
            <TicketView ticket={ticket} />
          </div>

          <div className="lg:col-span-1">
            <TicketSummary ticket={ticket} />
          </div>
        </div>
      </div>
    </div>
  );
}
