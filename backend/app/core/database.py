"""
GRAM-DISHA — MySQL Database Session Manager (SQLAlchemy)
Configured for production connection pooling and session lifecycle.
"""

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Engine configuration with connection recycling and pooling
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=10,
    max_overflow=20,
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator:
    """Dependency injector for request-scoped database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
