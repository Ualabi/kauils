from db_base import D1_ENDPOINT, HEADERS
import requests
import json

# ========= SQL =========
SQL_STATEMENTS = """
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS staff_types;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS products_category;
DROP TABLE IF EXISTS products_description;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_items;

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
