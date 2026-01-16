# Buzdealz Wishlist Feature

A production-style full-stack feature demonstrating DB, API, and UI skills for the Buzdealz tech stack.

## 🚀 Features

### Wishlist Functionality
- ✅ Add/remove deals to wishlist from deal cards and detail pages
- ✅ View all wishlisted items at `/wishlist`
- ✅ Best available price display for each deal
- ✅ Deal alert toggle (subscribers only)
- ✅ Graceful handling of expired/disabled deals
- ✅ Basic analytics tracking (add/remove events)

### Technical Implementation
- ✅ **Idempotency**: Duplicate wishlist entries prevented via unique constraint
- ✅ **Role-based access**: Non-subscribers can add to wishlist but cannot enable alerts
- ✅ **Validation**: Zod schemas for all API inputs
- ✅ **Type safety**: Full TypeScript on frontend and backend

## 📦 Tech Stack

### Frontend
- React 19 + TypeScript
- TanStack Query (React Query) for data fetching
- Wouter for routing
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Express.js with TypeScript
- Drizzle ORM with SQLite (better-sqlite3)
- Zod for validation
- JWT for authentication

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Run database migrations and seed data:**
   ```bash
   cd server
   npm run db:migrate
   npx tsx src/seed.ts
   ```

3. **Install client dependencies:**
   ```bash
   cd client/Buzdealz
   npm install tailwindcss @tailwindcss/vite @tanstack/react-query wouter lucide-react
   ```

4. **Start the server:**
   ```bash
   cd server
   npm run dev
   ```

5. **Start the client (in a new terminal):**
   ```bash
   cd client/Buzdealz
   npm run dev
   ```

6. **Open the app:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 🧪 Testing

### Demo Accounts

| Type | Email | Password |
|------|-------|----------|
| Regular User | user@example.com | password123 |
| Subscriber | subscriber@example.com | password123 |

### Test Scenarios

#### 1. Wishlist Add/Remove
1. Login with demo account
2. Click heart icon on any deal card
3. Verify deal appears in `/wishlist`
4. Click heart again to remove
5. Verify deal is removed from wishlist

#### 2. Idempotency Check
1. Add a deal to wishlist
2. Try to add the same deal again
3. Verify no duplicate entry (returns success without error)

#### 3. Subscriber-Only Alerts
1. Login as **regular user** (user@example.com)
2. Add deal to wishlist
3. Try to enable alerts → Should be blocked/disabled
4. Login as **subscriber** (subscriber@example.com)
5. Enable alerts → Should work

#### 4. Expired/Disabled Deals
1. View deals page → Notice some deals marked as "Expired" or "Unavailable"
2. Add expired deal to wishlist
3. View wishlist → Expired deals shown in separate section with clear status

#### 5. Best Price Display
1. View deals with "Best Price" badge
2. Add to wishlist
3. Verify best available price shown on wishlist page

### API Testing (cURL examples)

```bash
# Health check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get wishlist (replace TOKEN)
curl http://localhost:3001/api/wishlist \
  -H "Authorization: Bearer TOKEN"

# Add to wishlist (replace TOKEN and DEAL_ID)
curl -X POST http://localhost:3001/api/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"dealId":"DEAL_ID"}'

# Remove from wishlist (replace TOKEN and DEAL_ID)
curl -X DELETE http://localhost:3001/api/wishlist/DEAL_ID \
  -H "Authorization: Bearer TOKEN"
```

## 📁 Project Structure

```
Task/
├── client/
│   └── Buzdealz/
│       └── src/
│           ├── components/
│           │   ├── AlertToggle.tsx      # Alert toggle for subscribers
│           │   ├── DealCard.tsx         # Deal card with wishlist button
│           │   ├── Navbar.tsx           # Navigation bar
│           │   └── WishlistButton.tsx   # Heart button component
│           ├── hooks/
│           │   ├── useDeals.ts          # React Query hooks for deals
│           │   └── useWishlist.ts       # React Query hooks for wishlist
│           ├── lib/
│           │   ├── api.ts               # API client
│           │   └── auth.tsx             # Auth context
│           ├── pages/
│           │   ├── DealDetailsPage.tsx  # Deal details view
│           │   ├── HomePage.tsx         # Deals listing
│           │   ├── LoginPage.tsx        # Login/Register
│           │   └── WishlistPage.tsx     # Wishlist view
│           ├── types/
│           │   └── index.ts             # TypeScript types
│           └── App.tsx                  # Main app with routing
├── server/
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts                 # Database connection
│   │   │   ├── migrate.ts               # Migration script
│   │   │   └── schema.ts                # Drizzle schema
│   │   ├── middleware/
│   │   │   ├── auth.ts                  # JWT authentication
│   │   │   └── roles.ts                 # Role-based access
│   │   ├── routes/
│   │   │   ├── auth.ts                  # Auth endpoints
│   │   │   ├── deals.ts                 # Deals endpoints
│   │   │   └── wishlist.ts              # Wishlist CRUD
│   │   ├── services/
│   │   │   └── analytics.ts             # Analytics tracking
│   │   ├── validators/
│   │   │   └── wishlist.ts              # Zod schemas
│   │   ├── index.ts                     # Express server
│   │   └── seed.ts                      # Database seeder
│   └── package.json
└── README.md
```

## 📊 Database Schema

### Users
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (UUID) | Primary key |
| email | TEXT | Unique email |
| name | TEXT | Display name |
| password | TEXT | Hashed password |
| is_subscriber | BOOLEAN | Premium status |
| created_at | TIMESTAMP | Creation date |

### Deals
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (UUID) | Primary key |
| title | TEXT | Deal title |
| description | TEXT | Description |
| image_url | TEXT | Product image |
| original_price | REAL | Original price |
| current_price | REAL | Current price |
| best_price | REAL | Best available price |
| retailer | TEXT | Store name |
| product_url | TEXT | External link |
| status | TEXT | active/expired/disabled |
| expires_at | TIMESTAMP | Expiration date |
| created_at | TIMESTAMP | Creation date |

### Wishlist
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (UUID) | Primary key |
| user_id | TEXT (FK) | User reference |
| deal_id | TEXT (FK) | Deal reference |
| alert_enabled | BOOLEAN | Alert preference |
| created_at | TIMESTAMP | Addition date |
| **UNIQUE** | (user_id, deal_id) | Prevents duplicates |

### Analytics Events
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (UUID) | Primary key |
| user_id | TEXT | User reference |
| deal_id | TEXT | Deal reference |
| action | TEXT | wishlist_add/wishlist_remove |
| created_at | TIMESTAMP | Event time |

## 🔒 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/wishlist | Required | Get user's wishlist with deal info |
| POST | /api/wishlist | Required | Add deal to wishlist (idempotent) |
| PATCH | /api/wishlist/:dealId | Required | Update alert settings |
| DELETE | /api/wishlist/:dealId | Required | Remove from wishlist |
| GET | /api/deals | Optional | List all deals |
| GET | /api/deals/:id | Optional | Get deal details |
| POST | /api/auth/login | None | User login |
| POST | /api/auth/register | None | User registration |

## ⚡ Edge Cases Handled

1. **Duplicate wishlist entries** → Returns success without creating duplicate (idempotent)
2. **Non-subscriber enabling alerts** → Request blocked with 403
3. **Adding non-existent deal** → Returns 404
4. **Removing non-existent wishlist item** → Returns 404
5. **Expired deals** → Shown with "Expired" badge, still viewable in wishlist
6. **Disabled deals** → Shown with "Unavailable" badge
7. **Unauthenticated wishlist access** → Returns 401
8. **Invalid deal ID format** → Validation error with details
