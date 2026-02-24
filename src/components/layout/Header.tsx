import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ROLE_VIEWS = [
  { label: 'Admin',    path: '/admin' },
  { label: 'Staff',    path: '/staff' },
  { label: 'Expo',     path: '/expo'  },
  { label: 'Cliente',  path: '/menu'  },
] as const;

export default function Header() {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Determine which view the admin is currently on for the dropdown
  const currentView = ROLE_VIEWS.find(v => location.pathname.startsWith(v.path))?.path ?? '/admin';

  // When admin has switched to another view, show nav links for that view
  const activeView = userRole === 'admin' ? currentView : null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-red-600">Hamburguesas Kauil</h1>
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  {user.displayName}
                  {userRole !== 'customer' && (
                    <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      {userRole}
                    </span>
                  )}
                </span>

                {/* Role-switcher dropdown — admin only */}
                {userRole === 'admin' && (
                  <select
                    value={currentView}
                    onChange={e => navigate(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
                    title="Cambiar vista"
                  >
                    {ROLE_VIEWS.map(v => (
                      <option key={v.path} value={v.path}>{v.label}</option>
                    ))}
                  </select>
                )}

                {/* Nav links for customer view */}
                {(userRole === 'customer' || activeView === '/menu') && (
                  <>
                    <Link to="/menu" className="text-gray-700 hover:text-red-600">
                      Ordena
                    </Link>
                    <Link to="/cart" className="text-gray-700 hover:text-red-600">
                      Carro
                    </Link>
                    <Link to="/orders" className="text-gray-700 hover:text-red-600">
                      Mis Pedidos
                    </Link>
                  </>
                )}
                {/* Nav links for staff view */}
                {(userRole === 'staff' || activeView === '/staff') && (
                  <Link to="/staff" className="text-gray-700 hover:text-red-600">
                    Panel
                  </Link>
                )}
                {/* Nav links for expo view */}
                {(userRole === 'expo' || activeView === '/expo') && (
                  <Link to="/expo" className="text-gray-700 hover:text-red-600">
                    Expo
                  </Link>
                )}
                {/* Nav links for admin view */}
                {(userRole === 'admin' && activeView === '/admin') && (
                  <Link to="/admin" className="text-gray-700 hover:text-red-600">
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-red-600">
                  Iniciar sesión
                </Link>
                <Link
                  to="/signup"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Registrarme
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
