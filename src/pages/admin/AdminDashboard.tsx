import { useState, useEffect } from 'react';
import type { MenuItem, MenuCategory, Ticket, Order } from '../../types';
import { getAllMenuItems, updateMenuItem, createMenuItem } from '../../services/menu.service';
import { getAllTicketsAdmin, deleteTicketsBeforeDate } from '../../services/ticket.service';
import { getAllOrders, deleteOrdersBeforeDate } from '../../services/order.service';
import { Timestamp } from 'firebase/firestore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORIES: { value: MenuCategory; label: string }[] = [
  { value: 'burger',  label: 'Hamburguesa' },
  { value: 'extras',  label: 'Extras'      },
  { value: 'drink',   label: 'Bebida'      },
  { value: 'dessert', label: 'Postre'      },
];

const CATEGORY_LABELS: Record<MenuCategory, string> = {
  burger:  'Hamburguesa',
  extras:  'Extras',
  drink:   'Bebida',
  dessert: 'Postre',
};

function fmtDate(ts: Timestamp | undefined): string {
  if (!ts) return '—';
  return ts.toDate().toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function todayMidnight(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ─── Menu section ─────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '', description: '', basePrice: '', category: 'burger' as MenuCategory,
  imageUrl: '', available: true,
};

function MenuTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState('');
  const [savingPrice, setSavingPrice] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllMenuItems()
      .then(setItems)
      .catch(() => setError('No se pudieron cargar los platillos'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (item: MenuItem) => {
    setToggling(item.id);
    try {
      await updateMenuItem(item.id, { available: !item.available });
      setItems(prev =>
        prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i)
      );
    } catch {
      setError('No se pudo actualizar el platillo');
    } finally {
      setToggling(null);
    }
  };

  const handleSavePrice = async (item: MenuItem) => {
    const price = parseFloat(draftPrice);
    if (isNaN(price) || price <= 0) { setEditingPrice(null); return; }
    setSavingPrice(item.id);
    try {
      await updateMenuItem(item.id, { basePrice: price });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, basePrice: price } : i));
      setEditingPrice(null);
    } catch {
      setError('No se pudo actualizar el precio');
    } finally {
      setSavingPrice(null);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.basePrice);
    if (!form.name || !form.description || isNaN(price) || price <= 0) {
      setError('Completa todos los campos requeridos con valores válidos');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const newItem: Omit<MenuItem, 'id'> = {
        name: form.name.trim(),
        description: form.description.trim(),
        basePrice: price,
        category: form.category,
        available: form.available,
        imageUrl: form.imageUrl.trim() || undefined,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const id = await createMenuItem(newItem);
      setItems(prev => [{ id, ...newItem }, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch {
      setError('No se pudo agregar el platillo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-500">Cargando menú...</div>;

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Add item button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => { setShowForm(v => !v); setError(null); }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold"
        >
          {showForm ? '✕ Cancelar' : '+ Agregar platillo'}
        </button>
      </div>

      {/* Add item form */}
      {showForm && (
        <form
          onSubmit={handleAddItem}
          className="bg-white border rounded-xl p-6 mb-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <h3 className="md:col-span-2 text-lg font-bold text-gray-800">Nuevo platillo</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Ej. Hamburguesa clásica"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as MenuCategory }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Descripción del platillo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio base (MXN) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.basePrice}
              onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen (opcional)</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available-check"
              checked={form.available}
              onChange={e => setForm(f => ({ ...f, available: e.target.checked }))}
              className="h-4 w-4 text-red-600 rounded"
            />
            <label htmlFor="available-check" className="text-sm font-medium text-gray-700">
              Disponible al publicar
            </label>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar platillo'}
            </button>
          </div>
        </form>
      )}

      {/* Menu items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-xl border-2 p-4 shadow-sm transition-opacity ${
              item.available ? 'border-gray-200' : 'border-gray-100 opacity-60'
            }`}
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  {editingPrice === item.id ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-red-600">$</span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={draftPrice}
                        onChange={e => setDraftPrice(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSavePrice(item);
                          if (e.key === 'Escape') setEditingPrice(null);
                        }}
                        className="w-20 border-b-2 border-red-400 text-sm font-bold text-red-600 focus:outline-none bg-transparent"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSavePrice(item)}
                        disabled={savingPrice === item.id}
                        className="text-green-600 hover:text-green-700 text-sm font-bold disabled:opacity-40"
                        title="Guardar"
                      >✓</button>
                      <button
                        onClick={() => setEditingPrice(null)}
                        className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                        title="Cancelar"
                      >✕</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingPrice(item.id); setDraftPrice(item.basePrice.toFixed(2)); }}
                      className="text-sm font-bold text-red-600 hover:underline hover:text-red-700"
                      title="Editar precio"
                    >
                      ${item.basePrice.toFixed(2)}
                    </button>
                  )}
                </div>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => handleToggle(item)}
                disabled={toggling === item.id}
                title={item.available ? 'Deshabilitar' : 'Habilitar'}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-40 ${
                  item.available ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    item.available ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className={`text-xs mt-2 font-medium ${item.available ? 'text-green-600' : 'text-gray-400'}`}>
              {item.available ? 'Disponible' : 'Deshabilitado'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── History section ──────────────────────────────────────────────────────────

const TICKET_STATUS_LABEL: Record<string, string> = { open: 'Abierto', closed: 'Cerrado' };
const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente', preparing: 'Preparando', ready: 'Listo', completed: 'Completado', cancelled: 'Cancelado',
};

function HistoryTab() {
  const [sub, setSub] = useState<'orders' | 'tickets'>('orders');
  const [orders, setOrders]   = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingOrders,  setLoadingOrders]  = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sub === 'orders' && orders.length === 0) {
      setLoadingOrders(true);
      getAllOrders()
        .then(setOrders)
        .catch(() => setError('No se pudieron cargar los pedidos'))
        .finally(() => setLoadingOrders(false));
    }
    if (sub === 'tickets' && tickets.length === 0) {
      setLoadingTickets(true);
      getAllTicketsAdmin()
        .then(setTickets)
        .catch(() => setError('No se pudieron cargar los tickets'))
        .finally(() => setLoadingTickets(false));
    }
  }, [sub]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">{error}</div>
      )}

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-5">
        {(['orders', 'tickets'] as const).map(s => (
          <button
            key={s}
            onClick={() => { setSub(s); setError(null); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              sub === s ? 'bg-gray-800 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s === 'orders' ? 'Pedidos de clientes' : 'Tickets de mesero'}
          </button>
        ))}
      </div>

      {/* Orders table */}
      {sub === 'orders' && (
        loadingOrders ? (
          <div className="text-center py-12 text-gray-500">Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No hay pedidos registrados</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Código</th>
                  <th className="px-4 py-3 text-left">Cliente</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-right">Artículos</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-bold text-gray-800">{o.pickupCode}</td>
                    <td className="px-4 py-3 text-gray-700">{o.customerName || o.customerEmail}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{o.items.length}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">${o.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        o.status === 'completed' ? 'bg-green-100 text-green-700' :
                        o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {ORDER_STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Tickets table */}
      {sub === 'tickets' && (
        loadingTickets ? (
          <div className="text-center py-12 text-gray-500">Cargando tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No hay tickets registrados</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-left">Identificador</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-right">Artículos</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {tickets.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        t.type === 'togo' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {t.type === 'togo' ? '🥡 Para llevar' : `Mesa ${t.tableNumber ?? '?'}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {t.type === 'togo' ? t.customerName : `Mesa ${t.tableNumber}`}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{t.items.length}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">${t.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        t.status === 'closed' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                      }`}>
                        {TICKET_STATUS_LABEL[t.status] ?? t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

// ─── Maintenance section ──────────────────────────────────────────────────────

function MaintenanceTab() {
  const [deleting, setDeleting] = useState(false);
  const [result, setResult] = useState<{ orders: number; tickets: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    const cutoff = todayMidnight();
    const label = cutoff.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    if (!confirm(
      `¿Eliminar TODOS los pedidos y tickets creados ANTES del ${label}?\n\nEsta acción no se puede deshacer.`
    )) return;

    setDeleting(true);
    setResult(null);
    setError(null);
    try {
      const [deletedOrders, deletedTickets] = await Promise.all([
        deleteOrdersBeforeDate(cutoff),
        deleteTicketsBeforeDate(cutoff),
      ]);
      setResult({ orders: deletedOrders, tickets: deletedTickets });
    } catch {
      setError('Error al eliminar los datos. Verifica los permisos de Firestore.');
    } finally {
      setDeleting(false);
    }
  };

  const cutoff = todayMidnight();
  const cutoffLabel = cutoff.toLocaleDateString('es-MX', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-xl border-2 border-red-100 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Limpiar datos de días anteriores</h3>
        <p className="text-sm text-gray-600 mb-4">
          Elimina permanentemente todos los <strong>pedidos de clientes</strong> y{' '}
          <strong>tickets de mesero</strong> creados antes de hoy (
          <span className="font-semibold text-gray-800">{cutoffLabel}</span>).
          Los pedidos y tickets de hoy <em>no</em> serán eliminados.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mb-4 bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded text-sm">
            ✓ Eliminados: <strong>{result.orders}</strong> pedido(s) y{' '}
            <strong>{result.tickets}</strong> ticket(s).
          </div>
        )}

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {deleting ? 'Eliminando...' : '🗑 Eliminar datos de días anteriores'}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type AdminTab = 'menu' | 'history' | 'maintenance';

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('menu');

  const TABS: { value: AdminTab; label: string }[] = [
    { value: 'menu',        label: 'Menú'          },
    { value: 'history',     label: 'Historial'     },
    { value: 'maintenance', label: 'Mantenimiento' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500 mt-1">Gestión del menú, historial y mantenimiento</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b pb-0">
          {TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-5 py-2.5 font-semibold text-sm rounded-t-lg transition-colors border-b-2 -mb-px ${
                tab === t.value
                  ? 'border-red-600 text-red-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'menu'        && <MenuTab />}
        {tab === 'history'     && <HistoryTab />}
        {tab === 'maintenance' && <MaintenanceTab />}
      </div>
    </div>
  );
}
