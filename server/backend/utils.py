from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from models import User


def get_current_user():
    """
    Safely get the current user from JWT token.
    Returns a tuple: (user, error_response)
    If successful, user is the User object and error_response is None.
    If error, user is None and error_response is a Flask response tuple.
    """
    try:
        # Safely convert JWT identity to integer
        jwt_identity = get_jwt_identity()
        if not jwt_identity:
            return None, (jsonify({'error': 'Invalid token - no identity found'}), 401)
        
        try:
            user_id = int(jwt_identity)
        except (ValueError, TypeError):
            return None, (jsonify({'error': 'Invalid token - identity is not a valid user ID'}), 401)
        
        user = User.query.get(user_id)
        if not user:
            return None, (jsonify({'error': 'User not found'}), 404)
        
        return user, None
        
    except Exception as e:
        return None, (jsonify({'error': str(e)}), 500)


def get_staff_user():
    """
    Get current user and verify they have staff or admin role.
    Returns a tuple: (user, error_response)
    """
    user, error_response = get_current_user()
    if error_response:
        return user, error_response
    
    from models import UserRole
    if user.role not in [UserRole.STAFF, UserRole.ADMIN]:
        return None, (jsonify({'error': 'Insufficient permissions'}), 403)
    
    return user, None


def get_admin_user():
    """
    Get current user and verify they have admin role.
    Returns a tuple: (user, error_response)
    """
    user, error_response = get_current_user()
    if error_response:
        return user, error_response
    
    from models import UserRole
    if user.role != UserRole.ADMIN:
        return None, (jsonify({'error': 'Insufficient permissions - admin access required'}), 403)
    
    return user, None
