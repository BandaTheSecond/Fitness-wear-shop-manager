from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Supplier, User, UserRole
from datetime import datetime

suppliers_bp = Blueprint('suppliers', __name__)

@suppliers_bp.route('/', methods=['GET'])
@jwt_required()
def get_suppliers():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        suppliers = Supplier.query.filter_by(is_active=True).all()
        return jsonify({
            'suppliers': [supplier.to_dict() for supplier in suppliers]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@suppliers_bp.route('/<int:supplier_id>', methods=['GET'])
@jwt_required()
def get_supplier(supplier_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        supplier = Supplier.query.get(supplier_id)
        if not supplier:
            return jsonify({'error': 'Supplier not found'}), 404
        return jsonify({'supplier': supplier.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@suppliers_bp.route('/', methods=['POST'])
@jwt_required()
def create_supplier():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400
        
        supplier = Supplier(
            name=data['name'],
            contact_person=data.get('contact_person'),
            email=data.get('email'),
            phone=data.get('phone'),
            address=data.get('address'),
            payment_terms=data.get('payment_terms'),
            delivery_schedule=data.get('delivery_schedule')
        )
        
        db.session.add(supplier)
        db.session.commit()
        
        return jsonify({
            'message': 'Supplier created successfully',
            'supplier': supplier.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@suppliers_bp.route('/<int:supplier_id>', methods=['PUT'])
@jwt_required()
def update_supplier(supplier_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        supplier = Supplier.query.get(supplier_id)
        if not supplier:
            return jsonify({'error': 'Supplier not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            supplier.name = data['name']
        if 'contact_person' in data:
            supplier.contact_person = data['contact_person']
        if 'email' in data:
            supplier.email = data['email']
        if 'phone' in data:
            supplier.phone = data['phone']
        if 'address' in data:
            supplier.address = data['address']
        if 'payment_terms' in data:
            supplier.payment_terms = data['payment_terms']
        if 'delivery_schedule' in data:
            supplier.delivery_schedule = data['delivery_schedule']
        if 'is_active' in data:
            supplier.is_active = data['is_active']
        
        supplier.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Supplier updated successfully',
            'supplier': supplier.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@suppliers_bp.route('/<int:supplier_id>', methods=['DELETE'])
@jwt_required()
def delete_supplier(supplier_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != UserRole.ADMIN:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        supplier = Supplier.query.get(supplier_id)
        if not supplier:
            return jsonify({'error': 'Supplier not found'}), 404
        
        # Check if supplier has products
        if supplier.products:
            return jsonify({'error': 'Cannot delete supplier with products'}), 400
        
        supplier.is_active = False
        supplier.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Supplier deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

