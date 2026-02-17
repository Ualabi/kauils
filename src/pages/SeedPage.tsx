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
      setMessage('✅ Menu items seeded successfully!');
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
      setMessage('✅ 20 tables initialized successfully!');
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
      setMessage('✅ Staff account created! Email: staff@kauils.com, Password: staff123');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Database Seeding</h1>
          <p className="text-gray-600 mb-8">
            Use these buttons to populate your database with sample data for testing.
          </p>

          <div className="space-y-4">
            <div>
              <button
                onClick={handleSeedMenu}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Seeding...' : 'Seed Menu Items'}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Adds 10 sample menu items (burgers, sides, drinks)
              </p>
            </div>

            <div>
              <button
                onClick={handleSeedTables}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Initializing...' : 'Initialize Tables'}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Creates 20 tables in the database for staff management
              </p>
            </div>

            <div>
              <button
                onClick={handleCreateStaff}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Staff Account'}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Creates a staff account (email: staff@kauils.com, password: staff123)
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
            <h2 className="font-bold text-gray-900 mb-2">Test Accounts</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Customer:</strong> Create your own via the signup page</p>
              <p><strong>Staff:</strong> staff@kauils.com / staff123 (after creation)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
