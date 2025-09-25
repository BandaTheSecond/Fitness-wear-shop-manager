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
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///fitness_shop.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Import models first to get the db instance
from models import db, User, Product, Category, Supplier, Purchase, PurchaseItem, Inventory

# Initialize extensions with the db from models
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
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

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)

