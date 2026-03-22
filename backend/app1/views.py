from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import CustomTokenObtainPairSerializer
from .models import (
    User, Wallet, Address, Category, SubCategory,
    Product, ProductImage, Cart, CartItem, Order, OrderItem, Wishlist
)


def get_tokens_for_user(user):
    # Use custom serializer so tokens include is_seller, username, email claims
    token = CustomTokenObtainPairSerializer.get_token(user)
    return {
        'refresh': str(token),
        'access': str(token.access_token),
    }


def product_to_dict(product):
    images = [
        settings.MEDIA_URL + str(img.image)
        for img in product.images.all()
    ]
    return {
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'discount_percent': product.discount_percent,
        'description': product.description,
        'category': product.category.name if product.category else '',
        'category_id': product.category_id,
        'subcategory': product.subcategory.name if product.subcategory else '',
        'subcategory_id': product.subcategory_id,
        'stock_available': product.stock_available,
        'created_at': str(product.created_at),
        'images': images,
        'seller': {
            'id': product.seller_id,
            'username': product.seller.username,
        }
    }


# ── Auth ─────────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    data = request.data
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    email = data.get('email', '').strip()
    is_seller = bool(data.get('is_seller', False))

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)

    if email and User.objects.filter(email=email).exists():
        return Response({'error': 'Email already in use'}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        is_seller=is_seller
    )
    Wallet.objects.create(user=user)

    # send welcome email (fail silently so missing config doesn't break signup)
    try:
        send_mail(
            subject="Welcome to ShopX 🎉",
            message=f"Hi {user.username},\n\nYour account has been created successfully.\n\nWelcome to ShopX!\nHappy Shopping 🚀",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email] if user.email else [],
            fail_silently=True,
        )
    except Exception:
        pass

    tokens = get_tokens_for_user(user)
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_seller': user.is_seller,
        },
        **tokens
    }, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    data = request.data
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid credentials'}, status=401)

    tokens = get_tokens_for_user(user)
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_seller': user.is_seller,
        },
        **tokens
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    return Response({'status': 'ok'})


# ── Products / Categories ─────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    products = Product.objects.select_related('category', 'subcategory', 'seller').prefetch_related('images').all()
    return Response([product_to_dict(p) for p in products])


@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail(request, id):
    product = get_object_or_404(
        Product.objects.select_related('category', 'subcategory', 'seller').prefetch_related('images'),
        id=id
    )
    return Response(product_to_dict(product))


@api_view(['GET'])
@permission_classes([AllowAny])
def categories_list(request):
    cats = Category.objects.all()
    return Response([{'id': c.id, 'name': c.name} for c in cats])


@api_view(['GET'])
@permission_classes([AllowAny])
def subcategories_list(request):
    category_id = request.GET.get('category_id')
    qs = SubCategory.objects.all()
    if category_id:
        qs = qs.filter(category_id=category_id)
    return Response([{'id': s.id, 'name': s.name, 'category_id': s.category_id} for s in qs])


@api_view(['GET'])
@permission_classes([AllowAny])
def live_search(request):
    query = request.GET.get('q', '')
    products = Product.objects.filter(name__icontains=query).prefetch_related('images')[:8]
    data = []
    for p in products:
        first_img = p.images.first()
        data.append({
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'image': settings.MEDIA_URL + str(first_img.image) if first_img else '',
        })
    return Response(data)


# ── Cart ─────────────────────────────────────────────────────────────────────

def cart_to_dict(cart):
    items = []
    for item in cart.cartitem_set.select_related('product').prefetch_related('product__images').all():
        first_img = item.product.images.first()
        items.append({
            'id': item.id,
            'product_id': item.product_id,
            'product_name': item.product.name,
            'product_price': item.product.price,
            'product_image': settings.MEDIA_URL + str(first_img.image) if first_img else '',
            'quantity': item.quantity,
        })
    total = sum(i['product_price'] * i['quantity'] for i in items)
    return {'items': items, 'total': total}


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_view(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    return Response(cart_to_dict(cart))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, id):
    product = get_object_or_404(Product, id=id)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    quantity = int(request.data.get('quantity', 1))
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += quantity
    else:
        item.quantity = quantity
    item.save()
    return Response(cart_to_dict(cart))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request, id):
    item = get_object_or_404(CartItem, id=id, cart__user=request.user)
    qty = int(request.data.get('quantity', 1))
    if qty <= 0:
        item.delete()
    else:
        item.quantity = qty
        item.save()
    cart, _ = Cart.objects.get_or_create(user=request.user)
    return Response(cart_to_dict(cart))


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, id):
    item = get_object_or_404(CartItem, id=id, cart__user=request.user)
    item.delete()
    cart, _ = Cart.objects.get_or_create(user=request.user)
    return Response(cart_to_dict(cart))


# ── Orders / Checkout ─────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    try:
        cart = Cart.objects.get(user=request.user)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart is empty'}, status=400)

    items = cart.cartitem_set.select_related('product__seller').all()
    if not items.exists():
        return Response({'error': 'Cart is empty'}, status=400)

    address_id = request.data.get('address_id')
    if not address_id:
        return Response({'error': 'address_id required'}, status=400)

    address = get_object_or_404(Address, id=address_id, user=request.user)

    total = sum(i.product.price * i.quantity for i in items)

    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    if wallet.balance < total:
        return Response({'error': 'Insufficient wallet balance'}, status=400)

    wallet.balance -= total
    wallet.save()

    order = Order.objects.create(
        user=request.user,
        address=address,
        total=total,
        payment_method='WALLET',
        status='PAID'
    )

    for item in items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            seller=item.product.seller,
            quantity=item.quantity,
            price=item.product.price
        )

    cart.cartitem_set.all().delete()

    return Response({
        'order_id': order.id,
        'total': total,
        'status': order.status,
        'address': f"{address.full_name}, {address.street}, {address.city}",
    }, status=201)


