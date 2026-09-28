"""
GRAM-DISHA — Database Initialization Script
Creates all tables defined in SQLAlchemy ORM models if they don't already exist.
Supports both MySQL and local fallback SQLite.
"""

import sys
import os

# Add parent directory to path so imports work cleanly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base
from app.db.models import (
    UserModel,
    BusinessModel,
    FinancialReportModel,
    FeasibilityReportModel,
    SchemeCatalogModel,
    SchemeApplicationModel,
    InventoryItemModel,
    SalesRecordModel,
    ActionMilestoneModel,
    SupportTicketModel,
    AppNotificationModel,
    DocumentItemModel,
    DishaConversationModel,
    DishaMessageModel,
    MarketPriceModel,
)
from sqlalchemy import inspect


def init_db():
    print("Initializing Gram-Disha Database...")
    print(f"Target Database URL: {engine.url}")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Successfully verified {len(tables)} database tables:")
    for tbl in sorted(tables):
        print(f"  - {tbl}")
    print("Database initialization complete.")


if __name__ == "__main__":
    init_db()
