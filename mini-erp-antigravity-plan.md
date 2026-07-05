# Mini ERP – Inventory & Sales Management System
## System Design + Step-by-Step Antigravity Prompts
**For:** Classic IT & Sky Mart Ltd. — Full Stack (MERN) Developer Assessment
**Deadline:** 07 July 2026, 11:30 PM

---

## 1. System Design Overview

### 1.1 Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│   Frontend (React)  │  HTTPS  │  Backend (Express)   │
│  Vite + TS + Router │ ───────▶│  Node + TS + JWT      │
│  Tailwind + shadcn  │◀─────── │  Mongoose ODM         │
│  TanStack Query     │  JSON   │  Multer (image upload)│
└─────────────────────┘         └──────────┬────────────┘
                                            │
                                            ▼
                                   ┌────────────────┐
                                   │   MongoDB Atlas │
                                   └────────────────┘
```

- **Deployment:** Frontend → Vercel. Backend → Render (free tier supports persistent Node servers; Vercel serverless is awkward for Multer file uploads + long DB connections).
- **Image storage:** Since Render's disk is ephemeral, use **Cloudinary free tier** for product image uploads instead of local disk storage (mention this explicitly to Antigravity — this is a common mistake that breaks in production).
- **Database:** MongoDB Atlas free cluster.

### 1.2 Folder Structure (Monorepo, 2 packages)

```
mini-erp/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/          (db.ts, cloudinary.ts, env.ts)
│   │   ├── modules/
│   │   │   ├── auth/        (auth.controller.ts, auth.service.ts, auth.route.ts, auth.validation.ts)
│   │   │   ├── user/
│   │   │   ├── product/
│   │   │   ├── customer/
│   │   │   ├── sale/
│   │   │   └── dashboard/
│   │   ├── middlewares/     (auth.ts, authorize.ts, globalErrorHandler.ts, notFound.ts, upload.ts)
│   │   ├── errors/          (AppError.ts, handlers for CastError, ValidationError, etc.)
│   │   ├── utils/           (catchAsync.ts, sendResponse.ts, QueryBuilder.ts, jwtHelpers.ts)
│   │   └── interfaces/
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/              (store.ts if Redux, or queryClient.ts)
    │   ├── routes/           (ProtectedRoute.tsx, RoleRoute.tsx, router.tsx)
    │   ├── pages/             (Login, Dashboard, Products, ProductForm, Sales, CreateSale)
    │   ├── components/        (ui/ from shadcn, shared/ layout, tables, cards)
    │   ├── features/          (auth/, product/, sale/, dashboard/ — each with api.ts + hooks)
    │   ├── lib/                (axios instance, utils)
    │   └── types/
    └── package.json
```

This "modular feature-based architecture" on both ends directly satisfies one of the **bonus criteria**.

### 1.3 Database Schema (Mongoose)

**User**
```
name, email (unique), password (hashed), role: 'admin'|'manager'|'employee', createdAt
```

**Product**
```
name, sku (unique), category, purchasePrice, sellingPrice, stockQuantity,
image (Cloudinary URL), isDeleted (soft delete flag), createdAt
```

**Customer**
```
name, phone (unique), email?, address?, createdAt
```

**Sale**
```
customer (ref Customer),
items: [{ product: ref Product, quantity, unitPrice, subtotal }],
grandTotal,
createdBy (ref User),
createdAt
```

### 1.4 Role & Permission Matrix

| Action | Admin | Manager | Employee |
|---|---|---|---|
| Manage Products (CRUD) | ✅ | ✅ | View only |
| Manage Customers (CRUD) | ✅ | ✅ | ❌ |
| Create Sales | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ❌ (or read-only, your call) |
| Manage Users/Roles | ✅ | ❌ | ❌ |

For the **bonus "Dynamic Role & Permission Management"**, instead of hardcoding roles in middleware, store a `Permission` collection mapping role → allowed actions, and check against DB in the authorize middleware. This is called out as a separate optional step below (Step 14) — do it only if time allows before the deadline.

### 1.5 API Response Convention (consistency requirement)

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { ... },
  "meta": { "page": 1, "limit": 10, "total": 42 }
}
```

Errors:
```json
{
  "success": false,
  "message": "Insufficient stock for product X",
  "errorDetails": { ... }
}
```

