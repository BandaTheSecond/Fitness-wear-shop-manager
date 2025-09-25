from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Inventory, Product, User, UserRole
from datetime import datetime

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/', methods=['GET'])
@jwt_required()
def get_inventory():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        low_stock_only = request.args.get('low_stock_only', 'false').lower() == 'true'
        out_of_stock_only = request.args.get('out_of_stock_only', 'false').lower() == 'true'
        
        query = Inventory.query.join(Product).filter(Product.is_active == True)
        
        if low_stock_only:
            query = query.filter(Inventory.quantity_in_stock <= Inventory.minimum_stock_level)
        
        if out_of_stock_only:
            query = query.filter(Inventory.quantity_in_stock == 0)
        
        inventory = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'inventory': [item.to_dict() for item in inventory.items],
            'total': inventory.total,
            'pages': inventory.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product_inventory(product_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        inventory = Inventory.query.filter_by(product_id=product_id).first()
        if not inventory:
            return jsonify({'error': 'Inventory record not found'}), 404
        
        return jsonify({'inventory': inventory.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/', methods=['POST'])
@jwt_required()
def create_inventory():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        if not data.get('product_id'):
            return jsonify({'error': 'Product ID is required'}), 400
        
        # Check if product exists
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({'error': 'Product not found'}), 400
        
        # Check if inventory already exists
        if Inventory.query.filter_by(product_id=data['product_id']).first():
            return jsonify({'error': 'Inventory record already exists for this product'}), 400
        
        inventory = Inventory(
            product_id=data['product_id'],
            quantity_in_stock=data.get('quantity_in_stock', 0),
            minimum_stock_level=data.get('minimum_stock_level', 10),
            maximum_stock_level=data.get('maximum_stock_level', 100)
        )
        
        db.session.add(inventory)
        db.session.commit()
        
        return jsonify({
            'message': 'Inventory record created successfully',
            'inventory': inventory.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_inventory(product_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        inventory = Inventory.query.filter_by(product_id=product_id).first()
        if not inventory:
            return jsonify({'error': 'Inventory record not found'}), 404
        
        data = request.get_json()
        
        if 'quantity_in_stock' in data:
            inventory.quantity_in_stock = data['quantity_in_stock']
        if 'minimum_stock_level' in data:
            inventory.minimum_stock_level = data['minimum_stock_level']
        if 'maximum_stock_level' in data:
            inventory.maximum_stock_level = data['maximum_stock_level']
        
        inventory.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Inventory updated successfully',
            'inventory': inventory.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/<int:product_id>/restock', methods=['POST'])
@jwt_required()
def restock_inventory(product_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        inventory = Inventory.query.filter_by(product_id=product_id).first()
        if not inventory:
            return jsonify({'error': 'Inventory record not found'}), 404
        
        data = request.get_json()
        quantity = data.get('quantity', 0)
        
        if quantity <= 0:
            return jsonify({'error': 'Quantity must be greater than 0'}), 400
        
        inventory.quantity_in_stock += quantity
        inventory.last_restocked = datetime.utcnow()
        inventory.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Inventory restocked successfully',
            'inventory': inventory.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/alerts', methods=['GET'])
@jwt_required()
def get_stock_alerts():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Get low stock items
        low_stock = Inventory.query.join(Product).filter(
            and_(
                Product.is_active == True,
                Inventory.quantity_in_stock <= Inventory.minimum_stock_level,
                Inventory.quantity_in_stock > 0
            )
        ).all()
        
        # Get out of stock items
        out_of_stock = Inventory.query.join(Product).filter(
            and_(
                Product.is_active == True,
                Inventory.quantity_in_stock == 0
            )
        ).all()
        
        return jsonify({
            'low_stock': [item.to_dict() for item in low_stock],
            'out_of_stock': [item.to_dict() for item in out_of_stock],
            'total_alerts': len(low_stock) + len(out_of_stock)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

