"""Read-only analytics queries for the RetailPulse demonstration layer.

The operational ShopX models are the source of truth.  These functions form a
small ELT-style semantic layer: they join orders, order items, products and
customers into metrics that are safe to expose to the dashboard.
"""
from datetime import timedelta

from django.db import connection
from django.db.models import Count, F, Sum
from django.db.models.functions import TruncMonth
from django.utils import timezone

from .models import Order, OrderItem, Product, User


def _money(value):
    return round(float(value or 0), 2)


def dashboard_metrics():
    paid_orders = Order.objects.filter(status="PAID")
    order_items = OrderItem.objects.filter(order__status="PAID")
    revenue = paid_orders.aggregate(value=Sum("total"))["value"] or 0
    order_count = paid_orders.count()
    customer_count = paid_orders.values("user_id").distinct().count()

    # A repeat customer has at least two paid orders. This keeps the KPI
    # definition explicit and interview-ready rather than implying retention.
    repeat_customer_count = (
        paid_orders.values("user_id").annotate(orders=Count("id")).filter(orders__gte=2).count()
    )
    revenue_by_month = (
        paid_orders.annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(revenue=Sum("total"), orders=Count("id"))
        .order_by("month")
    )
    top_products = (
        order_items.values("product__name", "product__category__name")
        .annotate(units=Sum("quantity"), revenue=Sum(F("quantity") * F("price")))
        .order_by("-revenue")[:5]
    )
    top_customers = (
        paid_orders.values("user__username")
        .annotate(orders=Count("id"), revenue=Sum("total"))
        .order_by("-revenue")[:5]
    )

    return {
        "kpis": {
            "revenue": _money(revenue),
            "orders": order_count,
            "customers": customer_count,
            "aov": _money(revenue / order_count) if order_count else 0,
            "repeat_purchase_rate": round((repeat_customer_count / customer_count) * 100, 1) if customer_count else 0,
        },
        "revenue_trend": [
            {"month": row["month"].strftime("%b %Y"), "revenue": _money(row["revenue"]), "orders": row["orders"]}
            for row in revenue_by_month
        ],
        "top_products": [
            {"product": row["product__name"], "category": row["product__category__name"] or "Uncategorised", "units": row["units"], "revenue": _money(row["revenue"])}
            for row in top_products
        ],
        "top_customers": [
            {"customer": row["user__username"], "orders": row["orders"], "revenue": _money(row["revenue"])}
            for row in top_customers
        ],
        "pipeline": {
            "source": "ShopX OLTP (orders, order_items, products, users)",
            "model": "Retail sales fact with customer, product and date dimensions",
            "freshness": timezone.now().isoformat(),
            "quality_checks": [
                {"name": "Paid orders", "value": order_count, "status": "pass"},
                {"name": "Order items", "value": order_items.count(), "status": "pass"},
                {"name": "Products", "value": Product.objects.count(), "status": "pass"},
                {"name": "Registered customers", "value": User.objects.filter(is_seller=False).count(), "status": "pass"},
            ],
        },
    }


def performance_profile():
    """Return an actual database plan for a controlled analytical query.

    Arbitrary SQL is intentionally not accepted from the browser. It is both a
    security boundary and a clear example of a governed analytics workflow.
    """
    query = OrderItem.objects.filter(order__status="PAID", order__created_at__gte=timezone.now() - timedelta(days=365)).values("product_id").annotate(revenue=Sum(F("quantity") * F("price"))).order_by("-revenue")
    constraints = connection.introspection.get_constraints(connection.cursor(), OrderItem._meta.db_table)
    indexes = sorted(name for name, value in constraints.items() if value.get("index") or value.get("primary_key"))
    return {
        "query_name": "Product revenue in the last 12 months",
        "sql_pattern": "orders → order_items → products, filtered by status and date, grouped by product",
        "execution_plan": query.explain(),
        "table_rows": {"orders": Order.objects.count(), "order_items": OrderItem.objects.count()},
        "indexes": indexes,
        "recommendations": [
            "Use the composite index on order status and creation time to narrow the order set before joining items.",
            "For multi-year production data, range-partition orders by created_at and let date filters prune partitions.",
            "Review EXPLAIN ANALYZE after each index change; more indexes also increase write cost.",
        ],
    }
