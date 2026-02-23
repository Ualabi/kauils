import { useAuth } from '../../hooks/useAuth';
import { TableGrid } from '../../components/staff/TableGrid';

export default function StaffDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de mesas
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenido, {user?.displayName || 'Staff Member'}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-300 border-2 border-green-500 rounded"></div>
              <span className="text-sm text-gray-700">Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-300 border-2 border-red-500 rounded"></div>
              <span className="text-sm text-gray-700">Ocupada</span>
            </div>
          </div>
        </div>

        <TableGrid />
      </div>
    </div>
  );
}
