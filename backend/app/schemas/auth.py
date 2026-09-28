"""
GRAM-DISHA — Authentication Pydantic Schemas
Contracts for user registration, login, token refresh, and profile inspection.
"""

from typing import Optional
from datetime import datetime
from pydantic import Field, EmailStr
from app.schemas.common import CamelModel


class UserRegisterRequest(CamelModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    phone: Optional[str] = None
    role: Optional[str] = "beneficiary"
    category: Optional[str] = "General"
    social_category: Optional[str] = None
    gender: Optional[str] = "male"
    is_differently_abled: Optional[bool] = False
    state: Optional[str] = "Maharashtra"
    district: Optional[str] = "Yavatmal"
    block: Optional[str] = "Pusad"
    preferred_language: Optional[str] = "en"


class UserLoginRequest(CamelModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(CamelModel):
    credential: Optional[str] = None
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    picture: Optional[str] = None


class UserResponse(CamelModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    category: str
    gender: str
    is_differently_abled: bool = False
    state: str
    district: str
    block: Optional[str] = None
    preferred_language: str
    is_active: bool = True
    created_at: Optional[datetime] = None


class AuthTokenResponse(CamelModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 604800  # 7 Days in seconds
    user: UserResponse
