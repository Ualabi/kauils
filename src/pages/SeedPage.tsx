import { useState } from 'react';
import { seedMenuItems, seedTables } from '../scripts/seed';
import { createStaffUser } from '../services/auth.service';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSeedMenu = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await seedMenuItems();
      setMessage('✅ Productos del menú cargados correctamente.');
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedTables = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await seedTables(20);
      setMessage('✅ 20 mesas inicializadas correctamente.');
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await createStaffUser(
        'staff@kauils.com',
        'staff123',
        'Staff Member',
        'STAFF001'
      );
      setMessage('✅ Cuenta de staff creada. Email: staff@kauils.com, Contraseña: staff123');
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Inicialización de Base de Datos</h1>
          <p className="text-gray-600 mb-8">
            Usa estos botones para poblar la base de datos con datos iniciales.
          </p>

          <div className="space-y-4">
            <div>
              <button
                onClick={handleSeedMenu}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Cargando...' : 'Cargar Menú'}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Agrega los productos del menú (hamburguesas, bebidas, extras, postres)
              </p>
            </div>

            <div>
              <button
                onClick={handleSeedTables}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Inicializando...' : 'Inicializar Mesas'}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Crea 20 mesas en la base de datos para la gestión del personal
              </p>
            </div>

            <div>
              <button
                onClick={handleCreateStaff}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Cuenta de Staff'}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Crea una cuenta de staff (email: staff@kauils.com, contraseña: staff123)
              </p>
            </div>
          </div>

          {message && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="font-bold text-gray-900 mb-2">Cuentas de prueba</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Cliente:</strong> Crea la tuya en la página de registro</p>
              <p><strong>Staff:</strong> staff@kauils.com / staff123 (después de crear la cuenta)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
