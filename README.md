# Reseller Tools

A production-ready, minimalist commerce suite built specifically for online resellers (boutiques, apparel, jewelry, and social commerce merchants).

The project contains two complementary layers:
1. **Full-Stack MERN Application** (`client/`, `server/`, `shared/`): Complete merchant platform with authentication, customer CRM, order retention policies, and automated postal address formatting.
2. **Standalone Client-Side Tools** (`_/`): Zero-backend, lightweight tools for rapid customer address intake and compact UPI payment link generation with configurable expiration.

---

## Architecture & Project Structure

```
├── package.json              # Root orchestration (dev, seed, install:all, build)
├── .gitignore                # Comprehensive root ignore rules (env, node_modules, dist)
├── README.md                 # Project documentation
│
├── _/                        # Standalone Client-Side Tools (Zero Backend Required)
│   ├── index.html            # Reseller Modules launcher & WhatsApp message generator
│   ├── address-formatter.html# Delivery address intake with local auto-fill & copy button
│   └── payment_link.html     # Compact UPI link generator with 24h validity & live countdown
│
├── shared/                   # Shared ES Modules (Zero Hardcoding)
│   └── config/
│       ├── urls.js           # Centralized routes, API paths & WhatsApp builders
│       ├── messages.js       # Centralized notification & invitation templates
│       └── payment.js        # Centralized UPI deeplink builder & currency formatters
│
├── server/                   # Backend (Node.js + Express + Mongoose + Zod + JWT)
│   ├── src/
│   │   ├── config/           # Database & environment configuration
│   │   ├── controllers/      # Auth, Business, Customer, Order, Public controllers
│   │   ├── middleware/       # JWT Auth (httpOnly cookie), Zod validator, Rate limiter
│   │   ├── models/           # User, Business, Customer, Order schemas
│   │   ├── routes/           # REST API routes
│   │   ├── scripts/          # Database seed script
│   │   ├── services/         # Order retention cron job & customer sync service
│   │   ├── utils/            # Postal address formatter & crypto token generator
│   │   └── validations/      # Zod request validation schemas
│   ├── .env.example          # Sample environment variables
│   └── index.js              # Server entry point (port 5000)
│
└── client/                   # Frontend (React 18 + Vite + Tailwind CSS)
    ├── src/
    │   ├── api/              # API client interfacing with backend
    │   ├── components/       # Layout, Navbar, StatusBadge, CopyButton, WhatsAppButton
    │   ├── context/          # AuthContext & ToastContext
    │   ├── pages/
    │   │   ├── public/       # LandingPage, LoginPage, RegisterPage, PublicAddressFormatter, PublicOrderPay
    │   │   └── app/          # Dashboard, Profile, Address Formatter, Payment Link, Order Link, Customers
    │   ├── index.css         # Theme styles & typography
    │   └── main.jsx
    ├── index.html            # Typography imports (Plus Jakarta Sans, Inter, JetBrains Mono)
    ├── tailwind.config.js    # Custom minimalist color palette & design tokens
    └── vite.config.js        # Vite dev server with proxy to backend
```

---

## Standalone Tools (`_/`)

Located in the `_/` directory, these standalone HTML utilities can be hosted on GitHub Pages, served statically, or run directly in any browser with zero backend setup.

### 1. Modules Hub (`_/index.html`)
- Central dashboard for standalone reseller utilities.
- Quick WhatsApp invitation sender with customer phone pre-fill.
- **Smart Auto-Fill**: Automatically caches the last entered customer phone number and custom message template in `localStorage`.
- Includes a dedicated "Clear Auto-fill" action to reset defaults.

### 2. Delivery Address Formatter (`_/address-formatter.html`)
- Customer-facing postal address form designed to reduce failed deliveries.
- **On-Click Copy Button**: Formats the address into standard postal delivery format and copies to clipboard with one click:
  ```text
  To,
  [Customer Name]
  H.no: [Address Line 1]
  [Landmark]
  [Address Line 2]
  [City], [State]
  Pin: [PIN Code]
  Ph.no: [Phone Number]
  ```
- **Real-Time Auto-Save**: Address fields continuously persist in `localStorage` so customers never lose input on accidental reloads.
- **Direct WhatsApp Dispatch**: Sends the formatted address directly back to the merchant on WhatsApp.
- **URL Parameter Support**: Pre-populates phone (`?phone=`) or customer name (`?name=`) when launched from an invitation link.

### 3. Compact UPI Payment Link (`_/payment_link.html`)
- Generates ultra-compact payment links for WhatsApp and SMS sharing.
- **Configurable Expiration**: Validity field defaults to **24 hours** (customizable from 1 to 720 hours).
- **Efficient Base36 Encoding**: Stores expiration timestamps in compact base36 epoch seconds (`${price}:${upiId}:${expBase36}:${item}`), adding minimal characters to the URL.
- **Live Expiry Countdown**: Active customer view displays a live badge (`⏱️ Valid for 23h 45m`) that updates every 30 seconds.
- **Expired View (`#expiredView`)**: Automatically disables payment and informs the customer once the link expires, preventing payments for outdated prices or out-of-stock items.
- **Auto-Fill Memory**: Remembers merchant UPI ID, Payee Name, and preferred validity duration in `localStorage`.

