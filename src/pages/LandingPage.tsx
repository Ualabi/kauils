import { Link } from 'react-router-dom';
import breadImage from '../images/breads/p_hierbas.jpg';
import waterImage from '../images/waters/s_guayaba.jpg';

const menuItems = {
  burgers: [
    { name: 'Sencilla', description: 'Jugosa carne de res a la parrilla, coronada con una rebanada de queso manchego', price: 90 },
    { name: 'Doble', description: 'Dos jugosas carnes de res a la parrilla cubiertas con queso manchego', price: 125 },
    { name: 'Hawaiana', description: 'Jugosa carne de res a la parrilla acompañada de queso manchego y una dulce y deliciosa rebanada de piña asada', price: 105 },
    { name: 'Asadero', description: 'Jugosa carne de res a la parrilla con una rebanada de queso asado a la parrilla y jugoso tocino ahumado', price: 105 },
    { name: 'Quesos y Frutos', description: 'Carne de res coronado con una crujiente galleta frita rellena de queso de cabra, queso crema, frutos secos y miel', price: 115 },
    { name: 'Arrachera', description: 'Jugoso corte de arrachera (200gr aprox.) cocinado al término de su preferencia, con guacamole y aros de cebolla fritos', price: 145 },
    { name: 'Rellena', description: 'Jugosa carne de res rellena de queso manchego derretido', price: 115 },
    { name: 'Tres Quesos', description: 'Jugosa carne de res, bañada en una mezcla de queso manchego, queso Oaxaca derretido y queso asadero', price: 115 },
    { name: 'Costilla', description: 'Suave y jugosa costilla de res deshebrada, cocinada lentamente durante 9 horas en el horno de piedra, bañada en salsa BBQ', price: 125 },
    { name: 'Camarón', description: 'Carne de res con aderezo de queso azul coronada con tres crujientes camarones capeados y quesos derretidos', price: 145 },
    { name: 'Quesito Frito', description: 'Jugosa carne de res, acompañada de una crujiente galleta de queso manchego, empanizada y frita', price: 115 },
    { name: 'Chutney', description: 'Carne de res con queso manchego derretido, chutney de piña y portobello asado', price: 110 },
    { name: 'Pollo', description: 'Crujiente y jugoso muslo de pollo frito, dorado a la perfección. Natural o bañado en BBQ ó Buffalo', price: 110 },
    { name: 'Pork Belly', description: 'Deliciosos filetes de carne de cerdo, cocinados lentamente en el horno de piedra y sellados en el grill', price: 145 },
    { name: 'Miel de Jalapeño', description: 'Jugosa carne de res con queso manchego, queso Oaxaca, queso asadero bañada en miel de jalapeño', price: 115 },
    { name: 'Arúgula y Frutos Rojos', description: 'Carne de res con queso manchego, tocino, arúgula, salsa de frutos rojos y queso de cabra', price: 115 },
    { name: 'Rib Eye', description: 'Jugoso corte de Ribeye cocido a término de 1/2 acompañado de chimichurri de aguacate', price: 160 },
  ],
  wings: [
    { name: 'Alitas (6 piezas)', description: 'Precocción en horno de piedra y selladas en aceite. Sabores: BBQ, Buffalo, habanero o naturales', price: 105 },
    { name: 'Alitas (10 piezas)', description: 'Precocción en horno de piedra y selladas en aceite. Sabores: BBQ, Buffalo, habanero o naturales', price: 130 },
  ],
  desserts: [
    { name: 'Flan de Cajeta', description: 'Suave y cremoso flan de cajeta con un toque de vainilla, bañado en salsa de cajeta caramelizada', price: 40 },
  ],
  drinks: [
    { name: 'Agua del día (Litro)', description: 'Sabor natural preparado diariamente', price: 45 },
    { name: 'Agua del día (700 ml)', description: 'Sabor natural preparado diariamente', price: 30 },
    { name: 'Coca Cola (600 ml)', description: 'Regular, Zero o Light', price: 35 },
    { name: 'Coca Cola de Vidrio (500 ml)', description: 'Presentación clásica', price: 30 },
    { name: 'Agua natural embotellada (Litro)', description: 'Agua purificada', price: 25 },
  ],
  extras: [
    { name: 'Papas a la francesa', price: 70 },
    { name: 'Guacamole', description: 'Para la hamburguesa', price: 20 },
    { name: 'Tocino extra (2 rebanadas)', price: 10 },
    { name: 'Piña asada (1 rebanada)', price: 5 },
    { name: '3 Quesos', description: 'Para la hamburguesa', price: 40 },
    { name: 'Galleta de quesos y frutos', price: 40 },
    { name: 'Galleta de queso frito', price: 40 },
    { name: 'Queso derretido', description: 'Oaxaca y Manchego', price: 25 },
    { name: 'Manchego extra (1 rebanada)', price: 10 },
    { name: 'Asadero', price: 20 },
    { name: 'Aros de cebolla (3 piezas)', price: 15 },
    { name: 'Carne extra', price: 55 },
    { name: 'Arrachera extra', price: 75 },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-orange-500">
      {/* Main Section */}
      <div className="flex items-center justify-center p-4 pt-12">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Las mejores hamburguesas a la leña
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Today's Bread */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <img
                src={breadImage}
                alt="Pan del día"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold text-gray-800">Pan del Día</h3>
                <p className="text-gray-600">Pan de Hierbas</p>
              </div>
            </div>

            {/* Today's Water Flavor */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <img
                src={waterImage}
                alt="Agua del día"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold text-gray-800">Agua del Día</h3>
                <p className="text-gray-600">Agua de Guayaba</p>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white text-center mt-3 mb-5">
            Especiales del Día
          </h2>
        </div>
      </div>

      {/* Menu Section */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Nuestro Menú
          </h2>

          {/* Burgers */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-red-600 mb-4 border-b-2 border-red-600 pb-2">
              Hamburguesas
            </h3>
            <div className="space-y-4">
              {menuItems.burgers.map((item) => (
                <div key={item.name} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <span className="font-bold text-red-600 whitespace-nowrap">${item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wings */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-red-600 mb-4 border-b-2 border-red-600 pb-2">
              Alitas
            </h3>
            <div className="space-y-4">
              {menuItems.wings.map((item) => (
                <div key={item.name} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <span className="font-bold text-red-600 whitespace-nowrap">${item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drinks */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-red-600 mb-4 border-b-2 border-red-600 pb-2">
              Bebidas
            </h3>
            <div className="space-y-4">
              {menuItems.drinks.map((item) => (
                <div key={item.name} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <span className="font-bold text-red-600 whitespace-nowrap">${item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-red-600 mb-4 border-b-2 border-red-600 pb-2">
              Extras
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {menuItems.extras.map((item) => (
                <div key={item.name} className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                    {'description' in item && <p className="text-xs text-gray-600">{item.description}</p>}
                  </div>
                  <span className="font-bold text-red-600 text-sm whitespace-nowrap">${item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desserts */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-red-600 mb-4 border-b-2 border-red-600 pb-2">
              Postres
            </h3>
            <div className="space-y-4">
              {menuItems.desserts.map((item) => (
                <div key={item.name} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <span className="font-bold text-red-600 whitespace-nowrap">${item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link
              to="/signup"
              className="inline-block bg-red-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-red-700 transition-colors shadow-lg"
            >
              ¡Ordena Ahora!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