---

## 2. How to Use This With Antigravity

Feed the prompts **one at a time, in order**. After each step:
1. Let Antigravity finish and run the code locally.
2. Test the specific feature before moving to the next prompt.
3. Commit to GitHub with a clear commit message (this builds a clean commit history — reviewers notice this).

Don't paste multiple steps together — smaller steps = fewer hallucinated files and easier debugging.

---

## 3. Step-by-Step Prompts

### STEP 0 — Project Bootstrap
```
Create a monorepo with two folders: "backend" and "frontend".

Backend: Node.js + Express + TypeScript project.
- Initialize with a proper tsconfig.json (target ES2020, strict mode, outDir "dist", rootDir "src").
- Install: express, mongoose, dotenv, cors, jsonwebtoken, bcryptjs, multer, cloudinary,
  multer-storage-cloudinary, zod (for validation), cookie-parser.
- Install dev deps: typescript, ts-node-dev, @types/express, @types/node, @types/cors,
  @types/jsonwebtoken, @types/bcryptjs, @types/multer, @types/cookie-parser.
- Create src/server.ts (connects to MongoDB then starts the HTTP server) and src/app.ts
  (Express app setup: cors, json parser, cookie-parser, route mounting, global error handler, 404 handler).
- Create a .env.example with: PORT, DATABASE_URL, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET.
- Add npm scripts: "dev" (ts-node-dev with respawn), "build" (tsc), "start" (node dist/server.js).
- Set up a modular folder structure: src/modules, src/middlewares, src/errors, src/utils, src/config, src/interfaces.

Frontend: Vite + React + TypeScript project.
- Install: react-router-dom, @tanstack/react-query, axios, tailwindcss, zod, react-hook-form,
  @hookform/resolvers, lucide-react.
- Set up Tailwind CSS properly with the Vite plugin.
- Set up shadcn/ui (init it, and add these components as we'll need them: button, input, card,
  table, dialog, form, select, badge, pagination, sonner for toasts).
- Create the folder structure: src/pages, src/components, src/features, src/lib, src/routes, src/types.
- Create src/lib/axios.ts: an axios instance with baseURL from an env variable VITE_API_URL,
  withCredentials true, and an interceptor stub for attaching auth token.

Show me the final folder tree for both projects when done.
```

### STEP 1 — Backend: Error Handling & Response Utilities Foundation
```
In the backend, before building any feature, set up the shared infrastructure:

1. src/errors/AppError.ts — a custom AppError class extending Error with a statusCode.
2. src/utils/catchAsync.ts — a wrapper for async route handlers so we never repeat try/catch.
3. src/utils/sendResponse.ts — a helper that sends the standardized response shape:
   { success, message, data, meta? }
4. src/middlewares/globalErrorHandler.ts — a single Express error-handling middleware that:
   - Handles Mongoose ValidationError, CastError, duplicate key (11000) errors distinctly with
     proper messages and status codes.
   - Handles our custom AppError.
   - Falls back to 500 for unknown errors, and hides stack traces when NODE_ENV=production.
   - Always responds using the same standardized error shape: { success: false, message, errorDetails }.
5. src/middlewares/notFound.ts — catches unmatched routes and returns a 404 in the standard shape.
6. Wire globalErrorHandler and notFound into app.ts (notFound before error handler, error handler last).

This is our foundation — all future modules will use catchAsync, sendResponse, and AppError,
so make sure these are exported clearly and reusable.
```

