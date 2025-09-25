#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create database directory if it doesn't exist
mkdir -p instance

# Run database migrations
flask db upgrade

# Initialize database with seed data (optional - comment out if not needed)
python seed_data.py
