from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path("signup/", views.signup_view, name="signup"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("profile/", views.profile, name="profile"),

    # Wallet
    path("wallet/add/", views.wallet_add, name="wallet_add"),

    # Addresses
    path("address/add/", views.add_address, name="add_address"),
    path("address/delete/<int:id>/", views.delete_address, name="delete_address"),

    # Products & Categories
    path("products/", views.product_list, name="products"),
    path("product/<int:id>/", views.product_detail, name="product_detail"),
    path("categories/", views.categories_list, name="categories"),
    path("subcategories/", views.subcategories_list, name="subcategories"),
    path("search/", views.live_search, name="live_search"),

    # Cart
    path("cart/", views.cart_view, name="cart"),
    path("cart/add/<int:id>/", views.add_to_cart, name="add_to_cart"),
    path("cart/update/<int:id>/", views.update_cart_quantity, name="update_cart_quantity"),
    path("cart/remove/<int:id>/", views.remove_from_cart, name="remove_from_cart"),

    # Orders
    path("order/place/", views.place_order, name="place_order"),

    # Seller
    path("seller/", views.seller_dashboard, name="seller"),
    path("seller/add/", views.add_product, name="add_product"),
    path("seller/delete/<int:id>/", views.delete_product, name="delete_product"),
    path("seller/orders/", views.seller_orders, name="seller_orders"),

    # Wishlist
    path("wishlist/", views.wishlist_view, name="wishlist"),
    path("wishlist/<int:id>/", views.toggle_wishlist, name="toggle_wishlist"),
]