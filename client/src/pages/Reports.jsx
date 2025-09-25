import { useState, useEffect } from 'react'
import { reportsAPI } from '../utils/api'
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales')
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  })
  const [salesReport, setSalesReport] = useState(null)
  const [inventoryReport, setInventoryReport] = useState(null)
  const [profitReport, setProfitReport] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [activeTab, dateRange])

  const fetchReports = async () => {
    try {
      setLoading(true)
      
      if (activeTab === 'sales') {
        const response = await reportsAPI.getSalesReport(dateRange)
        setSalesReport(response.data)
      } else if (activeTab === 'inventory') {
        const response = await reportsAPI.getInventoryReport()
        setInventoryReport(response.data)
      } else if (activeTab === 'profit') {
        const response = await reportsAPI.getProfitReport(dateRange)
        setProfitReport(response.data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const tabs = [
    { id: 'sales', name: 'Sales Report', icon: CurrencyDollarIcon },
    { id: 'inventory', name: 'Inventory Report', icon: CubeIcon },
    { id: 'profit', name: 'Profit Report', icon: ArrowTrendingUpIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Reports & Analytics</h1>
          <p className="text-gray-600">Analyze your business performance and make data-driven decisions</p>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start_date}
                  onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.end_date}
                  onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button
                onClick={fetchReports}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 self-end"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Sales Report */}
              {activeTab === 'sales' && salesReport && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Sales Report</h2>
                    <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600">Total Sales</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {formatCurrency(salesReport.summary.total_sales)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-green-600">Total Orders</p>
                          <p className="text-2xl font-bold text-green-900">
                            {salesReport.summary.total_orders}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-purple-600">Average Order Value</p>
                          <p className="text-2xl font-bold text-purple-900">
                            {formatCurrency(salesReport.summary.average_order_value)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Sales Chart */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Sales</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        {salesReport.daily_sales.map((day) => (
                          <div key={day.date} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{formatDate(day.date)}</span>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-900">{day.orders} orders</span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(day.total)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Products */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              SKU
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity Sold
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Revenue
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {salesReport.top_products.map((product, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.sku}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.total_quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(product.total_revenue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Inventory Report */}
              {activeTab === 'inventory' && inventoryReport && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Inventory Report</h2>
                    <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <CubeIcon className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600">Total Products</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {inventoryReport.summary.total_products}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <ArrowTrendingDownIcon className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-yellow-600">Low Stock</p>
                          <p className="text-2xl font-bold text-yellow-900">
                            {inventoryReport.summary.low_stock_count}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <ArrowTrendingDownIcon className="h-8 w-8 text-red-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-red-600">Out of Stock</p>
                          <p className="text-2xl font-bold text-red-900">
                            {inventoryReport.summary.out_of_stock_count}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-green-600">Inventory Value</p>
                          <p className="text-2xl font-bold text-green-900">
                            {formatCurrency(inventoryReport.summary.total_inventory_value)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Low Stock Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Items</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Current Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Min Level
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {inventoryReport.low_stock_items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.product?.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.quantity_in_stock}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.minimum_stock_level}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  item.quantity_in_stock === 0 
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.quantity_in_stock === 0 ? 'Out of Stock' : 'Low Stock'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Profit Report */}
              {activeTab === 'profit' && profitReport && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Profit Report</h2>
                    <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-green-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-900">
                            {formatCurrency(profitReport.profit_summary.total_revenue)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <ArrowTrendingDownIcon className="h-8 w-8 text-red-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-red-600">Total Cost</p>
                          <p className="text-2xl font-bold text-red-900">
                            {formatCurrency(profitReport.profit_summary.total_cost)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600">Total Profit</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {formatCurrency(profitReport.profit_summary.total_profit)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-purple-600">Profit Margin</p>
                          <p className="text-2xl font-bold text-purple-900">
                            {profitReport.profit_summary.profit_margin}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profit Analysis */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Analysis</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Revenue</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(profitReport.profit_summary.total_revenue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cost of Goods Sold</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(profitReport.profit_summary.total_cost)}
                        </span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Net Profit</span>
                          <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(profitReport.profit_summary.total_profit)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">Profit Margin</span>
                          <span className="text-sm font-medium text-purple-600">
                            {profitReport.profit_summary.profit_margin}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports
