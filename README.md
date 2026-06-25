# Product Browsing Backend

A simple backend application built using **Node.js, Express, PostgreSQL, and Prisma** that allows users to browse around **200,000 products**, filter them by category, and paginate through them efficiently.

This project was built as part of a backend assignment to explore database design, efficient pagination, and handling data changes while users are browsing.

---

## Live API

Base URL:

https://backend-7vz8.onrender.com/

Products Endpoint:

https://backend-7vz8.onrender.com/products

**Note:** The application is hosted on Render's free tier. If the service has been inactive for some time, the first request may take around **30-60 seconds** to respond while the server wakes up.

---

## GitHub Repository

https://github.com/Pragathi1249/Backend

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL (Neon)
- Prisma ORM
- Render (Hosting)

---

## Features

### Browse Products
- Browse approximately 200,000 products
- Products are sorted by newest first (`updatedAt DESC`)

### Category Filtering
Products can be filtered by category.

Example:

```bash
GET /products?category=Books
```

### Cursor-Based Pagination
Implemented cursor pagination instead of offset pagination for better performance on large datasets.

Example:

```bash
GET /products?limit=20
```

Next page:

```bash
GET /products?snapshot=<snapshot>&cursor=<nextCursor>
```

### Consistent Pagination During Data Changes
A snapshot timestamp is created when the first page is loaded.

Even if new products are inserted or existing products are updated while a user is browsing:

- Products are not duplicated
- Products are not skipped
- The user sees a consistent view of the data

---

## Database Design

### Product Model

```prisma
model Product {
  id         BigInt   @id @default(autoincrement())
  name       String
  category   String
  price      Decimal
  createdAt  DateTime @default(now())
  updatedAt  DateTime

  @@index([updatedAt(sort: Desc), id(sort: Desc)])
  @@index([category, updatedAt(sort: Desc), id(sort: Desc)])
}
```

Indexes were added to make filtering and pagination efficient.

---

## Product Seed Script

A seed script generates around **200,000 products** with:

- Unique id
- Product name
- Category
- Price
- createdAt
- updatedAt

Products are inserted in batches using Prisma's `createMany()` for better performance instead of inserting one row at a time.

Run:

```bash
npm run seed
```

---

## API Endpoints

### Get Products

```bash
GET /products
```

Response:

```json
{
  "snapshot": "...",
  "nextCursor": "...",
  "count": 20,
  "products": []
}
```

---

### Filter By Category

```bash
GET /products?category=Books
```

---

### Pagination

First page:

```bash
GET /products
```

Next page:

```bash
GET /products?snapshot=<snapshot>&cursor=<nextCursor>
```

---

## Running Locally

### Clone Repository

```bash
git clone https://github.com/Pragathi1249/Backend.git
cd product-browser
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_neon_database_url
PORT=3000
```

### Run Migrations

```bash
npx prisma migrate dev
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Seed Database

```bash
npm run seed
```

### Start Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## Why I Chose This Approach

I chose:

- **PostgreSQL** because it handles large datasets efficiently and supports indexing well.
- **Prisma** because it made database modeling and querying simpler.
- **Cursor pagination** because it performs better than offset pagination on large datasets and avoids issues when data changes during browsing.
- **Snapshot-based pagination** to ensure users do not see duplicate or missing products.

---

## What I Would Improve With More Time

If I had more time, I would:

- Build a small frontend UI
- Add caching for frequently requested queries
- Add monitoring and logging

---

## Use of AI

I used AI mainly as a learning assistant during development. It helped me:

- Understand cursor-based pagination
- Understand snapshot consistency
- Debug Prisma and BigInt serialization issues
- Fix deployment problems on Render

I tested the implementation myself and verified that the APIs worked correctly after making changes.

---

## Project Status

Completed and deployed successfully.

Backend URL:

https://backend-7vz8.onrender.com/products
