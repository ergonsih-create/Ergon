"""
GRAM-DISHA — Authentication Domain Router
Endpoints for user registration, login, profile discovery, and OAuth.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.db.models import UserModel
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    GoogleAuthRequest,
    AuthTokenResponse,
    UserResponse
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new citizen/beneficiary account and issue an access token."""
    return AuthService.register(db, req)


@router.post("/login", response_model=AuthTokenResponse)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    """Authenticate with email and password to receive a JWT session token."""
    return AuthService.login(db, req)


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: UserModel = Depends(get_current_user)):
    """Retrieve the currently authenticated user's profile."""
    return UserResponse.model_validate(current_user)


@router.post("/google", response_model=AuthTokenResponse)
def google_authentication(req: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Sign in or register using Google OAuth credentials."""
    return AuthService.google_auth(db, req)
