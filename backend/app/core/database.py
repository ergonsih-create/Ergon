"""
GRAM-DISHA — Database Engine & Session Manager (SQLAlchemy)
Supports MySQL connection with fallback to SQLite for local development.
"""

import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

Base = declarative_base()

def get_database_engine():
    # Attempt MySQL first if configured
    mysql_url = settings.DATABASE_URL
    try:
        engine = create_engine(
            mysql_url,
            pool_pre_ping=True,
            pool_recycle=3600,
            pool_size=10,
            max_overflow=20,
            echo=False,
            connect_args={"connect_timeout": 2}
        )
        # Verify connection
        with engine.connect() as conn:
            print("Connected successfully to MySQL database.")
            return engine
    except Exception as e:
        # Fallback to persistent SQLite file
        sqlite_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "gram_disha.db")
        print(f"MySQL unavailable ({e.__class__.__name__}). Using persistent SQLite store at {sqlite_path}")
        return create_engine(
            f"sqlite:///{sqlite_path}",
            connect_args={"check_same_thread": False},
            echo=False,
        )

engine = get_database_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator:
    """Dependency injector for request-scoped database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
