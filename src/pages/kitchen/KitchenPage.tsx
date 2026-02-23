import { useState } from 'react';
import { useKitchenTickets } from '../../hooks/useTickets';
import { useActiveOrders } from '../../hooks/useOrders';
import { useTables } from '../../hooks/useTables';
import type { Ticket, Order, TicketItemStatus } from '../../types';
import { updateTicketItemStatus, closeTicket } from '../../services/ticket.service';
import { updateOrderStatus, updateOrderItemStatus } from '../../services/order.service';
import { updateTableStatus, clearTable } from '../../services/table.service';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const ITEM_STATUSES: { value: TicketItemStatus; label: string; bg: string; text: string }[] = [
  { value: 'received', label: 'Recibido',  bg: 'bg-gray-100',   text: 'text-gray-700'   },
  { value: 'cooking',  label: 'Cocinando', bg: 'bg-orange-100', text: 'text-orange-700' },
  { value: 'ready',    label: 'Listo',     bg: 'bg-green-100',  text: 'text-green-700'  },
  { value: 'served',   label: 'Servido',   bg: 'bg-blue-100',   text: 'text-blue-700'   },
  { value: 'canceled', label: 'Cancelado', bg: 'bg-red-100',    text: 'text-red-700'    },
];

function ItemStatusRow({
  currentStatus,
  onSelect,
  disabled,
}: {
  currentStatus: TicketItemStatus | undefined;
  onSelect: (s: TicketItemStatus) => void;
  disabled: boolean;
}) {
  const active = currentStatus ?? 'received';
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {ITEM_STATUSES.map((s) => (
        <button
          key={s.value}
          onClick={() => onSelect(s.value)}
          disabled={disabled || active === s.value}
          className={`text-xs px-2 py-0.5 rounded border font-medium transition-colors ${
            active === s.value
              ? `${s.bg} ${s.text} border-current ring-1 ring-current`
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 disabled:opacity-40'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

// ─── Table tickets section ────────────────────────────────────────────────────

function TicketCard({ ticket }: { ticket: Ticket }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const handleItemStatus = async (index: number, status: TicketItemStatus) => {
    setBusy(`item-${index}`);
    try {
      await updateTicketItemStatus(ticket.id, index, status);
    } finally {
      setBusy(null);
    }
  };

  const isTogo = ticket.type === 'togo';

  const handleCloseTicket = async () => {
    const label = isTogo ? ticket.customerName : `Mesa ${ticket.tableNumber}`;
    if (!confirm(`¿Cerrar ticket de ${label}?`)) return;
    setClosing(true);
    try {
      await closeTicket(ticket.id);
      if (!isTogo && ticket.tableNumber !== undefined) {
        await clearTable(ticket.tableNumber);
      }
    } finally {
      setClosing(false);
    }
  };

  const handleTableAvailable = async () => {
    if (ticket.tableNumber !== undefined) await updateTableStatus(ticket.tableNumber, 'available');
  };

  const handleTableOccupied = async () => {
    if (ticket.tableNumber !== undefined) await updateTableStatus(ticket.tableNumber, 'occupied');
  };

  return (
    <div className="bg-white rounded-xl border-2 border-orange-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          {isTogo ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">{ticket.customerName}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                🥡 Para llevar
              </span>
            </div>
          ) : (
            <h3 className="text-lg font-bold text-gray-800">Mesa {ticket.tableNumber}</h3>
          )}
        </div>
        {!isTogo && (
          <div className="flex gap-2">
            <button
              onClick={handleTableAvailable}
              className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
            >
              Disponible
            </button>
            <button
              onClick={handleTableOccupied}
              className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
            >
              Ocupada
            </button>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="space-y-3 mb-4">
        {ticket.items.map((item, i) => (
          <div key={i} className={`${item.status === 'canceled' ? 'opacity-40' : ''}`}>
            <div className="flex justify-between text-sm font-medium text-gray-800">
              <span>{item.quantity}× {item.name}</span>
              <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            {item.customizations && item.customizations.length > 0 && (
              <div className="text-xs text-gray-500">
                {item.customizations.map((c) => c.name).join(', ')}
              </div>
            )}
            <ItemStatusRow
              currentStatus={item.status}
              onSelect={(s) => handleItemStatus(i, s)}
              disabled={busy === `item-${i}`}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t pt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700">
          Total: ${ticket.total.toFixed(2)}
        </span>
        <button
          onClick={handleCloseTicket}
          disabled={closing}
          className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-900 disabled:opacity-50"
        >
          {closing ? 'Cerrando...' : isTogo ? 'Entregado ✓' : 'Cerrar ticket'}
        </button>
      </div>
    </div>
  );
}

// ─── Customer orders section ──────────────────────────────────────────────────

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending:   'Pendiente',
  preparing: 'Preparando',
  ready:     'Listo para recoger',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready:     'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

function OrderCard({ order }: { order: Order }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleItemStatus = async (index: number, status: TicketItemStatus) => {
    setBusy(`item-${index}`);
    try {
      await updateOrderItemStatus(order.id, index, status);
    } finally {
      setBusy(null);
    }
  };

  const handleOrderStatus = async (status: 'preparing' | 'ready' | 'completed') => {
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(order.id, status);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-lg font-bold text-gray-800 font-mono">{order.pickupCode}</span>
          <span className="ml-2 text-sm font-medium text-gray-700">
            {order.customerName || order.customerEmail}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORDER_STATUS_COLORS[order.status] ?? ''}`}>
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className={`${item.status === 'canceled' ? 'opacity-40' : ''}`}>
            <div className="flex justify-between text-sm font-medium text-gray-800">
              <span>{item.quantity}× {item.menuItemName}</span>
              <span className="text-gray-500">${item.itemTotal.toFixed(2)}</span>
            </div>
            {item.customizations && item.customizations.length > 0 && (
              <div className="text-xs text-gray-500">
                {item.customizations.map((c) => c.name).join(', ')}
              </div>
            )}
            <ItemStatusRow
              currentStatus={item.status}
              onSelect={(s) => handleItemStatus(i, s)}
              disabled={busy === `item-${i}`}
            />
          </div>
        ))}
      </div>

      {/* Footer — order-level actions */}
      <div className="border-t pt-3 flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-gray-700">
          Total: ${order.total.toFixed(2)}
        </span>
        <div className="flex gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => handleOrderStatus('preparing')}
              disabled={updatingStatus}
              className="text-sm bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Preparando
            </button>
          )}
          {(order.status === 'pending' || order.status === 'preparing') && (
            <button
              onClick={() => handleOrderStatus('ready')}
              disabled={updatingStatus}
              className="text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Pedido listo ✓
            </button>
          )}
          {order.status === 'ready' && (
            <button
              onClick={() => handleOrderStatus('completed')}
              disabled={updatingStatus}
              className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-900 disabled:opacity-50"
            >
              Entregado ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function KitchenPage() {
  const [tab, setTab] = useState<'orders' | 'tables' | 'togo'>('orders');
  const { tickets, loading: ticketsLoading } = useKitchenTickets();
  const { orders, loading: ordersLoading } = useActiveOrders();
  const { tables } = useTables();

  const tableTickets = tickets.filter((t) => t.type !== 'togo');
  const togoTickets  = tickets.filter((t) => t.type === 'togo');
  const occupiedTables = tables.filter((t) => t.status === 'occupied');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Cocina</h1>
          <p className="text-gray-500 mt-1">Vista en tiempo real de pedidos y mesas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('orders')}
            className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
              tab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            Para recoger
            {orders.length > 0 && (
              <span className="ml-2 bg-white text-blue-600 rounded-full text-xs px-1.5 py-0.5 font-bold">
                {orders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('tables')}
            className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
              tab === 'tables'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            Mesas
            {tableTickets.length > 0 && (
              <span className="ml-2 bg-white text-orange-500 rounded-full text-xs px-1.5 py-0.5 font-bold">
                {tableTickets.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('togo')}
            className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
              tab === 'togo'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            Para llevar
            {togoTickets.length > 0 && (
              <span className="ml-2 bg-white text-green-600 rounded-full text-xs px-1.5 py-0.5 font-bold">
                {togoTickets.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Para recoger tab (online customer orders) ── */}
        {tab === 'orders' && (
          <>
            {ordersLoading ? (
              <div className="text-center py-16 text-gray-500">Cargando pedidos...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                No hay pedidos activos en este momento
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Mesas tab ── */}
        {tab === 'tables' && (
          <>
            {/* Quick table status overview */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tables.map((t) => (
                <span
                  key={t.tableNumber}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    t.status === 'occupied'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  Mesa {t.tableNumber} — {t.status === 'occupied' ? 'Ocupada' : 'Disponible'}
                </span>
              ))}
            </div>

            {ticketsLoading ? (
              <div className="text-center py-16 text-gray-500">Cargando tickets...</div>
            ) : tableTickets.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                No hay tickets de mesa enviados a cocina
                {occupiedTables.length > 0 && (
                  <p className="text-sm mt-2">
                    ({occupiedTables.length} mesa(s) ocupada(s) — el mesero aún no ha enviado el pedido)
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tableTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Para llevar tab ── */}
        {tab === 'togo' && (
          <>
            {ticketsLoading ? (
              <div className="text-center py-16 text-gray-500">Cargando órdenes...</div>
            ) : togoTickets.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                No hay órdenes para llevar en este momento
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {togoTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
