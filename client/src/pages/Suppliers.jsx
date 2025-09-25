import { useState, useEffect } from 'react'
import { suppliersAPI } from '../utils/api'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    payment_terms: '',
    delivery_schedule: ''
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const response = await suppliersAPI.getSuppliers()
      setSuppliers(response.data.suppliers)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSupplier) {
        await suppliersAPI.updateSupplier(editingSupplier.id, formData)
      } else {
        await suppliersAPI.createSupplier(formData)
      }
      setShowModal(false)
      setEditingSupplier(null)
      setFormData({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        payment_terms: '',
        delivery_schedule: ''
      })
      fetchSuppliers()
    } catch (error) {
      console.error('Error saving supplier:', error)
    }
  }

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      payment_terms: supplier.payment_terms || '',
      delivery_schedule: supplier.delivery_schedule || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await suppliersAPI.deleteSupplier(supplierId)
        fetchSuppliers()
      } catch (error) {
        console.error('Error deleting supplier:', error)
      }
    }
  }

  const openModal = () => {
    setEditingSupplier(null)
    setFormData({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      payment_terms: '',
      delivery_schedule: ''
    })
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Suppliers</h1>
              <p className="text-gray-600">Manage your supplier relationships and information</p>
            </div>
            <button
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Suppliers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new supplier.</p>
            <div className="mt-6">
              <button
                onClick={openModal}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Supplier
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">
                        {supplier.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-gray-400 hover:text-primary-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {supplier.contact_person && (
                    <div className="flex items-center text-sm text-gray-600">
                      <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {supplier.contact_person}
                    </div>
                  )}
                  
                  {supplier.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`mailto:${supplier.email}`} className="hover:text-primary-600">
                        {supplier.email}
                      </a>
                    </div>
                  )}
                  
                  {supplier.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`tel:${supplier.phone}`} className="hover:text-primary-600">
                        {supplier.phone}
                      </a>
                    </div>
                  )}
                  
                  {supplier.address && (
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <span>{supplier.address}</span>
                    </div>
                  )}
                  
                  {supplier.payment_terms && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Payment Terms:</span>
                      <span className="text-gray-600 ml-1">{supplier.payment_terms}</span>
                    </div>
                  )}
                  
                  {supplier.delivery_schedule && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Delivery:</span>
                      <span className="text-gray-600 ml-1">{supplier.delivery_schedule}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Added {new Date(supplier.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Terms
                    </label>
                    <input
                      type="text"
                      value={formData.payment_terms}
                      onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Net 30, COD, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Schedule
                    </label>
                    <input
                      type="text"
                      value={formData.delivery_schedule}
                      onChange={(e) => setFormData({ ...formData, delivery_schedule: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Weekly, Bi-weekly, etc."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                    >
                      {editingSupplier ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Suppliers

