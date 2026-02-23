import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
from menu_products import products
import os

load_dotenv()

# ========= CONFIG =========
# Path to your Firebase service account JSON key file
# Download it from: Firebase Console > Project Settings > Service Accounts
SERVICE_ACCOUNT_PATH = os.getenv("VITE_FIREBASE_SERVICE_ACCOUNT_PATH")
print(SERVICE_ACCOUNT_PATH)
cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
firebase_admin.initialize_app(cred)

db = firestore.client()

# ========= HELPERS =========
def clean_description(product):
  raw = product.get('description', '')
  cleaned = raw.replace('\n', ' ').strip()
  while '  ' in cleaned:
    cleaned = cleaned.replace('  ', ' ')
  return cleaned

# ========= UPLOAD =========
menu_ref = db.collection('menuItems')
success = 0
errors = 0

for product in products:
  doc_data = {
    'name':        product['name'],
    'basePrice':   product['price'],
    'category':    product['category'],
    'available':   product['available'],
    'description': clean_description(product),
    'updatedAt':   firestore.SERVER_TIMESTAMP,
  }

  try:
    menu_ref.document(product['id']).set(doc_data, merge=True)
    print(f"✅  {product['id']:25s}  {product['name']}")
    success += 1
  except Exception as e:
    print(f"❌  {product['id']:25s}  {e}")
    errors += 1

# ========= RESULT =========
print(f"\n{success} productos actualizados, {errors} errores")
