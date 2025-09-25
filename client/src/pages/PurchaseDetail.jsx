import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { purchasesAPI } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'

const PurchaseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [purchase, setPurchase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchPurchase()
    }
  }, [id])

  const fetchPurchase = async () => {
    try {
      setLoading(true)
      const response = await purchasesAPI.getPurchase(id)
      
      // The API returns data under 'purchase' key
      const purchaseResponse = response.data.purchase || response.data
      
      // Ensure purchase object has default values for required fields
      const purchaseData = {
        ...purchaseResponse,
        status: purchaseResponse.status || 'pending',
        payment_status: purchaseResponse.payment_status || 'pending'
      }
      setPurchase(purchaseData)
    } catch (err) {
      setError('Failed to fetch purchase details')
      console.error('Error fetching purchase:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Invalid Date'
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800'
    }
    
    // Handle undefined/null status
    if (!status) {
      return (
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
          Unknown
        </span>
      )
    }
    
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getPaymentStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }
    
    // Handle undefined/null status
    if (!status) {
      return (
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
          Unknown
        </span>
      )
    }
    
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !purchase) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">{error || 'Purchase not found'}</div>
        <div className="space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Go Back
          </button>
          <Link to="/purchases" className="btn-primary">
            View All Purchases
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link to="/purchases" className="text-primary-600 hover:text-primary-800">
              ← Back to Purchases
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase #{purchase.id}</h1>
          <p className="text-gray-600 mt-1">Ordered on {formatDate(purchase.created_at)}</p>
        </div>
        <div className="flex space-x-3">
          {getStatusBadge(purchase.status)}
          {getPaymentStatusBadge(purchase.payment_status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {purchase.user?.first_name && purchase.user?.last_name 
                    ? `${purchase.user.first_name} ${purchase.user.last_name}`
                    : purchase.user?.username || 'N/A'
                  }
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">{purchase.user?.email || 'N/A'}</p>
              </div>
              {purchase.user?.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{purchase.user.phone}</p>
                </div>
              )}
              {purchase.user?.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{purchase.user.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {purchase.items && purchase.items.length > 0 ? (
                purchase.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    {item.product?.image_url && (
                      <img 
                        src={item.product.image_url} 
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.product?.name || 'Product'}</h3>
                      <p className="text-sm text-gray-500">SKU: {item.product?.sku || 'N/A'}</p>
                      {item.product?.brand && (
                        <p className="text-sm text-gray-500">Brand: {item.product.brand}</p>
                      )}
                      {item.product?.size && (
                        <p className="text-sm text-gray-500">Size: {item.product.size}</p>
                      )}
                      {item.product?.color && (
                        <p className="text-sm text-gray-500">Color: {item.product.color}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">${item.unit_price} each</p>
                      <p className="text-sm font-medium text-gray-900">${item.total_price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items found for this purchase.</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {purchase.notes && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
              <p className="text-sm text-gray-700">{purchase.notes}</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">${purchase.total_amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">${purchase.total_amount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Payment Method</label>
                <p className="mt-1 text-sm text-gray-900">{purchase.payment_method || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Payment Status</label>
                <div className="mt-1">
                  {getPaymentStatusBadge(purchase.payment_status)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {user?.role === 'staff' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                {purchase.status === 'pending' && (
                  <button className="w-full btn-primary">
                    Mark as Completed
                  </button>
                )}
                {purchase.status !== 'cancelled' && (
                  <button className="w-full btn-secondary">
                    Cancel Order
                  </button>
                )}
                <Link to="/purchases" className="w-full btn-outline block text-center">
                  Back to Purchases
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseDetail
