import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { apiGetWishlist, apiToggleWishlist } from "@/lib/api";

const WishlistContext = createContext(undefined);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) { setItems([]); return; }
    apiGetWishlist().then(({ data }) => setItems(data)).catch(() => setItems([]));
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) return;
    try {
      const { data } = await apiToggleWishlist(product.id);
      if (data.status === "added") {
        setItems((prev) => [...prev, product]);
      } else {
        setItems((prev) => prev.filter((p) => p.id !== product.id));
      }
    } catch { /* ignore */ }
  };

  const isWishlisted = (productId) => items.some((p) => p.id === productId);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};