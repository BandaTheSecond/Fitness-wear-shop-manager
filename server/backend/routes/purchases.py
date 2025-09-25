from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Purchase, PurchaseItem, Product, User, UserRole, Inventory
from datetime import datetime
from decimal import Decimal
from sqlalchemy.orm import joinedload

purchases_bp = Blueprint('purchases', __name__)

@purchases_bp.route('/', methods=['GET'])
@jwt_required()
def get_purchases():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Build query based on user role
        if user.role == UserRole.ADMIN:
            query = Purchase.query.options(joinedload(Purchase.user))
        elif user.role == UserRole.STAFF:
            query = Purchase.query.options(joinedload(Purchase.user))
        else:  # Customer
            query = Purchase.query.filter_by(user_id=user_id).options(joinedload(Purchase.user))
        
        purchases = query.order_by(Purchase.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'purchases': [purchase.to_dict() for purchase in purchases.items],
            'total': purchases.total,
            'pages': purchases.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@purchases_bp.route('/<int:purchase_id>', methods=['GET'])
@jwt_required()
def get_purchase(purchase_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        purchase = Purchase.query.options(joinedload(Purchase.user)).get(purchase_id)
        if not purchase:
            return jsonify({'error': 'Purchase not found'}), 404
        
        # Check permissions
        if user.role == UserRole.CUSTOMER and purchase.user_id != user_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        return jsonify({'purchase': purchase.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@purchases_bp.route('/', methods=['POST'])
@jwt_required()
def create_purchase():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('items') or not isinstance(data['items'], list):
            return jsonify({'error': 'Items are required'}), 400
        
        # Calculate total amount
        total_amount = Decimal('0')
        purchase_items = []
        
        for item_data in data['items']:
            product_id = item_data.get('product_id')
            quantity = item_data.get('quantity', 1)
            
            if not product_id or not quantity:
                return jsonify({'error': 'Product ID and quantity are required for each item'}), 400
            
            product = Product.query.get(product_id)
            if not product or not product.is_active:
                return jsonify({'error': f'Product {product_id} not found or inactive'}), 400
            
            # Check inventory
            inventory = Inventory.query.filter_by(product_id=product_id).first()
            if not inventory or inventory.quantity_in_stock < quantity:
                return jsonify({'error': f'Insufficient stock for product {product.name}'}), 400
            
            unit_price = product.selling_price
            total_price = unit_price * quantity
            total_amount += total_price
            
            purchase_items.append({
                'product_id': product_id,
                'quantity': quantity,
                'unit_price': unit_price,
                'total_price': total_price
            })
        
        # Create purchase
        purchase = Purchase(
            user_id=user_id,
            total_amount=total_amount,
            payment_method=data.get('payment_method'),
            payment_status=data.get('payment_status', 'pending'),
            status=data.get('status', 'pending'),
            notes=data.get('notes')
        )
        
        db.session.add(purchase)
        db.session.flush()  # Get the purchase ID
        
        # Create purchase items and update inventory
        for item_data in purchase_items:
            purchase_item = PurchaseItem(
                purchase_id=purchase.id,
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=item_data['total_price']
            )
            db.session.add(purchase_item)
            
            # Update inventory
            inventory = Inventory.query.filter_by(product_id=item_data['product_id']).first()
            inventory.quantity_in_stock -= item_data['quantity']
            inventory.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Purchase created successfully',
            'purchase': purchase.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@purchases_bp.route('/<int:purchase_id>', methods=['PUT'])
@jwt_required()
def update_purchase(purchase_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        purchase = Purchase.query.get(purchase_id)
        if not purchase:
            return jsonify({'error': 'Purchase not found'}), 404
        
        data = request.get_json()
        
        if 'payment_method' in data:
            purchase.payment_method = data['payment_method']
        if 'payment_status' in data:
            purchase.payment_status = data['payment_status']
        if 'status' in data:
            purchase.status = data['status']
        if 'notes' in data:
            purchase.notes = data['notes']
        
        purchase.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Purchase updated successfully',
            'purchase': purchase.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@purchases_bp.route('/<int:purchase_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_purchase(purchase_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        purchase = Purchase.query.get(purchase_id)
        if not purchase:
            return jsonify({'error': 'Purchase not found'}), 404
        
        # Check permissions
        if user.role == UserRole.CUSTOMER and purchase.user_id != user_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        if purchase.status == 'cancelled':
            return jsonify({'error': 'Purchase is already cancelled'}), 400
        
        if purchase.status == 'completed':
            return jsonify({'error': 'Cannot cancel completed purchase'}), 400
        
        # Restore inventory
        for item in purchase.items:
            inventory = Inventory.query.filter_by(product_id=item.product_id).first()
            if inventory:
                inventory.quantity_in_stock += item.quantity
                inventory.updated_at = datetime.utcnow()
        
        purchase.status = 'cancelled'
        purchase.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Purchase cancelled successfully',
            'purchase': purchase.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

