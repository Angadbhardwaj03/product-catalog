# Product Catalog Backend & Frontend

A scalable, full-stack application built for high-performance browsing of large datasets (200,000+ products).

## Project Overview
This project implements a backend API in Node.js/Express, a PostgreSQL database managed by Prisma, and a React frontend. The primary engineering focus is on **Cursor-based Pagination** and **Database Indexing**, meaning you can seamlessly browse hundreds of thousands of entries without any performance degradation or duplicated items across pages.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon Serverless PostgreSQL recommended)
- **ORM:** Prisma
- **Frontend:** React (Vite)

## Folder Structure
```text
product-catalog/
├── .env
├── package.json
├── server.js
├── app.js
├── prisma/
│   ├── schema.prisma # Model configurations
│   └── seed.js       # Auto-seeds 200,000 records instantly
├── config/
│   └── prisma.js     # Single instance Prisma client
├── routes/
│   └── products.js
├── controllers/
│   └── productController.js
├── services/
│   └── productService.js
└── frontend/         # React SPA
```

## Installation & Setup

1. **Install backend dependencies:**
   ```bash
   npm install
   ```
2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

## Environment Variables
Create a `.env` in the root (already provided as a template). You need to add your PostgreSQL connection URL.
```env
PORT=3000
DATABASE_URL="postgres://user:password@endpoint.neon.tech/neondb?sslmode=require"
```

## Database Setup & Running Migrations
1. Obtain a Neon PostgreSQL URL and set it in `.env`.
2. Push your schema to the DB:
   ```bash
   npx prisma db push
   ```
3. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```

## Seeding 
We seed 200,000 products instantaneously using PostgreSQL's native `generate_series()`. This raw query bypasses ORM overhead to keep seating times to within a couple of seconds.
```bash
node prisma/seed.js
```

## Running the App
Start both servers in split terminals:
- **Backend**: `npm run dev` (starts on port 3000)
- **Frontend**: `cd frontend && npm run dev` (usually starts on port 5173)

## API Documentation
### `GET /products`
Fetches a paginated list of products.
**Query Parameters:**
- `limit`: Number of items to return (default: 20)
- `category`: Filter products by category (Books, Electronics, etc.)
- `cursor`: The `id` of the last item in the previous request. Used to fetch the next page.

**Example Request:**
`GET /products?limit=20&category=Books&cursor=f38c3...`

## Engineering Decisions: Cursor Pagination vs OFFSET
**Why OFFSET is bad:**
When you use `OFFSET X`, the database must compute and skip `X` rows entirely. If `X` is 150000, it scans 150000 skipped rows just to return 20 results. Also, if items are inserted during browsing, `OFFSET` causes items to shift, meaning rows get skipped or duplicated on the frontend.

**Why Cursor Pagination is correct:**
Instead of skipping X items, you tell the database precisely where to start: "Give me the next 20 items where `id < LAST_SEEN_ID` & `updated_at <= LAST_SEEN_DATE`". With indexes, the database finds the exact position instantly (O(log N)), keeping pagination queries lightning-fast deep into the dataset. It completely prevents skipping or duplicating items resulting from real-time inserts because positions are absolute, not relative.

## Deployment
1. **Database:** Deploy on [Neon](https://neon.tech/).
2. **Backend:** Deploy on [Render](https://render.com) as a "Web Service". Supply your `.env` variables and set Start Command to `node server.js`.
3. **Frontend:** Deploy on Render or Vercel. Ensure you change the API URL inside `App.jsx` to match your deployed Render backend domain.

## live demo : https://product-catalog-1-xqsa.onrender.com
## Future Improvements
- Redis caching for high traffic loads.
- JWT-based Auth.
- Full-Text Search on names.
