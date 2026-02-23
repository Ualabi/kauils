import { useState } from 'react';
import { useMenu } from '../../hooks/useMenu';
import { addItemToTicket } from '../../services/ticket.service';
import type { MenuItem, TicketItem, Customization } from '../../types';

interface OrderFormProps {
  ticketId: string;
  onItemAdded?: () => void;
}

export function OrderForm({ ticketId, onItemAdded }: OrderFormProps) {
  const { menuItems, loading } = useMenu();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setCustomizations([]);
    setError(null);
  };

  const handleToggleCustomization = (customization: Customization) => {
    setCustomizations((prev) => {
      const exists = prev.find((c) => c.name === customization.name);
      if (exists) {
        return prev.filter((c) => c.name !== customization.name);
      }
      return [...prev, customization];
    });
  };

  const calculatePrice = (): number => {
    if (!selectedItem) return 0;
    const customizationTotal = customizations.reduce(
      (sum, c) => sum + c.price,
      0
    );
    return selectedItem.basePrice + customizationTotal;
  };

  const handleAddToTicket = async () => {
    if (!selectedItem) return;

    setAdding(true);
    setError(null);

    try {
      const ticketItem: TicketItem = {
        menuItemId: selectedItem.id,
        name: selectedItem.name,
        price: calculatePrice(),
        quantity,
        customizations,
      };

      await addItemToTicket(ticketId, ticketItem);

      setSelectedItem(null);
      setQuantity(1);
      setCustomizations([]);

      if (onItemAdded) {
        onItemAdded();
      }
    } catch (err) {
      console.error('Error al añadir el artículo al ticket:', err);
      setError('Error al añadir el artículo al ticket');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando menú...</div>;
  }

  const availableItems = menuItems.filter((item) => item.available);
  const burgers = availableItems.filter((item) => item.category === 'burger');
  const extras = availableItems.filter((item) => item.category === 'extras');
  const drinks = availableItems.filter((item) => item.category === 'drink');
  // const desserts = availableItems.filter((item) => item.category === 'dessert');

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Añade artículos al ticket</h2>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {burgers.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Hamburguesas</h3>
            <div className="space-y-2">
              {burgers.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`w-full text-left px-3 py-2 rounded border transition-colors ${
                    selectedItem?.id === item.id
                      ? 'bg-red-100 border-red-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    ${item.basePrice.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {extras.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Extras</h3>
            <div className="space-y-2">
              {extras.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`w-full text-left px-3 py-2 rounded border transition-colors ${
                    selectedItem?.id === item.id
                      ? 'bg-red-100 border-red-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    ${item.basePrice.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {drinks.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Bebidas</h3>
            <div className="space-y-2">
              {drinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`w-full text-left px-3 py-2 rounded border transition-colors ${
                    selectedItem?.id === item.id
                      ? 'bg-red-100 border-red-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    ${item.basePrice.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Selected: {selectedItem.name}</h3>

          {selectedItem.customizations &&
            selectedItem.customizations.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Personalizaciones</h4>
                <div className="space-y-2">
                  {selectedItem.customizations.map((custom) => (
                    <label
                      key={custom.name}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={customizations.some(
                          (c) => c.name === custom.name
                        )}
                        onChange={() => handleToggleCustomization(custom)}
                        className="rounded"
                      />
                      <span>
                        {custom.name}{' '}
                        {custom.price > 0 && `(+$${custom.price.toFixed(2)})`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Cantidad</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn-secondary px-3 py-1"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="btn-secondary px-3 py-1"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">
              Total: ${(calculatePrice() * quantity).toFixed(2)}
            </div>
            <button
              onClick={handleAddToTicket}
              disabled={adding}
              className="btn-primary"
            >
              {adding ? 'Añadiendo...' : 'Añadido al Ticket'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
