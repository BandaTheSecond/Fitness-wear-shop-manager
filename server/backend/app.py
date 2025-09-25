from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
# Configure database URI - use SQLite for both development and production
if os.getenv('FLASK_ENV') == 'production':
    # For production on Render, use the instance folder in the project directory
    instance_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
    os.makedirs(instance_path, exist_ok=True)
    db_path = os.path.join(instance_path, 'fitness_shop.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
else:
    # For development, use the instance folder
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.instance_path, 'fitness_shop.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Import models first to get the db instance
from models import db, User, Product, Category, Supplier, Purchase, PurchaseItem, Inventory

# Initialize extensions with the db from models
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
# Configure CORS for production
if os.getenv('FLASK_ENV') == 'production':
    CORS(app, 
         origins=[
             os.getenv('FRONTEND_URL', 'https://fitness-wear-shop-manager-bnrd.vercel.app'),
             'https://fitness-wear-shop-manager-bnrd.vercel.app'  # Fallback for your actual frontend URL
         ],
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         supports_credentials=True)
else:
    CORS(app, 
         origins=['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:3000'],
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         supports_credentials=True)

# Import routes
from routes.auth import auth_bp
from routes.products import products_bp
from routes.categories import categories_bp
from routes.suppliers import suppliers_bp
from routes.purchases import purchases_bp
from routes.inventory import inventory_bp
from routes.reports import reports_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(categories_bp, url_prefix='/api/categories')
app.register_blueprint(suppliers_bp, url_prefix='/api/suppliers')
app.register_blueprint(purchases_bp, url_prefix='/api/purchases')
app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
app.register_blueprint(reports_bp, url_prefix='/api/reports')

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Fitness Wear Shop API is running'})

@app.route('/api/debug')
def debug_info():
    """Debug endpoint to check JWT configuration and database status"""
    try:
        # Check if database is accessible
        from models import User
        user_count = User.query.count()
        
        return jsonify({
            'status': 'debug_info',
            'jwt_secret_configured': bool(app.config.get('JWT_SECRET_KEY')),
            'database_accessible': True,
            'user_count': user_count,
            'flask_env': os.getenv('FLASK_ENV', 'development')
        })
    except Exception as e:
        return jsonify({
            'status': 'debug_info',
            'jwt_secret_configured': bool(app.config.get('JWT_SECRET_KEY')),
            'database_accessible': False,
            'error': str(e),
            'flask_env': os.getenv('FLASK_ENV', 'development')
        })

# JWT Error Handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Token has expired'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'error': 'Invalid token'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'error': 'Authorization token is required'}), 401

@jwt.needs_fresh_token_loader
def token_not_fresh_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Fresh token required'}), 401

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Token has been revoked'}), 401

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(422)
def unprocessable_entity(error):
    return jsonify({'error': 'Unprocessable entity - validation failed'}), 422

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

