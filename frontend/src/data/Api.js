const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://read-on-rent.onrender.com/api';

// Token management
const getToken = () => localStorage.getItem('authToken');
const setToken = (token) => localStorage.setItem('authToken', token);
const clearToken = () => localStorage.removeItem('authToken');

// Request helper
const request = async (method, endpoint, data = null, options = {}) => {
  const { auth = false, ...fetchOptions } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
    ...fetchOptions,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    const json = await response.json();

    if (!response.ok) {
      const error = new Error(json.message || 'API Error');
      error.response = { status: response.status, data: json };
      throw error;
    }

    return { status: response.status, data: json };
  } catch (err) {
    if (err.response) throw err;
    throw {
      response: {
        status: 0,
        data: { message: err.message || 'Network error' },
      },
    };
  }
};

export const api = {
  get: (endpoint, options) => request('GET', endpoint, null, options),
  post: (endpoint, data, options) => request('POST', endpoint, data, options),
  put: (endpoint, data, options) => request('PUT', endpoint, data, options),
  delete: (endpoint, options) => request('DELETE', endpoint, null, options),
  setToken,
  getToken,
  clearToken,
};

// Data Normalization Helper for Books
const normalizeBookData = (book) => {
  if (!book) return null;
  
  // 1. Resolve structural ID variance
  const resolvedId = book._id?.$oid || book._id || book.id || String(Math.random());

  // 2. Resolve image URLs with high-quality placeholding fallbacks
  let cover = book.coverImage || book.image || book.cover;
  if (!cover || cover.includes("undefined") || cover === "") {
    cover = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500";
  } else if (!cover.startsWith("http") && !cover.startsWith("data:")) {
    // If backend returns a local path, clean it up against base URL strip out "/api"
    const hostUrl = API_BASE_URL.replace('/api', '');
    cover = `${hostUrl}/${cover.replace(/^\//, '')}`;
  }

  // 3. Resolve stock issues: Force numerical status validation
  let copies = 5; // Default safe buffer stock allocation
  if (typeof book.availableCopies !== "undefined" && book.availableCopies !== null) {
    copies = Number(book.availableCopies);
  } else if (typeof book.stock !== "undefined" && book.stock !== null) {
    copies = Number(book.stock);
  }

  return {
    ...book,
    _id: resolvedId,
    id: resolvedId, // Duplicate to map flawlessly across any legacy component
    coverImage: cover,
    availableCopies: copies,
    rentalPrice7Days: book.rentalPrice7Days || book.price || 99,
    securityDeposit: book.securityDeposit || book.deposit || 199,
  };
};

// ============= AUTH =============
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (name, email, password, phone) =>
  api.post('/auth/register', { name, email, password, phone });

export const getProfile = () => api.get('/users/profile', { auth: true });

export const updateProfile = (payload) => api.put('/users/profile', payload, { auth: true });

export const changePassword = (payload) => api.put('/users/password', payload, { auth: true });

export const verifyAuth = () => api.get('/auth/verify', { auth: true });

// ============= BOOKS =============
export const getBooks = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/books${query ? '?' + query : ''}`);
  
  // Normalize live server arrays cleanly
  const rawArray = res?.data?.data || res?.data || [];
  const cleanArray = Array.isArray(rawArray) ? rawArray.map(normalizeBookData) : [];
  
  return {
    ...res,
    data: { data: cleanArray }
  };
};

export const getBookById = async (id) => {
  const res = await api.get(`/books/${id}`);
  const rawBook = res?.data?.data || res?.data;
  const cleanBook = normalizeBookData(rawBook);
  
  return {
    ...res,
    data: cleanBook
  };
};

// ============= CATEGORIES =============
export const getCategories = () =>
  api.get('/categories');

// ============= CART (Phase 1) =============
export const getCart = () => api.get('/cart', { auth: true });

export const addToCart = (bookId, rentalDuration, quantity = 1) =>
  api.post(
    '/cart/add',
    { bookId, rentalDuration, quantity },
    { auth: true }
  );

export const updateCartQuantity = (bookId, quantity) =>
  api.put(`/cart/${bookId}`, { quantity }, { auth: true });

export const removeFromCart = (bookId) =>
  api.delete(`/cart/${bookId}`, { auth: true });

export const clearCart = () =>
  api.post('/cart/clear', {}, { auth: true });

// ============= CHECKOUT (Phase 2) =============
export const checkout = (orderPayload) =>
  api.post('/cart/checkout', orderPayload, { auth: true });

// ============= ORDERS (Phase 2) =============
export const getOrders = () => api.get('/orders', { auth: true });

export const getOrderById = (orderId) =>
  api.get(`/orders/${orderId}`, { auth: true });

export const trackOrder = (orderId) =>
  api.post(`/orders/${orderId}/track`, {}, { auth: true });

export const cancelOrder = (orderId) =>
  api.post(`/orders/${orderId}/cancel`, {}, { auth: true });

export const requestReturn = (orderId) =>
  api.post(`/orders/${orderId}/return`, {}, { auth: true });

// ============= SERVICEABILITY (Phase 2) =============
export const checkServiceability = (pincode) =>
  api.get(`/serviceability/${pincode}`, { auth: true });

// ============= WISHLIST =============
export const getWishlist = () => api.get('/wishlist', { auth: true });
export const addToWishlist = (bookId) => api.post('/wishlist/add', { bookId }, { auth: true });
export const removeFromWishlist = (bookId) => api.delete(`/wishlist/${bookId}`, { auth: true });
export const checkWishlist = (bookId) => api.get(`/wishlist/${bookId}`, { auth: true });

// ============= REWARDS =============
export const getRewardBalance = () => api.get('/rewards', { auth: true });
export const getRewardHistory = () => api.get('/rewards/history', { auth: true });
export const redeemRewardPoints = (points, orderId) =>
  api.post('/rewards/redeem', { points, orderId }, { auth: true });

// ============= ADMIN =============
export const adminGetUsers = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/admin/users${query ? '?' + query : ''}`, { auth: true });
};
export const adminGetBooks = () => api.get('/admin/books', { auth: true });
export const adminCreateBook = (payload) => api.post('/admin/books', payload, { auth: true });
export const adminUpdateBook = (id, payload) => api.put(`/admin/books/${id}`, payload, { auth: true });
export const adminDeleteBook = (id) => api.delete(`/admin/books/${id}`, { auth: true });
export const adminGetOrders = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/admin/orders${query ? '?' + query : ''}`, { auth: true });
};
export const adminUpdateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status }, { auth: true });
export const adminGetReports = () => api.get('/admin/reports', { auth: true });