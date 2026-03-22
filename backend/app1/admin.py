from django.contrib import admin
from .models import *
admin.site.register(User)
admin.site.register(Wallet)
admin.site.register(Address)
admin.site.register(Category)
admin.site.register(SubCategory)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)