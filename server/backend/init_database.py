#!/usr/bin/env python3
"""
Database initialization script for Fitness Wear Shop Management System
This script completely resets the database and populates it with seed data.
Use this only when you want to start fresh and lose all existing data.
"""

import os
import sys
from datetime import datetime, timedelta
from decimal import Decimal
import random
from werkzeug.security import generate_password_hash

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import User, Product, Category, Supplier, Purchase, PurchaseItem, Inventory, UserRole

def init_database():
    """Initialize database from scratch - THIS WILL DELETE ALL EXISTING DATA"""
    
    with app.app_context():
        # Clear existing data
        print("⚠️  WARNING: This will delete ALL existing data!")
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()
        
        # Create categories
        print("Creating categories...")
        categories_data = [
            {"name": "Men's Apparel", "description": "Fitness wear for men"},
            {"name": "Women's Apparel", "description": "Fitness wear for women"},
            {"name": "Footwear", "description": "Athletic shoes and sneakers"},
            {"name": "Accessories", "description": "Fitness accessories and gear"},
            {"name": "Men's Tops", "description": "Shirts, tanks, and jackets for men", "parent_id": 1},
            {"name": "Men's Bottoms", "description": "Shorts, pants, and leggings for men", "parent_id": 1},
            {"name": "Women's Tops", "description": "Shirts, tanks, and jackets for women", "parent_id": 2},
            {"name": "Women's Bottoms", "description": "Shorts, pants, and leggings for women", "parent_id": 2},
        ]
        
        categories = []
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.session.add(category)
            categories.append(category)
        
        db.session.commit()
        
        # Create suppliers
        print("Creating suppliers...")
        suppliers_data = [
            {
                "name": "FitGear Pro",
                "contact_person": "John Smith",
                "email": "john@fitgearpro.com",
                "phone": "+1-555-0101",
                "address": "123 Fitness Ave, Sport City, SC 12345",
                "payment_terms": "Net 30",
                "delivery_schedule": "Weekly"
            },
            {
                "name": "AthleticWear Co",
                "contact_person": "Sarah Johnson",
                "email": "sarah@athleticwear.com",
                "phone": "+1-555-0102",
                "address": "456 Athletic Blvd, Fitness Town, FT 67890",
                "payment_terms": "Net 15",
                "delivery_schedule": "Bi-weekly"
            },
            {
                "name": "SportStyle Ltd",
                "contact_person": "Mike Davis",
                "email": "mike@sportstyle.com",
                "phone": "+1-555-0103",
                "address": "789 Sport St, Active City, AC 11111",
                "payment_terms": "Net 45",
                "delivery_schedule": "Monthly"
            },
            {
                "name": "GymWear Solutions",
                "contact_person": "Lisa Brown",
                "email": "lisa@gymwearsolutions.com",
                "phone": "+1-555-0104",
                "address": "321 Gym Ave, Workout City, WC 22222",
                "payment_terms": "Net 30",
                "delivery_schedule": "Weekly"
            },
            {
                "name": "FitnessFirst Supply",
                "contact_person": "David Wilson",
                "email": "david@fitnessfirst.com",
                "phone": "+1-555-0105",
                "address": "654 Fitness Rd, Health City, HC 33333",
                "payment_terms": "Net 20",
                "delivery_schedule": "Bi-weekly"
            }
        ]
        
        suppliers = []
        for sup_data in suppliers_data:
            supplier = Supplier(**sup_data)
            db.session.add(supplier)
            suppliers.append(supplier)
        
        db.session.commit()
        
        # Create users
        print("Creating users...")
        users_data = [
            {
                "username": "admin",
                "email": "admin@fitnesswear.com",
                "password_hash": generate_password_hash("admin123"),
                "first_name": "Admin",
                "last_name": "User",
                "role": UserRole.ADMIN,
                "phone": "+1-555-0001",
                "address": "123 Admin St, Admin City, AC 12345"
            },
            {
                "username": "staff1",
                "email": "staff1@fitnesswear.com",
                "password_hash": generate_password_hash("staff123"),
                "first_name": "John",
                "last_name": "Staff",
                "role": UserRole.STAFF,
                "phone": "+1-555-0002",
                "address": "456 Staff Ave, Staff City, SC 67890"
            },
            {
                "username": "customer1",
                "email": "customer1@example.com",
                "password_hash": generate_password_hash("customer123"),
                "first_name": "Alice",
                "last_name": "Customer",
                "role": UserRole.CUSTOMER,
                "phone": "+1-555-0003",
                "address": "789 Customer Blvd, Customer City, CC 11111"
            },
            {
                "username": "customer2",
                "email": "customer2@example.com",
                "password_hash": generate_password_hash("customer123"),
                "first_name": "Bob",
                "last_name": "Buyer",
                "role": UserRole.CUSTOMER,
                "phone": "+1-555-0004",
                "address": "321 Buyer St, Buyer City, BC 22222"
            }
        ]
        
        users = []
        for user_data in users_data:
            user = User(**user_data)
            db.session.add(user)
            users.append(user)
        
        db.session.commit()
        
        # Create products
        print("Creating products...")
        products_data = [
            {
                "name": "Men's Performance T-Shirt",
                "description": "Lightweight, moisture-wicking t-shirt for men",
                "sku": "MPT001",
                "category_id": 5,  # Men's Tops
                "supplier_id": 1,  # FitGear Pro
                "cost_price": Decimal("15.99"),
                "selling_price": Decimal("29.99"),
                "stock_quantity": 100,
                "min_stock_level": 10,
                "size": "M",
                "color": "Black",
                "material": "Polyester/Spandex",
                "brand": "FitGear"
            },
            {
                "name": "Women's Yoga Leggings",
                "description": "High-waisted, stretchy leggings for yoga and fitness",
                "sku": "WYL001",
                "category_id": 8,  # Women's Bottoms
                "supplier_id": 2,  # AthleticWear Co
                "cost_price": Decimal("22.50"),
                "selling_price": Decimal("45.99"),
                "stock_quantity": 75,
                "min_stock_level": 15,
                "size": "L",
                "color": "Navy",
                "material": "Nylon/Spandex",
                "brand": "AthleticWear"
            },
            {
                "name": "Running Shoes",
                "description": "Lightweight running shoes with excellent cushioning",
                "sku": "RS001",
                "category_id": 3,  # Footwear
                "supplier_id": 3,  # SportStyle Ltd
                "cost_price": Decimal("45.00"),
                "selling_price": Decimal("89.99"),
                "stock_quantity": 50,
                "min_stock_level": 5,
                "size": "10",
                "color": "White/Blue",
                "material": "Mesh/Synthetic",
                "brand": "SportStyle"
            },
            {
                "name": "Fitness Tracker",
                "description": "Smart fitness tracker with heart rate monitoring",
                "sku": "FT001",
                "category_id": 4,  # Accessories
                "supplier_id": 4,  # GymWear Solutions
                "cost_price": Decimal("35.00"),
                "selling_price": Decimal("69.99"),
                "stock_quantity": 30,
                "min_stock_level": 5,
                "size": "One Size",
                "color": "Black",
                "material": "Silicone/Plastic",
                "brand": "GymWear"
            },
            {
                "name": "Men's Tank Top",
                "description": "Sleeveless tank top for intense workouts",
                "sku": "MTT001",
                "category_id": 5,  # Men's Tops
                "supplier_id": 1,  # FitGear Pro
                "cost_price": Decimal("12.99"),
                "selling_price": Decimal("24.99"),
                "stock_quantity": 80,
                "min_stock_level": 10,
                "size": "L",
                "color": "Gray",
                "material": "Cotton/Polyester",
                "brand": "FitGear"
            }
        ]
        
        products = []
        for prod_data in products_data:
            product = Product(**prod_data)
            db.session.add(product)
            products.append(product)
        
        db.session.commit()
        
        # Create inventory records
        print("Creating inventory records...")
        for product in products:
            inventory = Inventory(
                product_id=product.id,
                quantity=product.stock_quantity,
                location="Main Warehouse",
                last_updated=datetime.utcnow()
            )
            db.session.add(inventory)
        
        db.session.commit()
        
        # Create sample purchases
        print("Creating sample purchases...")
        for i in range(10):
            purchase = Purchase(
                supplier_id=random.choice(suppliers).id,
                purchase_date=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
                total_amount=Decimal(str(random.uniform(100, 1000))).quantize(Decimal('0.01')),
                status=random.choice(['completed', 'pending', 'cancelled']),
                notes=f"Sample purchase #{i+1}"
            )
            db.session.add(purchase)
        
        db.session.commit()
        
        print("✅ Database initialization completed successfully!")
        print(f"Created {len(categories)} categories")
        print(f"Created {len(suppliers)} suppliers")
        print(f"Created {len(users)} users")
        print(f"Created {len(products)} products")
        print(f"Created {len(products)} inventory records")
        print("Created 10 sample purchases")

if __name__ == "__main__":
    init_database()