### STEP 2 — Backend: Auth Module (JWT + Roles)
```
Build the Auth module in src/modules/auth/ and src/modules/user/.

User model (src/modules/user/user.model.ts):
- fields: name (string, required), email (string, required, unique, lowercase),
  password (string, required, select: false), role (enum: 'admin' | 'manager' | 'employee',
  default 'employee'), createdAt.
- Pre-save hook: hash password with bcryptjs (10 salt rounds) before saving, only if modified.
- Instance method comparePassword(candidate) to compare hashed passwords.

Auth logic (src/modules/auth/):
- POST /api/auth/login — validate body with zod (email, password), find user by email
  (with password field explicitly selected), compare password, if valid generate an
  access token (short-lived, e.g. 1d) and refresh token (long-lived, e.g. 30d) using
  jsonwebtoken, signed with JWT_ACCESS_SECRET / JWT_REFRESH_SECRET from env. Set the
  refresh token as an httpOnly cookie. Return the access token + user info (id, name,
  email, role — never the password) in the response body.
- POST /api/auth/refresh-token — reads refresh token from cookie, verifies it, issues
  a new access token.
- GET /api/auth/me — protected route, returns the currently logged-in user's profile.

Middleware (src/middlewares/):
- auth.ts: extracts Bearer token from Authorization header, verifies it with
  JWT_ACCESS_SECRET, attaches decoded { id, role } to req.user, calls next(). Throws
  AppError(401) if missing/invalid/expired.
- authorize.ts: a higher-order function authorize(...allowedRoles) that checks
  req.user.role is in allowedRoles, else throws AppError(403).

Also create a one-time seed script (src/config/seedAdmin.ts or a small script run via
`npm run seed`) that creates a default admin user (email: admin@miniERP.com,
password: Admin123!) if one doesn't already exist — I'll need this for the
"Admin Login Credentials" submission requirement.

Test all endpoints with realistic requests and confirm token flow works end to end
before moving on.
```

### STEP 3 — Backend: Query Builder Utility (Bonus feature)
```
Create a reusable src/utils/QueryBuilder.ts class that wraps a Mongoose Query and
supports chainable methods:
- search(searchableFields: string[]) — case-insensitive regex search across given fields
  using a `searchTerm` query param.
- filter() — exact-match filtering, excluding reserved query params (searchTerm, sort,
  page, limit, fields).
- sort() — supports a `sort` query param, comma-separated, prefix `-` for descending.
- paginate() — supports `page` and `limit` query params with sensible defaults (page=1, limit=10).
- fields() — optional field limiting via a `fields` query param.
- Also add a static/helper method that returns pagination meta (page, limit, total, totalPages)
  by running a separate countDocuments() with the same filter.

This will be reused by both the Product and Customer modules for search/filter/sort/pagination,
so keep it fully generic (typed with generics if possible).
```

### STEP 4 — Backend: Product Module
```
Build the Product module in src/modules/product/.

Model (product.model.ts):
- name (string, required), sku (string, required, unique), category (string, required),
  purchasePrice (number, required, min 0), sellingPrice (number, required, min 0),
  stockQuantity (number, required, min 0, default 0), image (string, required — Cloudinary URL),
  isDeleted (boolean, default false), timestamps: true.

Image upload:
- Configure src/config/cloudinary.ts using the cloudinary SDK with env credentials.
- Configure src/middlewares/upload.ts using multer + multer-storage-cloudinary to accept
  a single image file (field name "image"), restrict to image mimetypes, max size 5MB.

Routes (all protected by `auth` middleware):
- POST /api/products — authorize('admin','manager') — multer upload.single('image') runs first;
  if no image file present, throw AppError(400, "Product image is required"). Validate body
  with zod, create product.
- GET /api/products — authorize('admin','manager','employee') — use QueryBuilder for search
  (on name, sku, category), filter (category), sort, and pagination. Exclude isDeleted:true.
  Return data + pagination meta.
- GET /api/products/:id — get single product.
- PATCH /api/products/:id — authorize('admin','manager') — allow optional new image upload
  (replace Cloudinary image if a new file is sent), validate body, update.
- DELETE /api/products/:id — authorize('admin','manager') — soft delete (set isDeleted: true),
  don't actually remove the document since Sale history references products.

Add zod validation schemas in product.validation.ts for create and update (update schema
should make all fields optional).

Test image upload with a real image file via Postman/Thunder Client before proceeding.
```

### STEP 5 — Backend: Customer Module
```
Build a simple Customer module in src/modules/customer/ (needed for the Sales module).

Model: name (required), phone (required, unique), email (optional), address (optional), timestamps.

Routes (auth required):
- POST /api/customers — authorize('admin','manager') — create.
- GET /api/customers — authorize('admin','manager','employee') — list with QueryBuilder
  search (name, phone) + pagination, needed for customer selection dropdown in Create Sale.
- GET /api/customers/:id
- PATCH /api/customers/:id — authorize('admin','manager')
- DELETE /api/customers/:id — authorize('admin','manager')

Keep this module intentionally lightweight — it exists to support the Sales module's
"Customer Selection" requirement.
```

