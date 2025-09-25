import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Suppliers from './pages/Suppliers'
import Sales from './pages/Sales'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Purchases from './pages/Purchases'
import PurchaseDetail from './pages/PurchaseDetail'
import Cart from './pages/Cart'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/inventory" element={
                  <ProtectedRoute requiredRole="staff">
                    <Inventory />
                  </ProtectedRoute>
                } />
                <Route path="/suppliers" element={
                  <ProtectedRoute requiredRole="staff">
                    <Suppliers />
                  </ProtectedRoute>
                } />
                <Route path="/sales" element={
                  <ProtectedRoute requiredRole="staff">
                    <Sales />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute requiredRole="staff">
                    <Reports />
                  </ProtectedRoute>
                } />
                <Route path="/purchases" element={
                  <ProtectedRoute>
                    <Purchases />
                  </ProtectedRoute>
                } />
                <Route path="/purchases/:id" element={
                  <ProtectedRoute>
                    <PurchaseDetail />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
