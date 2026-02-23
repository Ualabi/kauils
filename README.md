# Hamburguesas Kauil

Point-of-sale and ordering web app for a burger restaurant. Customers can browse the menu and place pickup orders; staff manage table tickets from a separate dashboard.

Built with **React + TypeScript + Vite** and **Firebase** (Auth + Firestore).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS |
| Routing | React Router v7 |
| Backend / DB | Firebase Firestore |
| Auth | Firebase Authentication |
| Build | Vite |
| DB scripts | Python 3 + `firebase-admin` |

---

## Getting Started

### 1. Environment variables

Create a `.env` file at the project root:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_TAX_RATE=0.08

# Only needed to run the Python seed scripts
VITE_FIREBASE_SERVICE_ACCOUNT_PATH=path/to/serviceAccount.json
```

### 2. Install and run

```bash
npm install
npm run dev
```

### 3. Seed the database

Visit `/seed` in the browser and click:
- **Seed Menu Items** — writes all products from `menu_products.py` to Firestore
- **Initialize Tables** — creates 12 table documents
- **Create Staff Account** — creates `staff@kauils.com` / `staff123`

Alternatively, run the Python script directly (see [Scripts](#scripts)).

---

## Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page — daily specials + full menu |
| `/signup` | Public | Customer registration |
| `/login` | Public | Login for customers and staff |
| `/menu` | Customer | Interactive menu with cart |
| `/cart` | Customer | Cart review |
| `/checkout` | Customer | Order placement, returns pickup code |
| `/orders` | Customer | Order history |
| `/staff` | Staff | Table overview dashboard |
| `/staff/table/:n` | Staff | Table ticket management |
| `/seed` | Public | Database seeding utilities |

---

## Daily Specials (Landing Page)

The landing page shows two cards that change daily:

- **Pan del Día** — bread of the day (images in `src/images/breads/`)
- **Agua del Día** — water flavor of the day (images in `src/images/waters/`)

To change them, update the two imports at the top of `src/pages/LandingPage.tsx`:

```ts
import breadImage from '../images/breads/p_hierbas.jpg';
import waterImage from '../images/waters/s_guayaba.jpg';
```

Available bread images: `p_arandano`, `p_hierbas`, `p_parmesano`, `p_perejil`
Available water images: `s_guayaba`, `s_mango`, `s_maracuya`, `s_maracuya_2`, `s_piña`

---

## Firebase Database Structure

The app uses **Cloud Firestore** with the following top-level collections:

### `menuItems`

One document per product. Document ID matches the product code (e.g. `b_sencilla`).

```
menuItems/{productId}
  name        string    — "Sencilla"
  basePrice   number    — 90
  category    string    — "burger" | "wings" | "dessert" | "drink" | "extras"
  available   boolean   — true / false
  description string    — long description (empty string if none)
  updatedAt   timestamp
```

Products are defined in `src/scripts/cloudflare/menu_products.py` and pushed to Firestore with `src/scripts/cloudflare/db_update_firebase.py`.

---

### `users`

Created on signup via Firebase Auth + a Firestore write.

```
users/{uid}
  uid             string
  email           string
  displayName     string
  role            string    — "customer" | "staff"
  createdAt       timestamp
  employeeId?     string    — staff only
  assignedTables? number[]  — staff only
```

---

### `orders`

Created when a customer completes checkout. Each order gets a 6-character pickup code.

```
orders/{orderId}
  pickupCode    string    — e.g. "A3F9XZ"
  customerId    string    — Firebase Auth UID
  customerEmail string
  status        string    — "pending" | "preparing" | "ready" | "completed" | "cancelled"
  items         array
    menuItemId      string
    menuItemName    string
    quantity        number
    basePrice       number
    customizations? array
    itemTotal       number
  subtotal      number
  tax           number
  total         number
  createdAt     timestamp
  updatedAt     timestamp
  readyAt?      timestamp
  completedAt?  timestamp
```

---

### `tables`

One document per table. Document ID is the table number as a string (`"1"`, `"2"`, …).

```
tables/{tableNumber}
  tableNumber       number
  status            string    — "available" | "occupied" | "reserved"
  currentTicketId?  string
  assignedStaffId?  string
  lastUpdated       timestamp
```

---

### `tickets`

Created by staff when a dine-in table places an order. Auto-generated Firestore ID.

```
tickets/{ticketId}
  tableNumber   number
  staffId       string    — Firebase Auth UID
  staffName     string
  status        string    — "open" | "closed"
  items         array
    menuItemId  string
    name        string
    price       number
    quantity    number
    addedAt?    timestamp
    addedBy?    string
  subtotal      number
  tax           number
  total         number
  createdAt     timestamp
  updatedAt     timestamp
  closedAt?     timestamp
```

---

## Scripts

Located in `src/scripts/cloudflare/`.

| File | Purpose |
|------|---------|
| `menu_products.py` | Source of truth for all menu items |
| `db_update_firebase.py` | Upserts all products from `menu_products.py` into Firestore `menuItems` |
| `db_update_menu.py` | Legacy — writes products to a Cloudflare D1 (SQLite) database |
| `db_base.py` | Shared Cloudflare D1 connection config |

### Running the Firebase seed script

```bash
cd src/scripts/cloudflare
pip install firebase-admin python-dotenv
python db_update_firebase.py
```

The script uses `set(..., merge=True)` so it is safe to run multiple times — it updates existing documents without overwriting fields not listed in the script.