---

## Full-Stack MERN Platform

### Core Workflows

1. **Merchant Authentication & Dashboard (`/app`)**:
   - Secure authentication via httpOnly JWT cookies.
   - Real-time metrics: Active orders, confirmed revenue, retention status, and recent activity.

2. **Automated Order Link Flow (`/app/modules/order-link`)**:
   - Merchant enters **only**: Customer Phone, Amount, Item Name.
   - System automatically reuses or creates the customer profile, generates an opaque cryptographically secure `orderToken` (e.g., `K8f92LmQ`), and creates an expiration schedule.
   - Generates 1-click WhatsApp share links.

3. **Customer Order & UPI Payment Flow (`/order/:orderToken`)**:
   - **Step 1 (Address Intake)**: Customer opens link. UPI payment button remains locked until delivery address is confirmed.
   - **Step 2 (Instant Payment)**: Delivery address unlocks the **[Pay via UPI]** button.
   - Clicking opens the customer's UPI app (Google Pay, PhonePe, Paytm, BHIM) with payee name, exact amount, and transaction reference pre-filled.
   - Tracks payment status transitions (`created` → `address_submitted` → `payment_initiated` → `confirmed`).

4. **Customer CRM & Order History (`/app/customers`)**:
   - Customers are uniquely indexed per business by phone: `{ businessId: 1, phone: 1 }`.
   - View past orders, saved shipping addresses, and customer lifetime value.

5. **Configurable Order Retention & Auto-Purge**:
   - Merchants select their retention policy (7, 14, 30, 60, or 90 days).
   - Expired orders are lazily flagged upon access, and an automated background cron job purges expired records periodically.

---

## Centralized Configuration (Zero Hardcoding)

All routes, API paths, notification templates, and payment URI schemes reside in `shared/config/`:

- **`shared/config/urls.js`**: All application routes, API endpoints, public links, and WhatsApp URL builders.
- **`shared/config/messages.js`**: User-facing notification strings and WhatsApp message templates.
- **`shared/config/payment.js`**: UPI payment deep-link builders (`upi://pay?...`) and currency formatters.

---

## Security & Data Privacy

- **Opaque Public Tokens**: Public URLs use cryptographic random tokens (`orderToken`, `businessCode`); database ObjectIds and customer PII are never exposed in URLs.
- **Multi-Tenant Isolation**: Every database query is strictly scoped to `req.business._id`.
- **httpOnly Cookies**: JWT authentication tokens cannot be accessed via client-side JavaScript.
- **Rate Limiting**: Public API routes are guarded against abuse using `express-rate-limit`.
- **Payload Validation**: Strict request validation using Zod schemas on both client and server.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or remote MongoDB Atlas URI)

### 1. Install Dependencies
Install root, server, and client dependencies with a single command:
```bash
npm run install:all
```

### 2. Environment Configuration
Create a `.env` file in `server/` (or copy `.env.example`):
```bash
cp server/.env.example server/.env
```

Default settings in `.env.example`:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/reseller_tools
JWT_SECRET=replace_with_a_secure_random_jwt_secret_in_production
JWT_EXPIRES_IN=7d
PUBLIC_APP_URL=http://localhost:5173
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Seed Demo Database
Populate sample merchant profile, customers, and orders:
```bash
npm run seed
```

**Demo Credentials**:
- **Email**: `dealer@resellertools.com`
- **Password**: `password123`
- **Public Address Formatter**: `http://localhost:5173/address/royal-boutique`

### 4. Start Development Servers
Runs backend (port 5000) and frontend (port 5173) concurrently:
```bash
npm run dev
```

Open `http://localhost:5173` to access the full-stack web application.

To use the standalone zero-backend utilities, simply open any file in `_/` directly in your browser (e.g. `_//index.html`).

---

## REST API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user and business |
| `POST` | `/api/auth/login` | Sign in & receive httpOnly JWT cookie |
| `POST` | `/api/auth/logout` | Clear session cookie |
| `GET` | `/api/auth/me` | Fetch active user & business profile |

### Business Profile
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/business/profile` | Get merchant business profile |
| `PUT` | `/api/business/profile` | Update profile, UPI ID & retention duration |

### Customers
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/customers` | List merchant's customers with order counts |
| `GET` | `/api/customers/:id` | Get customer details and past orders |
| `DELETE` | `/api/customers/:id` | Soft-delete customer and active orders |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Create order (Order Link or Payment Link) |
| `GET` | `/api/orders` | List merchant's orders with lazy expiration check |
| `GET` | `/api/orders/:id` | Get single order details |
| `DELETE` | `/api/orders/:id` | Soft-delete order |
| `POST` | `/api/orders/:id/address` | Attach or update shipping address |

### Public Endpoints (Token-based)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/public/address/:businessCode` | Fetch merchant details for public address form |
| `GET` | `/api/public/order/:orderToken` | Fetch order summary (no internal IDs exposed) |
| `POST` | `/api/public/order/:orderToken/address` | Customer submits delivery address; unlocks UPI |
| `POST` | `/api/public/order/:orderToken/initiate-payment` | Log payment initiation |
