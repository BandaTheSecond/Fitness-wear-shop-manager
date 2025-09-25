from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Purchase, PurchaseItem, Product, Inventory, User, UserRole
from datetime import datetime, timedelta
from sqlalchemy import func, desc, and_

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/sales', methods=['GET'])
@jwt_required()
def get_sales_report():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Default to last 30 days if no dates provided
        if not start_date:
            start_date = (datetime.utcnow() - timedelta(days=30)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.utcnow().strftime('%Y-%m-%d')
        
        # Convert string dates to datetime objects
        start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
        end_datetime = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
        
        # Sales summary
        sales_query = Purchase.query.filter(
            Purchase.created_at >= start_datetime,
            Purchase.created_at < end_datetime,
            Purchase.status == 'completed'
        )
        
        total_sales = sales_query.with_entities(func.sum(Purchase.total_amount)).scalar() or 0
        total_orders = sales_query.count()
        
        # Daily sales breakdown
        daily_sales = db.session.query(
            func.date(Purchase.created_at).label('date'),
            func.sum(Purchase.total_amount).label('total'),
            func.count(Purchase.id).label('orders')
        ).filter(
            Purchase.created_at >= start_datetime,
            Purchase.created_at < end_datetime,
            Purchase.status == 'completed'
        ).group_by(func.date(Purchase.created_at)).all()
        
        # Top selling products
        top_products = db.session.query(
            Product.name,
            Product.sku,
            func.sum(PurchaseItem.quantity).label('total_quantity'),
            func.sum(PurchaseItem.total_price).label('total_revenue')
        ).join(PurchaseItem).join(Purchase).filter(
            Purchase.created_at >= start_datetime,
            Purchase.created_at < end_datetime,
            Purchase.status == 'completed'
        ).group_by(Product.id, Product.name, Product.sku).order_by(
            desc('total_quantity')
        ).limit(10).all()
        
        return jsonify({
            'period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'summary': {
                'total_sales': float(total_sales),
                'total_orders': total_orders,
                'average_order_value': float(total_sales / total_orders) if total_orders > 0 else 0
            },
            'daily_sales': [
                {
                    'date': str(day.date),
                    'total': float(day.total),
                    'orders': day.orders
                } for day in daily_sales
            ],
            'top_products': [
                {
                    'name': product.name,
                    'sku': product.sku,
                    'total_quantity': product.total_quantity,
                    'total_revenue': float(product.total_revenue)
                } for product in top_products
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/inventory', methods=['GET'])
@jwt_required()
def get_inventory_report():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Inventory summary
        total_products = Product.query.filter_by(is_active=True).count()
        low_stock_count = Inventory.query.join(Product).filter(
            and_(
                Product.is_active == True,
                Inventory.quantity_in_stock <= Inventory.minimum_stock_level
            )
        ).count()
        
        out_of_stock_count = Inventory.query.join(Product).filter(
            and_(
                Product.is_active == True,
                Inventory.quantity_in_stock == 0
            )
        ).count()
        
        # Total inventory value
        inventory_value = db.session.query(
            func.sum(Inventory.quantity_in_stock * Product.cost_price)
        ).join(Product).filter(Product.is_active == True).scalar() or 0
        
        # Low stock items
        low_stock_items = Inventory.query.join(Product).filter(
            and_(
                Product.is_active == True,
                Inventory.quantity_in_stock <= Inventory.minimum_stock_level
            )
        ).all()
        
        return jsonify({
            'summary': {
                'total_products': total_products,
                'low_stock_count': low_stock_count,
                'out_of_stock_count': out_of_stock_count,
                'total_inventory_value': float(inventory_value)
            },
            'low_stock_items': [item.to_dict() for item in low_stock_items]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/profit', methods=['GET'])
@jwt_required()
def get_profit_report():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Default to last 30 days if no dates provided
        if not start_date:
            start_date = (datetime.utcnow() - timedelta(days=30)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.utcnow().strftime('%Y-%m-%d')
        
        # Convert string dates to datetime objects
        start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
        end_datetime = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)
        
        # Calculate profit for completed purchases
        profit_data = db.session.query(
            func.sum(PurchaseItem.quantity * (Product.selling_price - Product.cost_price)).label('total_profit'),
            func.sum(PurchaseItem.quantity * Product.selling_price).label('total_revenue'),
            func.sum(PurchaseItem.quantity * Product.cost_price).label('total_cost')
        ).join(Product).join(Purchase).filter(
            Purchase.created_at >= start_datetime,
            Purchase.created_at < end_datetime,
            Purchase.status == 'completed'
        ).first()
        
        total_profit = profit_data.total_profit or 0
        total_revenue = profit_data.total_revenue or 0
        total_cost = profit_data.total_cost or 0
        
        profit_margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        return jsonify({
            'period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'profit_summary': {
                'total_revenue': float(total_revenue),
                'total_cost': float(total_cost),
                'total_profit': float(total_profit),
                'profit_margin': round(profit_margin, 2)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in [UserRole.STAFF, UserRole.ADMIN]:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        # Today's sales
        today = datetime.utcnow().date()
        today_sales = Purchase.query.filter(
            func.date(Purchase.created_at) == today,
            Purchase.status == 'completed'
        ).with_entities(func.sum(Purchase.total_amount)).scalar() or 0
        
        # This week's sales
        week_start = today - timedelta(days=today.weekday())
        week_sales = Purchase.query.filter(
            func.date(Purchase.created_at) >= week_start,
            Purchase.status == 'completed'
        ).with_entities(func.sum(Purchase.total_amount)).scalar() or 0
        
        # Total products
        total_products = Product.query.filter_by(is_active=True).count()
        
        # Low stock alerts
        low_stock_count = Inventory.query.join(Product).filter(
            and_(
                Product.is_active == True,
                Inventory.quantity_in_stock <= Inventory.minimum_stock_level
            )
        ).count()
        
        # Recent orders
        recent_orders = Purchase.query.order_by(
            Purchase.created_at.desc()
        ).limit(5).all()
        
        return jsonify({
            'metrics': {
                'today_sales': float(today_sales),
                'week_sales': float(week_sales),
                'total_products': total_products,
                'low_stock_alerts': low_stock_count
            },
            'recent_orders': [order.to_dict() for order in recent_orders]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

