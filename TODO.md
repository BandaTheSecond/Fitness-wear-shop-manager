# TODO: Fix Problems in app.py

## Information Gathered
- app.py sets up a Flask app with SQLAlchemy, JWT, CORS, and registers blueprints for routes.
- Database URI is set to 'sqlite:///fitness_shop.db', but the actual DB file is located at server/backend/instance/fitness_shop.db.
- db.create_all() is called in the __main__ block, which recreates tables every run, potentially losing data.
- seed_data.py properly handles seeding with checks to avoid duplicates, while init_database.py has model mismatches.
- Models.py defines the database schema correctly.

## Plan
- [x] Update the SQLALCHEMY_DATABASE_URI to point to the correct DB location: 'sqlite:///instance/fitness_shop.db'.
- [x] Remove db.create_all() from the if __name__ == '__main__' block to prevent table recreation on every run.
- [ ] Ensure seeding is handled by running seed_data.py separately if needed.

## Dependent Files to Edit
- server/backend/app.py

## Followup Steps
- Test the app startup to ensure DB connection works.
- Run seed_data.py if initial data is needed.
- Verify routes and functionality.
