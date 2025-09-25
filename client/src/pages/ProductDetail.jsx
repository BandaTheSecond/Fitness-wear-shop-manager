import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productsAPI } from '../utils/api'
import { useCart } from '../contexts/CartContext'
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  StarIcon,
  CheckIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getProduct(id)
      setProduct(response.data.product)
      setSelectedSize(response.data.product.size || '')
      setSelectedColor(response.data.product.color || '')
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      // You could add a toast notification here
    }
  }

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist)
    // You could implement wishlist functionality here
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray', 'Navy', 'Pink']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-400 hover:text-gray-500">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link to="/products" className="text-gray-400 hover:text-gray-500">
                Products
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={product.image_url || 'https://via.placeholder.com/600x600?text=No+Image'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>
            
            {/* Additional Images (if available) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-w-1 aspect-h-1">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/150x150?text=No+Image'}
                    alt={`${product.name} ${i}`}
                    className="w-full h-20 object-cover rounded-md border border-gray-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                  {product.category?.name}
                </span>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">4.5 (128 reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">${product.selling_price}</span>
                <span className="text-lg text-gray-500 line-through">${(product.selling_price * 1.2).toFixed(2)}</span>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  Save 20%
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'Premium quality fitness wear designed for performance and comfort. Made with high-quality materials that provide excellent durability and breathability for your active lifestyle.'}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 text-sm font-medium border rounded-md transition-colors duration-200 ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
              <div className="flex space-x-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-primary-600 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`px-6 py-3 rounded-md font-medium border transition-colors duration-200 flex items-center justify-center ${
                    isInWishlist
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <HeartIcon className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <button className="w-full bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200">
                Buy Now
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Features</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Premium quality materials</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Moisture-wicking technology</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Machine washable</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">30-day return policy</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <TruckIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">2-year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Specifications</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">SKU</dt>
                    <dd className="text-gray-900">{product.sku}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Brand</dt>
                    <dd className="text-gray-900">{product.brand}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Category</dt>
                    <dd className="text-gray-900">{product.category?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Size</dt>
                    <dd className="text-gray-900">{product.size}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Color</dt>
                    <dd className="text-gray-900">{product.color}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Selling Price</dt>
                    <dd className="text-gray-900">${product.selling_price}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Cost Price</dt>
                    <dd className="text-gray-900">${product.cost_price}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Profit Margin</dt>
                    <dd className="text-gray-900">{((product.selling_price - product.cost_price) / product.selling_price * 100).toFixed(1)}%</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

