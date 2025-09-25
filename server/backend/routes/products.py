from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Product, Category, Supplier, User, UserRole
from datetime import datetime
from sqlalchemy import or_, and_

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        category_id = request.args.get('category_id', type=int)
        supplier_id = request.args.get('supplier_id', type=int)
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        size = request.args.get('size', '')
        color = request.args.get('color', '')
        brand = request.args.get('brand', '')
        in_stock_only = request.args.get('in_stock_only', 'false').lower() == 'true'
        
        # Build query
        query = Product.query.filter_by(is_active=True)
        
        # Apply filters
        if search:
            query = query.filter(
                or_(
                    Product.name.ilike(f'%{search}%'),
                    Product.description.ilike(f'%{search}%'),
                    Product.brand.ilike(f'%{search}%'),
                    Product.sku.ilike(f'%{search}%')
                )
            )
        
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        if supplier_id:
            query = query.filter_by(supplier_id=supplier_id)
        
        if min_price:
            query = query.filter(Product.selling_price >= min_price)
        
        if max_price:
            query = query.filter(Product.selling_price <= max_price)
        
        if size:
            query = query.filter(Product.size == size)
        
        if color:
            query = query.filter(Product.color.ilike(f'%{color}%'))
        
        if brand:
            query = query.filter(Product.brand.ilike(f'%{brand}%'))
        
        if in_stock_only:
            query = query.join(Product.inventory).filter(
                Product.inventory.any(quantity_in_stock > 0)
            )
        
        # Pagination
        products = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'products': [product.to_dict() for product in products.items],
            'total': products.total,
            'pages': products.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get(product_id)
        
        if not product or not product.is_active:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({'product': product.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'sku', 'cost_price', 'selling_price', 'category_id', 'supplier_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if SKU already exists
        if Product.query.filter_by(sku=data['sku']).first():
            return jsonify({'error': 'SKU already exists'}), 400
        
        # Validate category and supplier exist
        if not Category.query.get(data['category_id']):
            return jsonify({'error': 'Category not found'}), 400
        
        if not Supplier.query.get(data['supplier_id']):
            return jsonify({'error': 'Supplier not found'}), 400
        
        # Create product
        product = Product(
            name=data['name'],
            description=data.get('description'),
            sku=data['sku'],
            brand=data.get('brand'),
            size=data.get('size'),
            color=data.get('color'),
            cost_price=data['cost_price'],
            selling_price=data['selling_price'],
            image_url=data.get('image_url'),
            category_id=data['category_id'],
            supplier_id=data['supplier_id']
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'sku' in data:
            # Check if new SKU already exists
            existing_product = Product.query.filter_by(sku=data['sku']).first()
            if existing_product and existing_product.id != product.id:
                return jsonify({'error': 'SKU already exists'}), 400
            product.sku = data['sku']
        if 'brand' in data:
            product.brand = data['brand']
        if 'size' in data:
            product.size = data['size']
        if 'color' in data:
            product.color = data['color']
        if 'cost_price' in data:
            product.cost_price = data['cost_price']
        if 'selling_price' in data:
            product.selling_price = data['selling_price']
        if 'image_url' in data:
            product.image_url = data['image_url']
        if 'category_id' in data:
            if not Category.query.get(data['category_id']):
                return jsonify({'error': 'Category not found'}), 400
            product.category_id = data['category_id']
        if 'supplier_id' in data:
            if not Supplier.query.get(data['supplier_id']):
                return jsonify({'error': 'Supplier not found'}), 400
            product.supplier_id = data['supplier_id']
        if 'is_active' in data:
            product.is_active = data['is_active']
        
        product.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != UserRole.ADMIN:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Soft delete by setting is_active to False
        product.is_active = False
        product.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/search', methods=['GET'])
def search_products():
    try:
        query = request.args.get('q', '')
        limit = request.args.get('limit', 10, type=int)
        
        if not query:
            return jsonify({'products': []}), 200
        
        products = Product.query.filter(
            and_(
                Product.is_active == True,
                or_(
                    Product.name.ilike(f'%{query}%'),
                    Product.description.ilike(f'%{query}%'),
                    Product.brand.ilike(f'%{query}%'),
                    Product.sku.ilike(f'%{query}%')
                )
            )
        ).limit(limit).all()
        
        return jsonify({
            'products': [product.to_dict() for product in products]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

