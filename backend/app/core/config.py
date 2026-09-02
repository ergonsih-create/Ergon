"""
GRAM-DISHA — Core Configuration Settings (Pydantic)
Environment management and security settings for production VPS & local dev.
"""

import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "GRAM-DISHA API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # MySQL Database Connection
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_USER: str = os.getenv("MYSQL_USER", "gram_disha_user")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "gram_disha_secure_pass")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "gram_disha_db")
    
    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}?charset=utf8mb4"

    # JWT & Authentication Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "gram_disha_super_secret_jwt_key_2026_sih")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://gramdisha.in",
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
