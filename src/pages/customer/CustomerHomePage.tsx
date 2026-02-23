import { Link } from 'react-router-dom';
import MenuList from '../../components/customer/MenuList';
import { useCart } from '../../contexts/CartContext';

export default function CustomerHomePage() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuestro Menú</h1>
          <p className="text-gray-600 mt-1">Escoge tu pedido</p>
        </div>

        {itemCount > 0 && (
          <Link
            to="/cart"
            className="btn-primary flex items-center gap-2"
          >
            Ver Carro
            <span className="bg-white text-red-600 px-2 py-1 rounded-full text-sm font-bold">
              {itemCount}
            </span>
          </Link>
        )}
      </div>

      <MenuList />
    </div>
  );
}
