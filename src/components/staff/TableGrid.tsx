import { useTables } from '../../hooks/useTables';
import { TableCard } from './TableCard';

export function TableGrid() {
  const { tables, loading, error } = useTables();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Loading tables...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">Error loading tables</div>
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">No tables available</div>
        <div className="text-sm text-gray-500 mt-2">
          Tables need to be initialized in the database
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
