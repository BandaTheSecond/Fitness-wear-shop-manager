from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum

db = SQLAlchemy()

class UserRole(Enum):
    CUSTOMER = "customer"
    STAFF = "staff"
    ADMIN = "admin"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    role = db.Column(db.Enum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    purchases = db.relationship('Purchase', backref='user', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'address': self.address,
            'role': self.role.value,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    parent_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy=True)
    children = db.relationship('Category', backref=db.backref('parent', remote_side=[id]))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'parent_id': self.parent_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(100))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    payment_terms = db.Column(db.String(100))
    delivery_schedule = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='supplier', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_person': self.contact_person,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'payment_terms': self.payment_terms,
            'delivery_schedule': self.delivery_schedule,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    brand = db.Column(db.String(100))
    size = db.Column(db.String(20))  # XS, S, M, L, XL, XXL
    color = db.Column(db.String(50))
    cost_price = db.Column(db.Numeric(10, 2), nullable=False)
    selling_price = db.Column(db.Numeric(10, 2), nullable=False)
    image_url = db.Column(db.String(500))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    purchase_items = db.relationship('PurchaseItem', backref='product', lazy=True)
    inventory = db.relationship('Inventory', backref='product', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'sku': self.sku,
            'brand': self.brand,
            'size': self.size,
            'color': self.color,
            'cost_price': float(self.cost_price),
            'selling_price': float(self.selling_price),
            'image_url': self.image_url,
            'category_id': self.category_id,
            'supplier_id': self.supplier_id,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'category': self.category.to_dict() if self.category else None,
            'supplier': self.supplier.to_dict() if self.supplier else None
        }

class Purchase(db.Model):
    __tablename__ = 'purchases'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(50))
    payment_status = db.Column(db.String(20), default='pending')
    status = db.Column(db.String(20), default='pending')  # pending, completed, cancelled
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('PurchaseItem', backref='purchase', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_amount': float(self.total_amount),
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'items': [item.to_dict() for item in self.items],
            'user': self.user.to_dict() if self.user else None
        }

class PurchaseItem(db.Model):
    __tablename__ = 'purchase_items'
    
    id = db.Column(db.Integer, primary_key=True)
    purchase_id = db.Column(db.Integer, db.ForeignKey('purchases.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'purchase_id': self.purchase_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'total_price': float(self.total_price),
            'product': self.product.to_dict() if self.product else None
        }

class Inventory(db.Model):
    __tablename__ = 'inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity_in_stock = db.Column(db.Integer, default=0)
    minimum_stock_level = db.Column(db.Integer, default=10)
    maximum_stock_level = db.Column(db.Integer, default=100)
    last_restocked = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'quantity_in_stock': self.quantity_in_stock,
            'minimum_stock_level': self.minimum_stock_level,
            'maximum_stock_level': self.maximum_stock_level,
            'last_restocked': self.last_restocked.isoformat() if self.last_restocked else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'product': self.product.to_dict() if self.product else None,
            'is_low_stock': self.quantity_in_stock <= self.minimum_stock_level,
            'is_out_of_stock': self.quantity_in_stock == 0
        }
