from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Category, User, UserRole
from datetime import datetime

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify({
            'categories': [category.to_dict() for category in categories]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        return jsonify({'category': category.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/', methods=['POST'])
@jwt_required()
def create_category():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400
        
        # Check if category already exists
        if Category.query.filter_by(name=data['name']).first():
            return jsonify({'error': 'Category already exists'}), 400
        
        category = Category(
            name=data['name'],
            description=data.get('description'),
            parent_id=data.get('parent_id')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'message': 'Category created successfully',
            'category': category.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            # Check if new name already exists
            existing_category = Category.query.filter_by(name=data['name']).first()
            if existing_category and existing_category.id != category.id:
                return jsonify({'error': 'Category name already exists'}), 400
            category.name = data['name']
        
        if 'description' in data:
            category.description = data['description']
        
        if 'parent_id' in data:
            category.parent_id = data['parent_id']
        
        category.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Category updated successfully',
            'category': category.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != UserRole.ADMIN:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        
        # Check if category has products
        if category.products:
            return jsonify({'error': 'Cannot delete category with products'}), 400
        
        db.session.delete(category)
        db.session.commit()
        
        return jsonify({'message': 'Category deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

