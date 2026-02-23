import { Link } from 'react-router-dom';
import type { Table } from '../../types';

interface TableCardProps {
  table: Table;
}

export function TableCard({ table }: TableCardProps) {
  const isOccupied = table.status === 'occupied';

  return (
    <Link
      to={`/staff/table/${table.tableNumber}`}
      className={`card p-6 text-center transition-all hover:shadow-lg ${
        isOccupied
          ? 'bg-red-50 border-2 border-red-300'
          : 'bg-green-50 border-2 border-green-300'
      }`}
    >
      <div className="text-3xl font-bold mb-2">
        Mesa {table.tableNumber}
      </div>
      <div
        className={`text-sm font-medium ${
          isOccupied ? 'text-red-700' : 'text-green-700'
        }`}
      >
        {isOccupied ? 'Ocupada' : 'Disponible'}
      </div>
      {table.currentTicketId && (
        <div className="mt-2 text-xs text-gray-600">
          Ticket: {table.currentTicketId.slice(0, 8)}
        </div>
      )}
    </Link>
  );
}