### STEP 6 — Backend: Sale Module (core business logic)
```
Build the Sale module in src/modules/sale/. This is the most business-logic-heavy part —
be careful with correctness here.

Model (sale.model.ts):
- customer: ObjectId ref 'Customer', required.
- items: array of { product: ObjectId ref 'Product', quantity: Number, unitPrice: Number,
  subtotal: Number }, required, min length 1.
- grandTotal: Number, required.
- createdBy: ObjectId ref 'User', required.
- timestamps: true.

POST /api/sales (authorize 'admin','manager','employee'):
- Validate body with zod: customer id, items array (each with product id + quantity >= 1).
- Use a MongoDB transaction (mongoose session) so stock deduction and sale creation are atomic:
  1. Start session, startTransaction().
  2. For each item: fetch the product WITHIN the session, check stockQuantity >= requested
     quantity. If not enough stock, abort the transaction and throw AppError(400,
     `Insufficient stock for product ${product.name}`).
  3. Compute unitPrice from product.sellingPrice (don't trust client-sent price), compute
     subtotal = unitPrice * quantity, and accumulate grandTotal.
  4. Decrement each product's stockQuantity by quantity within the session.
  5. Create the Sale document within the session with createdBy = req.user.id.
  6. commitTransaction(), else abortTransaction() on any error, always endSession() in a finally block.
- Return the created sale populated with customer name and product names.

GET /api/sales (authorize 'admin','manager','employee'):
- List sales with QueryBuilder pagination + sort, populate customer and items.product,
  newest first by default.

GET /api/sales/:id — single sale detail, populated.

Note: Mongoose transactions require MongoDB to be a replica set — MongoDB Atlas free tier
already runs as a replica set by default, so this will work once we deploy/connect to Atlas.
If testing locally without a replica set, mention that transactions will fail and we may
need `mongodb-memory-server` with replica set config for local testing, or just test
directly against the Atlas dev cluster.
```

### STEP 7 — Backend: Dashboard Module
```
Build src/modules/dashboard/ with a single endpoint:

GET /api/dashboard/stats (authorize 'admin','manager'):
Run these in parallel with Promise.all for performance:
- totalProducts: Product.countDocuments({ isDeleted: false })
- totalCustomers: Customer.countDocuments()
- totalSales: Sale.countDocuments()
- totalRevenue: aggregate sum of grandTotal across all sales
- lowStockProducts: Product.find({ isDeleted: false, stockQuantity: { $lt: 5 } })
  .select('name sku stockQuantity').limit(10)

Return all of this as a single object: { totalProducts, totalCustomers, totalSales,
totalRevenue, lowStockProducts }.
```

### STEP 8 — Backend: Final Polish (Global Error Handler bonus + API docs)
```
1. Review src/middlewares/globalErrorHandler.ts and make sure it handles: Mongoose
   ValidationError, CastError (invalid ObjectId), duplicate key errors (E11000 — extract
   the duplicate field name and give a friendly message like "SKU already exists"),
   our AppError, JWT errors (JsonWebTokenError, TokenExpiredError → 401 with clear message),
   and a generic fallback.

2. Generate a full API_DOCUMENTATION.md file at the backend root documenting every endpoint:
   method, path, required role, request body shape, and example success + error responses,
   matching our standardized response format. This is one of the required submission deliverables.

3. Double check every mutating route (POST/PATCH/DELETE) has both `auth` and `authorize`
   middleware applied correctly per the permission matrix:
   - Products: create/update/delete → admin, manager. Read → all three roles.
   - Customers: create/update/delete → admin, manager. Read → all three roles.
   - Sales: create → admin, manager, employee. Read → admin, manager, employee.
   - Dashboard → admin, manager only.

4. Add a health check route GET /api/health returning { success: true, message: "Server is running" }.
```

