import { Link } from 'react-router-dom'
import { 
  ArrowRightIcon, 
  CheckIcon,
  StarIcon,
  HeartIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

const Home = () => {
  const features = [
    {
      name: 'Premium Quality',
      description: 'High-quality materials designed for performance and durability.',
      icon: StarIcon,
    },
    {
      name: 'Comfort First',
      description: 'Ergonomic designs that move with your body during workouts.',
      icon: HeartIcon,
    },
    {
      name: 'Performance Ready',
      description: 'Engineered for athletes who demand the best from their gear.',
      icon: BoltIcon,
    },
  ]

  const categories = [
    {
      name: 'Men\'s Apparel',
      description: 'Performance wear for men',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
      href: '/products?category=men'
    },
    {
      name: 'Women\'s Apparel',
      description: 'Stylish and functional women\'s fitness wear',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
      href: '/products?category=women'
    },
    {
      name: 'Accessories',
      description: 'Essential fitness accessories',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
      href: '/products?category=accessories'
    },
    {
      name: 'Footwear',
      description: 'High-performance athletic shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      href: '/products?category=footwear'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Elevate Your Fitness Journey
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Discover premium fitness wear designed for performance, comfort, and style. 
              From workout essentials to professional athletic gear.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Shop Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                Join Our Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FitWear?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the highest quality fitness apparel 
              that helps you perform at your best.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find the perfect gear for your fitness routine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Upgrade Your Workout?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of athletes who trust FitWear for their fitness journey. 
              Get started today and experience the difference.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Explore Our Collection
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

