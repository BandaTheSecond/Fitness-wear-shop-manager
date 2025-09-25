# Fitness Wear Shop Management System

A comprehensive full-stack web application for managing a fitness apparel retail business. This system provides inventory management, sales processing, supplier relationships, and detailed reporting capabilities.

## Features

### 🛍️ **Product Management**
- Complete product catalog with detailed information
- Product categories and hierarchical organization
- Size, color, and brand management
- High-quality product images
- SKU tracking and pricing management

### 📦 **Inventory Tracking**
- Real-time stock level monitoring
- Low stock and out-of-stock alerts
- Automated inventory updates on sales
- Restocking functionality
- Stock movement history

### 👥 **User Management**
- Multi-role system (Customer, Staff, Admin)
- Secure authentication with JWT
- Role-based access control
- User profile management
- Password security

### 🏪 **Point of Sale (POS)**
- Quick product search and selection
- Shopping cart functionality
- Multiple payment methods
- Customer information capture
- Receipt generation

### 🚚 **Supplier Management**
- Complete supplier profiles
- Contact information and terms
- Delivery schedules
- Payment terms tracking
- Supplier performance monitoring

### 📊 **Reports & Analytics**
- Sales reports with date filtering
- Inventory status reports
- Profit margin analysis
- Top-selling products
- Dashboard with key metrics

## Technology Stack

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-JWT-Extended** - Authentication
- **Flask-CORS** - Cross-origin resource sharing
- **SQLite** - Database (development)

### Frontend
- **React 19** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Formik + Yup** - Form handling and validation
- **Axios** - HTTP client
- **Heroicons** - Icon library

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-key-here
   DATABASE_URL=sqlite:///fitness_shop.db
   ```

5. **Initialize database and seed data:**
   ```bash
   # For first-time setup (creates tables and adds seed data)
   python seed_data.py
   
   # To completely reset database (WARNING: deletes all data)
   python init_database.py
   ```

6. **Start the Flask server:**
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Database Management

### Seed Data Behavior
- **`seed_data.py`**: Safely creates tables and adds seed data only if the database is empty. This preserves any existing data you've added.
- **`init_database.py`**: Completely resets the database and recreates all tables with seed data. **WARNING: This will delete all existing data.**

### Startup Scripts
The startup scripts (`start.sh` and `start.bat`) automatically run `seed_data.py`, which means:
- ✅ Your custom data (suppliers, products, etc.) will be preserved when restarting
- ✅ Seed data is only added on first run
- ✅ No data loss when restarting the backend

## Default User Accounts

After running the seed script, you can use these accounts:

### Admin Account
- **Username:** `admin`
- **Email:** `admin@fitnesswear.com`
- **Password:** `SecureAdmin2024!`
- **Role:** Administrator

### Staff Account
- **Username:** `staff1`
- **Email:** `staff1@fitnesswear.com`
- **Password:** `SecureStaff2024!`
- **Role:** Staff

### Customer Accounts
- **Username:** `customer1`
- **Email:** `customer1@example.com`
- **Password:** `SecureCustomer2024!`
- **Role:** Customer
- **Username:** `customer2`
- **Email:** `customer2@example.com`
- **Password:** `SecureBuyer2024!`
- **Role:** Customer

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (staff/admin)
- `PUT /api/products/:id` - Update product (staff/admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (staff/admin)
- `PUT /api/categories/:id` - Update category (staff/admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Suppliers
- `GET /api/suppliers` - Get all suppliers (staff/admin)
- `POST /api/suppliers` - Create supplier (staff/admin)
- `PUT /api/suppliers/:id` - Update supplier (staff/admin)
- `DELETE /api/suppliers/:id` - Delete supplier (admin)

### Inventory
- `GET /api/inventory` - Get inventory (staff/admin)
- `POST /api/inventory/:id/restock` - Restock product (staff/admin)
- `GET /api/inventory/alerts` - Get stock alerts (staff/admin)

### Purchases/Sales
- `GET /api/purchases` - Get purchases
- `POST /api/purchases` - Create purchase
- `GET /api/purchases/:id` - Get purchase by ID
- `PUT /api/purchases/:id` - Update purchase (staff/admin)

### Reports
- `GET /api/reports/sales` - Sales report (staff/admin)
- `GET /api/reports/inventory` - Inventory report (staff/admin)
- `GET /api/reports/profit` - Profit report (staff/admin)
- `GET /api/reports/dashboard` - Dashboard data (staff/admin)

## Project Structure

```
fitness-wear-shop-management-system/
├── backend/
│   ├── app.py                 # Flask application
│   ├── models.py             # Database models
│   ├── requirements.txt      # Python dependencies
│   ├── seed_data.py         # Database seeding script
│   └── routes/              # API route modules
│       ├── auth.py
│       ├── products.py
│       ├── categories.py
│       ├── suppliers.py
│       ├── purchases.py
│       ├── inventory.py
│       └── reports.py
├── src/
│   ├── components/          # Reusable React components
│   ├── contexts/           # React contexts (Auth, Cart)
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   └── App.jsx           # Main App component
├── public/               # Static assets
├── package.json         # Node.js dependencies
└── README.md           # This file
```

## Key Features Implementation

### 🔐 **Security**
- JWT-based authentication
- Password hashing with Werkzeug
- Role-based access control
- Input validation and sanitization
- CORS configuration

### 📱 **Responsive Design**
- Mobile-first approach
- Tailwind CSS for styling
- Responsive grid layouts
- Touch-friendly interfaces

### 🎨 **User Experience**
- Intuitive navigation
- Loading states and error handling
- Form validation with real-time feedback
- Search and filtering capabilities
- Pagination for large datasets

### 📈 **Business Intelligence**
- Comprehensive reporting system
- Sales analytics and trends
- Inventory optimization insights
- Profit margin analysis
- Dashboard with key metrics

## Development Notes

### Database
- Uses SQLite for development (easily switchable to PostgreSQL/MySQL)
- SQLAlchemy ORM for database operations
- Automatic migrations with Flask-Migrate
- Sample data seeding for testing

### State Management
- React Context for global state (Auth, Cart)
- Local state for component-specific data
- Persistent cart storage in localStorage

### Error Handling
- Comprehensive error handling in API routes
- User-friendly error messages
- Loading states for better UX
- Form validation with detailed feedback

## Future Enhancements

- [ ] Email notifications for low stock
- [ ] Barcode scanning integration
- [ ] Advanced reporting with charts
- [ ] Multi-location inventory support
- [ ] Customer loyalty program
- [ ] Mobile app development
- [ ] Integration with payment gateways
- [ ] Automated reordering system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.