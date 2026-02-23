import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTogoTickets } from '../../hooks/useTickets';
import { TableGrid } from '../../components/staff/TableGrid';
import { createTogoTicket } from '../../services/ticket.service';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { tickets: togoTickets, loading: togoLoading } = useTogoTickets();

  const [showTogoForm, setShowTogoForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [creating, setCreating] = useState(false);
  const [togoError, setTogoError] = useState<string | null>(null);

  const handleCreateTogo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !customerName.trim()) return;

    setCreating(true);
    setTogoError(null);
    try {
      await createTogoTicket(customerName.trim(), user.uid);
      setCustomerName('');
      setShowTogoForm(false);
    } catch (err) {
      console.error('Error creating togo ticket:', err);
      setTogoError('No se pudo crear la orden. Intenta de nuevo.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de mesas</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido, {user?.displayName || 'Staff Member'}
          </p>
        </div>

        {/* ── Para llevar section ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">🥡 Para llevar</h2>
            <button
              onClick={() => { setShowTogoForm((v) => !v); setTogoError(null); }}
              className="btn-primary"
            >
              {showTogoForm ? 'Cancelar' : 'Nueva orden para llevar'}
            </button>
          </div>

          {showTogoForm && (
            <form
              onSubmit={handleCreateTogo}
              className="card mb-4 flex gap-3 items-end"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del cliente
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-field"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <button
                type="submit"
                disabled={creating || !customerName.trim()}
                className="btn-primary disabled:opacity-50"
              >
                {creating ? 'Creando...' : 'Crear ticket'}
              </button>
              {togoError && (
                <p className="text-red-600 text-sm mt-1">{togoError}</p>
              )}
            </form>
          )}

          {togoLoading ? (
            <p className="text-gray-500 text-sm">Cargando órdenes para llevar...</p>
          ) : togoTickets.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No hay órdenes para llevar activas
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {togoTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/staff/togo/${ticket.id}`}
                  className="bg-white border-2 border-orange-300 rounded-lg p-3 hover:border-orange-500 hover:shadow-md transition-all"
                >
                  <div className="font-bold text-gray-900 truncate">
                    {ticket.customerName}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {ticket.items.length} artículo{ticket.items.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs font-medium text-orange-600 mt-1">
                    ${ticket.total.toFixed(2)}
                  </div>
                  {ticket.kitchenStatus === 'sent' && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      ✓ En cocina
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Tables section ── */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mesas</h2>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-300 border-2 border-green-500 rounded"></div>
              <span className="text-sm text-gray-700">Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-300 border-2 border-red-500 rounded"></div>
              <span className="text-sm text-gray-700">Ocupada</span>
            </div>
          </div>
          <TableGrid />
        </div>
      </div>
    </div>
  );
}
