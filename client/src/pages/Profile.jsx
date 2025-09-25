import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../contexts/AuthContext'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const profileValidationSchema = Yup.object({
    first_name: Yup.string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters'),
    last_name: Yup.string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
    address: Yup.string()
      .max(500, 'Address must be less than 500 characters')
  })

  const passwordValidationSchema = Yup.object({
    current_password: Yup.string()
      .required('Current password is required'),
    new_password: Yup.string()
      .required('New password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
      .required('Please confirm your password')
  })

  const profileFormik = useFormik({
    initialValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    },
    validationSchema: profileValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true)
      const result = await updateProfile(values)
      
      if (result.success) {
        setMessage('Profile updated successfully!')
        setIsEditing(false)
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(result.error)
        setTimeout(() => setMessage(''), 5000)
      }
      setSubmitting(false)
      setLoading(false)
    }
  })

  const passwordFormik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true)
      const result = await changePassword({
        current_password: values.current_password,
        new_password: values.new_password
      })
      
      if (result.success) {
        setMessage('Password changed successfully!')
        resetForm()
        setShowPasswordForm(false)
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(result.error)
        setTimeout(() => setMessage(''), 5000)
      }
      setSubmitting(false)
      setLoading(false)
    }
  })

  const tabs = [
    { id: 'profile', name: 'Profile Information' },
    { id: 'security', name: 'Security' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-gray-600">Manage your account information and security settings</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      profileFormik.resetForm()
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={profileFormik.handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={profileFormik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={profileFormik.values.first_name}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    } ${profileFormik.touched.first_name && profileFormik.errors.first_name ? 'border-red-300' : ''}`}
                  />
                  {profileFormik.touched.first_name && profileFormik.errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{profileFormik.errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={profileFormik.values.last_name}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    } ${profileFormik.touched.last_name && profileFormik.errors.last_name ? 'border-red-300' : ''}`}
                  />
                  {profileFormik.touched.last_name && profileFormik.errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{profileFormik.errors.last_name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileFormik.values.email}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    } ${profileFormik.touched.email && profileFormik.errors.email ? 'border-red-300' : ''}`}
                  />
                </div>
                {profileFormik.touched.email && profileFormik.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{profileFormik.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileFormik.values.phone}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    } ${profileFormik.touched.phone && profileFormik.errors.phone ? 'border-red-300' : ''}`}
                    placeholder="Enter phone number"
                  />
                </div>
                {profileFormik.touched.phone && profileFormik.errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{profileFormik.errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    name="address"
                    value={profileFormik.values.address}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                    } ${profileFormik.touched.address && profileFormik.errors.address ? 'border-red-300' : ''}`}
                    placeholder="Enter your address"
                  />
                </div>
                {profileFormik.touched.address && profileFormik.errors.address && (
                  <p className="mt-1 text-sm text-red-600">{profileFormik.errors.address}</p>
                )}
              </div>

              {/* Account Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user?.role || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 capitalize"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500"
                  />
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Change Password
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowPasswordForm(false)
                    passwordFormik.resetForm()
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              )}
            </div>

            {showPasswordForm ? (
              <form onSubmit={passwordFormik.handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="current_password"
                      value={passwordFormik.values.current_password}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        passwordFormik.touched.current_password && passwordFormik.errors.current_password ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordFormik.touched.current_password && passwordFormik.errors.current_password && (
                    <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.current_password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="new_password"
                      value={passwordFormik.values.new_password}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        passwordFormik.touched.new_password && passwordFormik.errors.new_password ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordFormik.touched.new_password && passwordFormik.errors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.new_password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      value={passwordFormik.values.confirm_password}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        passwordFormik.touched.confirm_password && passwordFormik.errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordFormik.touched.confirm_password && passwordFormik.errors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.confirm_password}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Update Password
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Password Security</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Keep your account secure by updating your password regularly.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

