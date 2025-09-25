#!/usr/bin/env python3
"""
Database seeding script for Fitness Wear Shop Management System
This script populates the database with sample data for testing and development.
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

def create_sample_data():
    """Create sample data for the fitness wear shop"""
    
    with app.app_context():
        # Check if database already has data
        existing_users = User.query.first()
        if existing_users:
            print("Database already contains data. Skipping seed data creation.")
            return
        
        # Create tables if they don't exist
        print("Creating database tables...")
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
                "name": "Nike Inc.",
                "contact_person": "John Smith",
                "email": "john.smith@nike.com",
                "phone": "+1-555-0101",
                "address": "1 Bowerman Dr, Beaverton, OR 97005",
                "payment_terms": "Net 30",
                "delivery_schedule": "Weekly"
            },
            {
                "name": "Adidas AG",
                "contact_person": "Sarah Johnson",
                "email": "sarah.johnson@adidas.com",
                "phone": "+1-555-0102",
                "address": "5055 N Greeley Ave, Portland, OR 97217",
                "payment_terms": "Net 15",
                "delivery_schedule": "Bi-weekly"
            },
            {
                "name": "Under Armour",
                "contact_person": "Mike Davis",
                "email": "mike.davis@underarmour.com",
                "phone": "+1-555-0103",
                "address": "1020 Hull St, Baltimore, MD 21230",
                "payment_terms": "Net 30",
                "delivery_schedule": "Monthly"
            },
            {
                "name": "Lululemon Athletica",
                "contact_person": "Emily Chen",
                "email": "emily.chen@lululemon.com",
                "phone": "+1-555-0104",
                "address": "1818 Cornwall Ave, Vancouver, BC V6J 1C7",
                "payment_terms": "Net 45",
                "delivery_schedule": "Weekly"
            },
            {
                "name": "Puma SE",
                "contact_person": "David Wilson",
                "email": "david.wilson@puma.com",
                "phone": "+1-555-0105",
                "address": "Puma Way 1, 91074 Herzogenaurach, Germany",
                "payment_terms": "Net 30",
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
                "password_hash": generate_password_hash("SecureAdmin2024!"),
                "first_name": "Admin",
                "last_name": "User",
                "role": UserRole.ADMIN,
                "phone": "+1-555-0001",
                "address": "123 Admin St, Admin City, AC 12345"
            },
            {
                "username": "staff1",
                "email": "staff1@fitnesswear.com",
                "password_hash": generate_password_hash("SecureStaff2024!"),
                "first_name": "John",
                "last_name": "Staff",
                "role": UserRole.STAFF,
                "phone": "+1-555-0002",
                "address": "456 Staff Ave, Staff City, SC 67890"
            },
            {
                "username": "customer1",
                "email": "customer1@example.com",
                "password_hash": generate_password_hash("SecureCustomer2024!"),
                "first_name": "Alice",
                "last_name": "Customer",
                "role": UserRole.CUSTOMER,
                "phone": "+1-555-0003",
                "address": "789 Customer Blvd, Customer City, CC 11111"
            },
            {
                "username": "customer2",
                "email": "customer2@example.com",
                "password_hash": generate_password_hash("SecureBuyer2024!"),
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
            # Men's Tops
            {
                "name": "Nike Dri-FIT Training T-Shirt",
                "description": "Lightweight, breathable training shirt with moisture-wicking technology",
                "sku": "NK-M-TS-001",
                "brand": "Nike",
                "size": "M",
                "color": "Black",
                "cost_price": Decimal("15.00"),
                "selling_price": Decimal("29.99"),
                "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
                "category_id": 5,  # Men's Tops
                "supplier_id": 1   # Nike
            },
            {
                "name": "Adidas Climalite Training Tank",
                "description": "Performance tank top with Climalite technology for superior comfort",
                "sku": "AD-M-TK-001",
                "brand": "Adidas",
                "size": "L",
                "color": "White",
                "cost_price": Decimal("12.00"),
                "selling_price": Decimal("24.99"),
                "image_url": "https://images.unsplash.com/photo-1506629905607-1b2b1b1b1b1b?w=400",
                "category_id": 5,
                "supplier_id": 2
            },
            {
                "name": "Under Armour HeatGear Compression Shirt",
                "description": "Compression fit training shirt with HeatGear technology",
                "sku": "UA-M-CS-001",
                "brand": "Under Armour",
                "size": "XL",
                "color": "Navy",
                "cost_price": Decimal("18.00"),
                "selling_price": Decimal("34.99"),
                "image_url": "https://images.unsplash.com/photo-1506629905607-1b2b1b1b1b1b?w=400",
                "category_id": 5,
                "supplier_id": 3
            },
            
            # Men's Bottoms
            {
                "name": "Nike Dri-FIT Training Shorts",
                "description": "Comfortable training shorts with built-in brief liner",
                "sku": "NK-M-SH-001",
                "brand": "Nike",
                "size": "M",
                "color": "Gray",
                "cost_price": Decimal("20.00"),
                "selling_price": Decimal("39.99"),
                "image_url": "https://images.unsplash.com/photo-1506629905607-1b2b1b1b1b1b?w=400",
                "category_id": 6,  # Men's Bottoms
                "supplier_id": 1
            },
            {
                "name": "Adidas Tiro Training Pants",
                "description": "Classic training pants with comfortable fit",
                "sku": "AD-M-PA-001",
                "brand": "Adidas",
                "size": "L",
                "color": "Black",
                "cost_price": Decimal("25.00"),
                "selling_price": Decimal("49.99"),
                "image_url": "https://images.unsplash.com/photo-1506629905607-1b2b1b1b1b1b?w=400",
                "category_id": 6,
                "supplier_id": 2
            },
            
            # Women's Tops
            {
                "name": "Lululemon Align Tank Top",
                "description": "Buttery-soft tank top perfect for yoga and low-impact activities",
                "sku": "LL-W-TK-001",
                "brand": "Lululemon",
                "size": "S",
                "color": "Pink",
                "cost_price": Decimal("35.00"),
                "selling_price": Decimal("68.00"),
                "image_url": "https://images.unsplash.com/photo-1506629905607-1b2b1b1b1b1b?w=400",
                "category_id": 7,  # Women's Tops
                "supplier_id": 4
            },
            {
                "name": "Nike Pro Training Sports Bra",
                "description": "High-support sports bra with Dri-FIT technology",
                "sku": "NK-W-SB-001",
                "brand": "Nike",
                "size": "M",
                "color": "Black",
                "cost_price": Decimal("22.00"),
                "selling_price": Decimal("44.99"),
                "image_url": "https://images.unsplash.com/photo-1506629905607-1b2b1b1b1b1b?w=400",
                "category_id": 7,
                "supplier_id": 1
            },
            
            # Women's Bottoms
            {
                "name": "Lululemon Align Leggings",
                "description": "Ultra-soft leggings with four-way stretch",
                "sku": "LL-W-LG-001",
                "brand": "Lululemon",
                "size": "S",
                "color": "Black",
                "cost_price": Decimal("45.00"),
                "selling_price": Decimal("98.00"),
                "image_url": "https://images.unsplash.com/photo-1506629905607-1b2b1b1b1b1b?w=400",
                "category_id": 8,  # Women's Bottoms
                "supplier_id": 4
            },
            {
                "name": "Adidas Training Shorts",
                "description": "Comfortable training shorts with moisture-wicking fabric",
                "sku": "AD-W-SH-001",
                "brand": "Adidas",
                "size": "M",
                "color": "Blue",
                "cost_price": Decimal("18.00"),
                "selling_price": Decimal("35.99"),
                "image_url": "https://images.unsplash.com/photo-1506629905607-1b2b1b1b1b1b?w=400",
                "category_id": 8,
                "supplier_id": 2
            },
            
            # Footwear
            {
                "name": "Nike Air Max 270",
                "description": "Comfortable running shoes with Max Air cushioning",
                "sku": "NK-F-SH-001",
                "brand": "Nike",
                "size": "10",
                "color": "White",
                "cost_price": Decimal("60.00"),
                "selling_price": Decimal("150.00"),
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
                "category_id": 3,  # Footwear
                "supplier_id": 1
            },
            {
                "name": "Adidas Ultraboost 22",
                "description": "High-performance running shoes with Boost technology",
                "sku": "AD-F-SH-001",
                "brand": "Adidas",
                "size": "9",
                "color": "Black",
                "cost_price": Decimal("70.00"),
                "selling_price": Decimal("180.00"),
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
                "category_id": 3,
                "supplier_id": 2
            },
            {
                "name": "Puma RS-X Reinvention",
                "description": "Retro-inspired running shoes with modern comfort",
                "sku": "PU-F-SH-001",
                "brand": "Puma",
                "size": "11",
                "color": "Red",
                "cost_price": Decimal("55.00"),
                "selling_price": Decimal("120.00"),
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
                "category_id": 3,
                "supplier_id": 5
            },
            
            # Accessories
            {
                "name": "Nike Dri-FIT Headband",
                "description": "Moisture-wicking headband for active wear",
                "sku": "NK-A-HB-001",
                "brand": "Nike",
                "size": "One Size",
                "color": "Black",
                "cost_price": Decimal("5.00"),
                "selling_price": Decimal("12.99"),
                "image_url": "https://images.unsplash.com/photo-1506629905607-1b2b1b1b1b1b?w=400",
                "category_id": 4,  # Accessories
                "supplier_id": 1
            },
            {
                "name": "Adidas Training Towel",
                "description": "Quick-dry training towel for gym and sports",
                "sku": "AD-A-TW-001",
                "brand": "Adidas",
                "size": "One Size",
                "color": "White",
                "cost_price": Decimal("8.00"),
                "selling_price": Decimal("19.99"),
                "image_url": "https://images.unsplash.com/photo-1506629905607-1b2b1b1b1b1b?w=400",
                "category_id": 4,
                "supplier_id": 2
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
                quantity_in_stock=random.randint(0, 50),
                minimum_stock_level=random.randint(5, 15),
                maximum_stock_level=random.randint(50, 100),
                last_restocked=datetime.utcnow() - timedelta(days=random.randint(1, 30))
            )
            db.session.add(inventory)
        
        db.session.commit()
        
        # Create sample purchases
        print("Creating sample purchases...")
        customers = [user for user in users if user.role == UserRole.CUSTOMER]
        
        for i in range(10):
            customer = random.choice(customers)
            purchase_date = datetime.utcnow() - timedelta(days=random.randint(1, 90))
            
            # Select random products for this purchase
            purchase_products = random.sample(products, random.randint(1, 4))
            total_amount = Decimal("0.00")
            
            purchase = Purchase(
                user_id=customer.id,
                total_amount=total_amount,  # Will be calculated
                payment_method=random.choice(['cash', 'card']),
                payment_status=random.choice(['completed', 'pending']),
                status=random.choice(['completed', 'pending', 'cancelled']),
                notes=f"Sample purchase #{i+1}",
                created_at=purchase_date
            )
            db.session.add(purchase)
            db.session.flush()  # Get the purchase ID
            
            # Create purchase items
            for product in purchase_products:
                quantity = random.randint(1, 3)
                unit_price = product.selling_price
                total_price = unit_price * quantity
                total_amount += total_price
                
                purchase_item = PurchaseItem(
                    purchase_id=purchase.id,
                    product_id=product.id,
                    quantity=quantity,
                    unit_price=unit_price,
                    total_price=total_price
                )
                db.session.add(purchase_item)
            
            # Update purchase total
            purchase.total_amount = total_amount
            db.session.commit()
        
        print("Sample data created successfully!")
        print(f"Created {len(categories)} categories")
        print(f"Created {len(suppliers)} suppliers")
        print(f"Created {len(users)} users")
        print(f"Created {len(products)} products")
        print(f"Created {len(products)} inventory records")
        print(f"Created 10 sample purchases")

if __name__ == "__main__":
    create_sample_data()
