# ShopX RetailPulse AI

ShopX is an e-commerce application extended with **RetailPulse AI**, a retail
analytics and governed query-intelligence layer designed for SQL-heavy data
analyst/data engineering roles.

## What the project demonstrates

- **Operational → analytical modelling:** paid orders and order items are
  joined into a retail sales fact with customer, product and date dimensions.
- **Business analytics:** revenue, AOV, repeat-purchase rate, monthly trends,
  top products and top customers.
- **Data quality visibility:** source, model, freshness and row-count checks
  are surfaced in the application rather than hidden in a notebook.
- **SQL performance:** index-backed access paths and a real `EXPLAIN` plan for
  a controlled product-revenue query. Arbitrary browser SQL is deliberately
  not executed.
- **Reliable transactions:** checkout validates stock and runs wallet debit,
  order creation, stock decrement and cart clearing atomically.

## Run locally

Backend (Python 3.10+):

```bash
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_retail_demo
python manage.py runserver
```

Frontend (Node 18+):

```bash
cd frontend
npm install
npm run dev
```

Open the app and visit `/analytics`. The Vite dev server proxies API requests
to the Django server.

## Deployment notes

For production, set `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`,
`CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `EMAIL_HOST_USER`,
`EMAIL_HOST_PASSWORD`, and `DEFAULT_FROM_EMAIL` in the hosting provider's
secret store. The included `render.yaml` creates a PostgreSQL-backed Django
service. Deploy `frontend/` separately on Vercel, set `VITE_API_URL` to the
Render API URL ending in `/api`, and add the Vercel URL to Render's CORS and
CSRF environment variables. `frontend/vercel.json` preserves React routes on
direct page refreshes.

Uploaded media is local storage by default; add Cloudinary or S3 before relying
on user uploads in production.

The `seed_retail_demo` command creates deterministic products, customers and
240 paid orders on an empty database, and safely skips databases that already
contain orders. It powers the hosted analytics demonstration without committing
local database files.
