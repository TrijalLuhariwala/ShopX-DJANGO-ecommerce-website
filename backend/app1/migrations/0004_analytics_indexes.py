# Generated manually because the local Python environment does not include the
# project's REST dependencies needed to run makemigrations.
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("app1", "0003_product_stock_available")]

    operations = [
        migrations.AddIndex(
            model_name="order",
            index=models.Index(fields=["status", "created_at"], name="order_status_created_idx"),
        ),
        migrations.AddIndex(
            model_name="orderitem",
            index=models.Index(fields=["product", "order"], name="item_product_order_idx"),
        ),
    ]
