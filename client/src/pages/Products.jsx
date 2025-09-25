import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI, categoriesAPI } from '../utils/api'
import { useCart } from '../contexts/CartContext'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ShoppingCartIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    min_price: '',
    max_price: '',
    size: '',
    color: '',
    brand: '',
    in_stock_only: false
  })
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    pages: 0,
    per_page: 20
  })
  const [showFilters, setShowFilters] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters, pagination.current_page])

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories()
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.current_page,
        per_page: pagination.per_page,
        ...filters
      }
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === false) {
          delete params[key]
        }
      })

      const response = await productsAPI.getProducts(params)
      setProducts(response.data.products)
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        pages: response.data.pages
      }))
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, current_page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category_id: '',
      min_price: '',
      max_price: '',
      size: '',
      color: '',
      brand: '',
      in_stock_only: false
    })
    setPagination(prev => ({ ...prev, current_page: 1 }))
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    // You could add a toast notification here
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray', 'Navy', 'Pink']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
          <p className="text-gray-600">Discover our premium fitness wear collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Search products..."
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category_id}
                    onChange={(e) => handleFilterChange('category_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={filters.min_price}
                      onChange={(e) => handleFilterChange('min_price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Min Price"
                    />
                    <input
                      type="number"
                      value={filters.max_price}
                      onChange={(e) => handleFilterChange('max_price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Max Price"
                    />
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <select
                    value={filters.size}
                    onChange={(e) => handleFilterChange('size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Sizes</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <select
                    value={filters.color}
                    onChange={(e) => handleFilterChange('color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Colors</option>
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {/* In Stock Only */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in_stock_only"
                    checked={filters.in_stock_only}
                    onChange={(e) => handleFilterChange('in_stock_only', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="in_stock_only" className="ml-2 text-sm text-gray-700">
                    In Stock Only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing {products.length} of {pagination.total} products
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <Link to={`/products/${product.id}`}>
                        <div className="aspect-w-1 aspect-h-1">
                          <img
                            src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </Link>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                            {product.category?.name}
                          </span>
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">4.5</span>
                          </div>
                        </div>
                        
                        <Link to={`/products/${product.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-gray-900">
                            ${product.selling_price}
                          </span>
                          {product.size && (
                            <span className="text-sm text-gray-500">Size: {product.size}</span>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center"
                          >
                            <ShoppingCartIcon className="h-4 w-4 mr-1" />
                            Add to Cart
                          </button>
                          <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                            <HeartIcon className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-8 flex items-center justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, current_page: Math.max(1, prev.current_page - 1) }))}
                        disabled={pagination.current_page === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPagination(prev => ({ ...prev, current_page: i + 1 }))}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            pagination.current_page === i + 1
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, current_page: Math.min(prev.pages, prev.current_page + 1) }))}
                        disabled={pagination.current_page === pagination.pages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products

