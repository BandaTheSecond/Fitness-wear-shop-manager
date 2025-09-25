#!/usr/bin/env bash
# Exit on error
set -o errexit

# Upgrade pip and setuptools
pip install --upgrade pip setuptools

# Install dependencies
pip install -r requirements.txt

# Create database directory if it doesn't exist
mkdir -p instance

# Set environment variables for production
export FLASK_ENV=production
export FLASK_APP=app.py

# Initialize database and run migrations
python -c "
from app import app, db
with app.app_context():
    print('Creating database tables...')
    db.create_all()
    print('Database tables created successfully!')
"

# Initialize database with seed data (optional - comment out if not needed)
python seed_data.py