### STEP 9 — Frontend: Auth Setup
```
Build the authentication flow in the frontend.

1. src/features/auth/authApi.ts — functions loginUser(email, password) and getMe(),
   hitting the backend using the shared axios instance.
2. State management: use React Context (AuthContext) holding { user, accessToken,
   isLoading, login(), logout() }, persisting the access token in memory + localStorage
   (for page refresh persistence — acceptable for this assessment scope).
3. src/lib/axios.ts — add a request interceptor that attaches
   `Authorization: Bearer ${token}` from the stored token, and a response interceptor
   that on 401 tries the refresh-token endpoint once then retries, else logs the user out
   and redirects to /login.
4. src/pages/Login.tsx — a clean form (react-hook-form + zod validation) with email/password,
   shows loading state and error toast (use sonner) on failure, redirects to /dashboard on success.
5. src/routes/ProtectedRoute.tsx — redirects to /login if no authenticated user.
6. src/routes/RoleRoute.tsx — wraps ProtectedRoute, additionally checks
   allowedRoles.includes(user.role), else redirects to an "Unauthorized" page or /dashboard
   with a toast message.
7. Set up src/routes/router.tsx with react-router-dom's createBrowserRouter: /login (public),
   and a layout route wrapping /dashboard, /products, /products/new, /products/:id/edit,
   /sales, /sales/new — all behind ProtectedRoute, with role-appropriate ones also behind RoleRoute.

Build a simple shared Layout component with a sidebar (Dashboard, Products, Sales links,
conditionally shown based on role) and a topbar showing the logged-in user's name/role and
a logout button.
```

### STEP 10 — Frontend: Dashboard Page
```
Build src/pages/Dashboard.tsx.

1. src/features/dashboard/dashboardApi.ts — fetch GET /api/dashboard/stats.
2. Use TanStack Query's useQuery to fetch and cache this.
3. UI: 4 stat cards (Total Products, Total Customers, Total Sales, Total Revenue) using
   shadcn Card components, each with an icon from lucide-react.
4. A "Low Stock Products" table/list below showing name, SKU, current stock, with a
   visual warning badge (e.g. red badge) since these are < 5 in stock.
5. Show a loading skeleton state while fetching, and an error state if the request fails.
```

### STEP 11 — Frontend: Products Module
```
Build the full Products feature.

1. src/features/product/productApi.ts — getProducts(params), getProduct(id),
   createProduct(formData), updateProduct(id, formData), deleteProduct(id). Use FormData
   for create/update since we're uploading an image file alongside JSON fields.
2. src/pages/Products.tsx:
   - A table (shadcn Table) listing products: image thumbnail, name, SKU, category,
     selling price, stock quantity (badge red if < 5), actions (edit/delete, hidden for
     employee role).
   - A search input (debounced) wired to the `searchTerm` query param.
   - A category filter dropdown.
   - Pagination controls at the bottom wired to `page`/`limit`.
   - An "Add Product" button (hidden for employee role) linking to /products/new.
   - Delete triggers a confirmation Dialog before calling the API.
3. src/pages/ProductForm.tsx (shared for create + edit):
   - react-hook-form + zod: name, sku, category, purchasePrice, sellingPrice,
     stockQuantity, and an image file input with a live preview.
   - On create, image is required (validate client-side too, not just rely on backend).
   - On edit, prefill existing values and show current image; new image is optional.
   - Use TanStack Query's useMutation, invalidate the products query on success, show
     success/error toast, redirect back to /products on success.
```

### STEP 12 — Frontend: Sales Module
```
Build the Sales feature — this is the most interactive part.

1. src/features/sale/saleApi.ts — getSales(params), createSale(payload).
2. src/features/customer/customerApi.ts — getCustomers(params) (for the dropdown).
3. src/pages/Sales.tsx — a table listing past sales: date, customer name, item count,
   grand total. Paginated.
4. src/pages/CreateSale.tsx:
   - Customer selection: a searchable Select/Combobox (shadcn) populated from
     GET /api/customers, showing name + phone.
   - Product line items: a dynamic list where the user can "Add Product Line", each line
     has a searchable product Select (showing name, SKU, available stock, selling price)
     and a quantity number input.
   - Client-side validation: quantity can't exceed the selected product's current stock
     (show inline warning), quantity must be >= 1, at least one line item required,
     no duplicate product selected twice in the same sale (either block it or auto-merge
     quantities — pick one and be consistent).
   - Auto-calculate and display subtotal per line and a live Grand Total that updates as
     quantities/products change (use useMemo or derived state, no need for extra API calls).
   - On submit: POST to /api/sales, show success toast with the grand total, then either
     redirect to /sales or reset the form for a new sale.
   - Handle backend "insufficient stock" errors gracefully by showing exactly which
     product failed, from the error message.
```

