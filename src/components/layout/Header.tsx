import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
                  {userRole != 'customer' && (
                    <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      {userRole}
                    </span>
                  )}
                </span>
                {userRole === 'customer' && (
                  <>
                    <Link to="/menu" className="text-gray-700 hover:text-red-600">
                      Menu
                    </Link>
                    <Link to="/cart" className="text-gray-700 hover:text-red-600">
                      Carro
                    </Link>
                    <Link to="/orders" className="text-gray-700 hover:text-red-600">
                      Mis Pedidos
                    </Link>
                  </>
                )}
                {userRole === 'staff' && (
                  <Link to="/staff" className="text-gray-700 hover:text-red-600">
                    Panel
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
