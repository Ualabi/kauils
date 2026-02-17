from db_base import D1_ENDPOINT, HEADERS
import requests
import json

# ========= SQL =========
SQL_STATEMENTS = """
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    category_id INTEGER NOT NULL,
    description_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES products_category(id),
    FOREIGN KEY (description_id) REFERENCES products_description(id)
);

CREATE TABLE IF NOT EXISTS products_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products_description (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    
INSERT INTO products_category (id, name)
VALUES (0, 'default'), (1, 'burger'), (2, 'wings'), (3, 'drink'), (4, 'dessert'), (5, 'extras');

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