# ── Profile ─────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    wallet, _ = Wallet.objects.get_or_create(user=user)
    orders = Order.objects.filter(user=user).order_by('-created_at')
    addresses = Address.objects.filter(user=user)

    orders_data = []
    for o in orders:
        order_items = OrderItem.objects.filter(order=o).select_related('product').prefetch_related('product__images')
        orders_data.append({
            'id': o.id,
            'total': o.total,
            'status': o.status,
            'payment_method': o.payment_method,
            'created_at': str(o.created_at),
            'items': [
                {
                    'product_name': oi.product.name,
                    'quantity': oi.quantity,
                    'price': oi.price,
                    'image': settings.MEDIA_URL + str(oi.product.images.first().image) if oi.product.images.first() else '',
                }
                for oi in order_items
            ]
        })

    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_seller': user.is_seller,
        },
        'wallet': {
            'balance': wallet.balance,
        },
        'orders': orders_data,
        'addresses': [
            {
                'id': a.id,
                'full_name': a.full_name,
                'phone': a.phone,
                'street': a.street,
                'city': a.city,
                'state': a.state,
                'pincode': a.pincode,
            }
            for a in addresses
        ]
    })


# ── Wallet ────────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wallet_add(request):
    amount = float(request.data.get('amount', 0))
    if amount <= 0:
        return Response({'error': 'Invalid amount'}, status=400)

    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    wallet.balance += amount
    wallet.save()
    return Response({'balance': wallet.balance})


# ── Addresses ─────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_address(request):
    data = request.data
    address = Address.objects.create(
        user=request.user,
        full_name=data.get('full_name', ''),
        phone=data.get('phone', ''),
        street=data.get('street', ''),
        city=data.get('city', ''),
        state=data.get('state', ''),
        pincode=data.get('pincode', ''),
    )
    return Response({
        'id': address.id,
        'full_name': address.full_name,
        'phone': address.phone,
        'street': address.street,
        'city': address.city,
        'state': address.state,
        'pincode': address.pincode,
    }, status=201)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_address(request, id):
    addr = get_object_or_404(Address, id=id, user=request.user)
    addr.delete()
    return Response({'status': 'deleted'})


# ── Seller ─────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_dashboard(request):
    if not request.user.is_seller:
        return Response({'error': 'Not a seller'}, status=403)

    products = Product.objects.filter(seller=request.user).select_related('category', 'subcategory').prefetch_related('images')
    order_items = OrderItem.objects.filter(seller=request.user)
    total_orders = order_items.count()
    revenue = sum(i.price * i.quantity for i in order_items)

    return Response({
        'products': [product_to_dict(p) for p in products],
        'stats': {
            'total_orders': total_orders,
            'revenue': revenue,
            'total_products': products.count(),
        }
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product(request):
    if not request.user.is_seller:
        return Response({'error': 'Not a seller'}, status=403)

    data = request.data
    try:
        product = Product.objects.create(
            seller=request.user,
            name=data.get('name'),
            price=float(data.get('price', 0)),
            description=data.get('description', ''),
            category_id=data.get('category_id'),
            subcategory_id=data.get('subcategory_id'),
            stock_available=int(data.get('stock_available', 0)),
            discount_percent=float(data.get('discount_percent', 0)),
        )
    except Exception as e:
        return Response({'error': str(e)}, status=400)

    for img in request.FILES.getlist('images'):
        ProductImage.objects.create(product=product, image=img)

    return Response(product_to_dict(product), status=201)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, id):
    if not request.user.is_seller:
        return Response({'error': 'Not a seller'}, status=403)
    product = get_object_or_404(Product, id=id, seller=request.user)
    product.delete()
    return Response({'status': 'deleted'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_orders(request):
    if not request.user.is_seller:
        return Response({'error': 'Not a seller'}, status=403)

    order_items = OrderItem.objects.filter(seller=request.user).select_related('order', 'product', 'order__user', 'order__address')
    return Response([
        {
            'id': oi.id,
            'order_id': oi.order_id,
            'buyer': oi.order.user.username,
            'product_name': oi.product.name,
            'quantity': oi.quantity,
            'price': oi.price,
            'total': oi.price * oi.quantity,
            'status': oi.order.status,
            'created_at': str(oi.order.created_at),
            'city': oi.order.address.city if oi.order.address else '',
        }
        for oi in order_items
    ])


# ── Wishlist ─────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_wishlist(request, id):
    product = get_object_or_404(Product, id=id)
    obj, created = Wishlist.objects.get_or_create(user=request.user, product=product)
    if not created:
        obj.delete()
        return Response({'status': 'removed'})
    return Response({'status': 'added'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wishlist_view(request):
    items = Wishlist.objects.filter(user=request.user).select_related('product').prefetch_related('product__images')
    return Response([product_to_dict(w.product) for w in items])