### STEP 13 — Frontend: Final Polish
```
1. Add a global loading spinner/skeletons wherever TanStack Query is fetching.
2. Add a proper 404 page and an "Unauthorized" page (403) for RoleRoute rejections.
3. Add a favicon and a simple app title.
4. Do a full manual QA pass as each of the three roles (create three test users via
   the backend or a quick script: admin/manager/employee) and confirm:
   - Employee cannot see Add/Edit/Delete buttons on Products, and gets redirected if
     they try to hit /products/new directly.
   - Employee cannot access Customers management or Dashboard, per the permission matrix.
   - Manager can do everything except user/role management.
   - Stock correctly decreases after a sale, and selling more than available stock is
     blocked both client-side and server-side.
5. Write frontend README.md and backend README.md separately (setup steps, env vars
   needed, how to run locally, how to seed the admin user, tech stack used) — required
   for the "README (Project Setup & Installation Guide)" submission item.
```

### STEP 14 — OPTIONAL Bonus: Dynamic Role & Permission Management
```
(Only attempt this after everything above is done, tested, and deployed — this is
pure bonus, don't risk the core deliverables for it.)

Refactor the static role checks into a database-driven permission system:
1. New model Permission: { role: string, resource: string, actions: string[] }
   e.g. { role: 'manager', resource: 'product', actions: ['create','read','update','delete'] }.
2. Seed default permissions matching our existing matrix.
3. Replace the static authorize(...allowedRoles) middleware with a new
   authorizeDynamic(resource, action) middleware that looks up the Permission collection
   for req.user.role + resource + action.
4. Add basic CRUD endpoints for Permission management, admin-only, so this is genuinely
   "database-driven" rather than just moved into a differently-shaped hardcoded object.
5. Mention this bonus implementation explicitly in the README so reviewers notice it.
```

### STEP 15 — Deployment
```
1. Backend → Render:
   - Push backend/ to its own GitHub repo (public, per submission requirements).
   - Create a new Web Service on Render pointing to that repo, build command
     `npm install && npm run build`, start command `npm start`.
   - Add all .env variables in Render's dashboard (DATABASE_URL should point to the
     MongoDB Atlas connection string, whitelist 0.0.0.0/0 in Atlas network access for Render).
   - Note the live backend URL, e.g. https://mini-erp-backend.onrender.com.

2. Frontend → Vercel:
   - Push frontend/ to its own public GitHub repo.
   - Import into Vercel, set VITE_API_URL env variable to the live Render backend URL.
   - Update CORS in the backend (app.ts) to allow the deployed Vercel origin.
   - Note the live frontend URL.

3. Final check: open the live frontend URL in an incognito window, log in with the
   seeded admin credentials, and click through every feature once more against the
   live deployment (not localhost) before submitting — CORS or env var mistakes only
   show up here.
```

---

## 4. Submission Checklist (map back to the email's requirements)

| Requirement | Where it comes from |
|---|---|
| Live Frontend URL | Step 15 (Vercel) |
| Live Backend API URL | Step 15 (Render) |
| Frontend GitHub Repo (public) | Step 15 |
| Backend GitHub Repo (public) | Step 15 |
| Admin Login Credentials | Step 2 (seed script) — `admin@miniERP.com` / `Admin123!` (change before sending, but keep it simple) |
| README (setup/installation) | Step 13 |
| API Documentation | Step 8 |

## 5. Timeline Reality Check

Deadline is **07 July, 11:30 PM** — from today (05 July) that's about **2.5 days**. Realistic pacing if working solo with Antigravity assisting:

- **Day 1:** Steps 0–8 (entire backend + deployment-ready).
- **Day 2:** Steps 9–13 (entire frontend).
- **Day 3 (morning/afternoon):** Step 15 deployment, full QA, README/API docs polish, submit with buffer time before 11:30 PM — don't submit at the last minute in case Render/Vercel has a hiccup.

Skip Step 14 (dynamic permissions bonus) unless Steps 0–13 and deployment are solid with time to spare.
