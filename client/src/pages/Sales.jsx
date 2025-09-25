import { useState, useEffect } from 'react'
import { productsAPI, purchasesAPI } from '../utils/api'
import { 
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

const Sales = () => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getProducts({ per_page: 100 })
      setProducts(response.data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.selling_price * item.quantity), 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = async () => {
    try {
      const purchaseData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.selling_price,
          total_price: item.selling_price * item.quantity
        })),
        payment_method: paymentMethod,
        payment_status: 'completed',
        status: 'completed',
        notes: `Customer: ${customerInfo.name}`
      }

      const response = await purchasesAPI.createPurchase(purchaseData)
      
      // Clear cart and reset form
      setCart([])
      setCustomerInfo({ name: '', email: '', phone: '' })
      setShowPaymentModal(false)
      
      // Show success message (you could add a toast notification here)
      alert('Sale completed successfully!')
    } catch (error) {
      console.error('Error processing sale:', error)
      alert('Error processing sale. Please try again.')
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Point of Sale</h1>
          <p className="text-gray-600">Process customer transactions and manage sales</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Search products..."
                  />
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
                      <div className="aspect-w-1 aspect-h-1 mb-2">
                        <img
                          src={product.image_url || 'https://via.placeholder.com/150x150?text=No+Image'}
                          alt={product.name}
                          className="w-full h-20 object-cover rounded"
                        />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900">
                          ${product.selling_price}
                        </span>
                        {product.size && (
                          <span className="text-xs text-gray-500">{product.size}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-primary-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-primary-700 transition-colors duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
                <div className="flex items-center">
                  <ShoppingCartIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{getCartItemCount()} items</span>
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-gray-500 mt-2">Cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <img
                          src={item.image_url || 'https://via.placeholder.com/40x40?text=No+Image'}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">${item.selling_price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <MinusIcon className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <PlusIcon className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full bg-primary-600 text-white py-3 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Purchase</h3>
                
                <div className="space-y-4">
                  {/* Customer Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h4>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Customer name (optional)"
                      />
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Email (optional)"
                      />
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Phone (optional)"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <BanknotesIcon className="h-4 w-4 ml-2 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-700">Cash</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <CreditCardIcon className="h-4 w-4 ml-2 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-700">Card</span>
                      </label>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Order Summary</h4>
                    <div className="space-y-1">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} x{item.quantity}
                          </span>
                          <span className="text-gray-900">
                            ${(item.selling_price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                  >
                    Complete Sale
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sales

