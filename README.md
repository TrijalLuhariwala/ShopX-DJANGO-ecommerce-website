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

For production, set `DJANGO_SECRET_KEY`, `EMAIL_HOST_USER`,
`EMAIL_HOST_PASSWORD`, and `DEFAULT_FROM_EMAIL` in the hosting provider's
secret store. Use PostgreSQL rather than SQLite, migrate the indexes, and
restrict the public analytics routes to demo-safe aggregate data or staff.
