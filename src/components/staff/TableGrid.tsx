import { useTables } from '../../hooks/useTables';
import { TableCard } from './TableCard';

export function TableGrid() {
  const { tables, loading, error } = useTables();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Cargando mesas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">Error cargando mesas</div>
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">No hay mesas disponibles</div>
        <div className="text-sm text-gray-500 mt-2">
          Las mesas deben ser inicializadas en la base de datos para aparecer aquí. Por favor, contacta al administrador para configurar las mesas.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {tables.map((table) => (
        <TableCard key={table.tableNumber} table={table} />
      ))}
    </div>
  );
}
