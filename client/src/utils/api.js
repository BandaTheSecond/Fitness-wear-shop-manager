import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
}

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products/', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products/', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
}

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get('/categories/'),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories/', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
}

// Suppliers API
export const suppliersAPI = {
  getSuppliers: () => api.get('/suppliers/'),
  getSupplier: (id) => api.get(`/suppliers/${id}`),
  createSupplier: (supplierData) => api.post('/suppliers/', supplierData),
  updateSupplier: (id, supplierData) => api.put(`/suppliers/${id}`, supplierData),
  deleteSupplier: (id) => api.delete(`/suppliers/${id}`),
}

// Purchases API
export const purchasesAPI = {
  getPurchases: (params) => api.get('/purchases/', { params }),
  getPurchase: (id) => api.get(`/purchases/${id}`),
  createPurchase: (purchaseData) => api.post('/purchases/', purchaseData),
  updatePurchase: (id, purchaseData) => api.put(`/purchases/${id}`, purchaseData),
  cancelPurchase: (id) => api.post(`/purchases/${id}/cancel`),
}

// Inventory API
export const inventoryAPI = {
  getInventory: (params) => api.get('/inventory/', { params }),
  getProductInventory: (productId) => api.get(`/inventory/${productId}`),
  createInventory: (inventoryData) => api.post('/inventory/', inventoryData),
  updateInventory: (productId, inventoryData) => api.put(`/inventory/${productId}`, inventoryData),
  restockInventory: (productId, quantity) => api.post(`/inventory/${productId}/restock`, { quantity }),
  getStockAlerts: () => api.get('/inventory/alerts'),
}

// Reports API
export const reportsAPI = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getInventoryReport: () => api.get('/reports/inventory'),
  getProfitReport: (params) => api.get('/reports/profit', { params }),
  getDashboardData: () => api.get('/reports/dashboard'),
}

export default api

