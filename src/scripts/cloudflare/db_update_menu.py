from db_base import D1_ENDPOINT, HEADERS
from menu_products import products
import requests
import json

def get_description(product):
  description = product.get(
    'description', 'No hay descripción disponible').replace("\n", " ").strip()
  while "  " in description:
    description = description.replace("  ", " ")
  return description

# ========= SQL =========
SQL_STATEMENTS = """
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS products_category;
DROP TABLE IF EXISTS products_description;

CREATE TABLE products_category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products_description (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  category_id INTEGER NOT NULL,
  description_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES products_category(id),
  FOREIGN KEY (description_id) REFERENCES products_description(id)
);

INSERT INTO products_category (name)
VALUES
  ('burger'),
  ('wings'),
  ('dessert'),
  ('drink'),
  ('extras');

"""

products_category_map = {
  "burger": 1,
  "wings": 2,
  "dessert": 3,
  "drink": 4,
  "extras": 5,
}

for i,product in enumerate(products):
  if product['category'] in ['burger', 'wings', 'dessert']:
    SQL_STATEMENTS += f"""
      INSERT INTO products_description (description)
      VALUES ('{get_description(product)}');
    """
    SQL_STATEMENTS += f"""
      INSERT INTO products (code, name, price, available, category_id, description_id)
      VALUES ('{product['id']}', '{product['name']}', {product['price']}, TRUE, {products_category_map[product['category']]}, {i+1});
    """
  else:
    SQL_STATEMENTS += f"""
      INSERT INTO products (code, name, price, available, category_id, description_id)
      VALUES ('{product['id']}', '{product['name']}', {product['price']}, TRUE, {products_category_map[product['category']]}, NULL);
    """
    

# ========= REQUEST =========
payload = {
    "sql": SQL_STATEMENTS
}

response = requests.post(
    D1_ENDPOINT,
    headers=HEADERS,
    data=json.dumps(payload)
)

# ========= RESULT =========
if response.status_code == 200:
    print("✅ Tablas creadas correctamente")
    print(response.json())
else:
    print("❌ Error creando tablas")
    print(response.status_code, response.text)
