import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { apiGetCart, apiAddToCart, apiUpdateCartQty, apiRemoveFromCart } from "@/lib/api";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Normalise backend cart items to frontend shape: { product, quantity }
  const normalise = (backendItems) =>
    backendItems.map((i) => ({
      cartItemId: i.id,
      quantity: i.quantity,
      product: {
        id: i.product_id,
        name: i.product_name,
        price: i.product_price,
        images: [i.product_image],
      },
    }));

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); return; }
    try {
      setLoading(true);
      const { data } = await apiGetCart();
      setItems(normalise(data.items));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      // Local-only fallback if not logged in
      setItems((prev) => {
        const ex = prev.find((i) => i.product.id === product.id);
        if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
        return [...prev, { cartItemId: null, product, quantity }];
      });
      setIsCartOpen(true);
      return;
    }
    try {
      const { data } = await apiAddToCart(product.id, quantity);
      setItems(normalise(data.items));
      setIsCartOpen(true);
    } catch { /* ignore */ }
  };

  const removeFromCart = async (productId) => {
    const item = items.find((i) => i.product.id === productId);
    if (item?.cartItemId) {
      try {
        const { data } = await apiRemoveFromCart(item.cartItemId);
        setItems(normalise(data.items));
      } catch { setItems((p) => p.filter((i) => i.product.id !== productId)); }
    } else {
      setItems((p) => p.filter((i) => i.product.id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    const item = items.find((i) => i.product.id === productId);
    if (item?.cartItemId) {
      try {
        const { data } = await apiUpdateCartQty(item.cartItemId, quantity);
        setItems(normalise(data.items));
      } catch { setItems((p) => p.map((i) => i.product.id === productId ? { ...i, quantity } : i)); }
    } else {
      setItems((p) => p.map((i) => i.product.id === productId ? { ...i, quantity } : i));
    }
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen, loading, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};