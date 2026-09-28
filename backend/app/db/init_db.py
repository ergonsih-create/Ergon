"""
GRAM-DISHA — Database Table Auto-Creation & Schema Provisioning
Ensures all required MySQL / SQLite tables are ready on server start.
"""

from app.core.database import engine, Base
import app.db.models  # Ensure all models are imported so Base.metadata has them


def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        print("All database tables verified and initialized successfully.")
    except Exception as e:
        print(f"Error during database table initialization: {e}")


if __name__ == "__main__":
    init_db()
