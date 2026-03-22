import axios from 'axios';

const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const apiSignup = (data) => api.post('/signup/', data);
export const apiLogin = (data) => api.post('/login/', data);
export const apiLogout = () => api.post('/logout/');

// ── Products ──────────────────────────────────────────────────────────────────
export const apiGetProducts = () => api.get('/products/');
export const apiGetProduct = (id) => api.get(`/product/${id}/`);
export const apiGetCategories = () => api.get('/categories/');
export const apiGetSubcategories = (categoryId) =>
  api.get(`/subcategories/${categoryId ? `?category_id=${categoryId}` : ''}`);
export const apiSearch = (q) => api.get(`/search/?q=${q}`);

// ── Cart ──────────────────────────────────────────────────────────────────────
export const apiGetCart = () => api.get('/cart/');
export const apiAddToCart = (productId, quantity = 1) =>
  api.post(`/cart/add/${productId}/`, { quantity });
export const apiUpdateCartQty = (itemId, quantity) =>
  api.post(`/cart/update/${itemId}/`, { quantity });
export const apiRemoveFromCart = (itemId) => api.delete(`/cart/remove/${itemId}/`);

// ── Orders ────────────────────────────────────────────────────────────────────
export const apiPlaceOrder = (addressId) =>
  api.post('/order/place/', { address_id: addressId });

// ── Profile ───────────────────────────────────────────────────────────────────
export const apiGetProfile = () => api.get('/profile/');

// ── Wallet ────────────────────────────────────────────────────────────────────
export const apiTopUpWallet = (amount) => api.post('/wallet/add/', { amount });

// ── Addresses ─────────────────────────────────────────────────────────────────
export const apiAddAddress = (data) => api.post('/address/add/', data);
export const apiDeleteAddress = (id) => api.delete(`/address/delete/${id}/`);

// ── Seller ────────────────────────────────────────────────────────────────────
export const apiGetSellerDashboard = () => api.get('/seller/');
export const apiAddProduct = (formData) =>
  api.post('/seller/add/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const apiDeleteProduct = (id) => api.delete(`/seller/delete/${id}/`);
export const apiGetSellerOrders = () => api.get('/seller/orders/');

// ── Wishlist ──────────────────────────────────────────────────────────────────
export const apiGetWishlist = () => api.get('/wishlist/');
export const apiToggleWishlist = (productId) => api.post(`/wishlist/${productId}/`);

export default api;
