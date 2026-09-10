"""Load deterministic retail demo data for the hosted portfolio application."""
from datetime import timedelta
from random import Random

from django.core.management.base import BaseCommand
from django.utils import timezone

from app1.models import Address, Cart, Category, Order, OrderItem, Product, SubCategory, User, Wallet


class Command(BaseCommand):
    help = "Create a realistic, idempotent RetailPulse retail dataset."

    def add_arguments(self, parser):
        parser.add_argument("--orders", type=int, default=240, help="Number of paid orders to create (default: 240).")

    def handle(self, *args, **options):
        if Order.objects.exists():
            self.stdout.write(self.style.WARNING("Orders already exist; demo seed skipped."))
            return

        rng = Random(20260910)
        seller, _ = User.objects.get_or_create(username="retailpulse_demo_seller", defaults={"is_seller": True, "email": "seller@retailpulse.demo"})
        seller.is_seller = True
        seller.set_password("DemoSeller123!")
        seller.save()
        Wallet.objects.get_or_create(user=seller)

        catalog = {
            "Electronics": [("Audio", [("Pulse Wireless Earbuds", 2499), ("Orbit Bluetooth Speaker", 1899)]), ("Wearables", [("Nova Smartwatch", 4299), ("FitTrack Band", 1599)])],
            "Home": [("Kitchen", [("Brew Coffee Press", 1199), ("Blend Pro Mixer", 2699)]), ("Decor", [("Aura Table Lamp", 1399), ("Terra Planter", 799)])],
            "Fashion": [("Apparel", [("Everyday Hoodie", 1499), ("Linen Shirt", 1299)]), ("Accessories", [("Canvas Carry Bag", 699), ("Classic Cap", 499)])],
        }
        products = []
        for category_name, subcategories in catalog.items():
            category, _ = Category.objects.get_or_create(name=category_name)
            for subcategory_name, product_specs in subcategories:
                subcategory, _ = SubCategory.objects.get_or_create(category=category, name=subcategory_name)
                for name, price in product_specs:
                    product, _ = Product.objects.get_or_create(
                        seller=seller, name=name,
                        defaults={"price": price, "description": f"RetailPulse demo product: {name}.", "category": category, "subcategory": subcategory, "stock_available": 500, "discount_percent": rng.choice([0, 5, 10])},
                    )
                    products.append(product)

        cities = [("Mumbai", "Maharashtra"), ("Bengaluru", "Karnataka"), ("Delhi", "Delhi"), ("Pune", "Maharashtra"), ("Ahmedabad", "Gujarat")]
        customers = []
        for number in range(1, 61):
            user, _ = User.objects.get_or_create(username=f"customer_{number:03d}", defaults={"email": f"customer{number:03d}@retailpulse.demo"})
            user.set_password("DemoCustomer123!")
            user.save()
            Wallet.objects.get_or_create(user=user, defaults={"balance": 50000})
            city, state = cities[number % len(cities)]
            address, _ = Address.objects.get_or_create(user=user, defaults={"full_name": f"Demo Customer {number}", "phone": f"90000{number:05d}", "street": f"{number} Market Road", "city": city, "state": state, "pincode": f"400{number:03d}"})
            Cart.objects.get_or_create(user=user)
            customers.append((user, address))

        now = timezone.now()
        for order_number in range(options["orders"]):
            user, address = customers[order_number % len(customers)]
            chosen = rng.sample(products, k=1 if rng.random() < 0.72 else 2)
            line_items = [(product, rng.randint(1, 3)) for product in chosen]
            total = sum(product.price * quantity for product, quantity in line_items)
            order = Order.objects.create(user=user, address=address, total=total, payment_method=rng.choice(["WALLET", "CARD", "UPI"]), status="PAID")
            # auto_now_add cannot be supplied on create, so set a realistic
            # historical timestamp immediately after the transaction is made.
            Order.objects.filter(pk=order.pk).update(created_at=now - timedelta(days=rng.randint(0, 180), hours=rng.randint(0, 23)))
            for product, quantity in line_items:
                OrderItem.objects.create(order=order, product=product, seller=seller, quantity=quantity, price=product.price)

        self.stdout.write(self.style.SUCCESS(f"Created {options['orders']} paid orders, {len(products)} products and {len(customers)} customers."))
