"""
GRAM-DISHA — FastAPI Core Dependencies
Provides request-scoped database sessions, authentication token extraction,
current user resolution, and role-based access control.
"""

from typing import Optional, Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import decode_token
from app.db.models import UserModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_db() -> Generator[Session, None, None]:
    """Provides a transactional database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> UserModel:
    """
    Extracts and validates JWT Bearer token, resolving the persistent UserModel.
    Raises 401 if missing, invalid, or expired.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided. Bearer token required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication session token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    email = payload.get("email")
    
    user = None
    if user_id:
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user and email:
        user = db.query(UserModel).filter(UserModel.email == email).first()
        
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User corresponding to authentication token does not exist.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account has been deactivated.",
        )
        
    return user


def get_optional_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[UserModel]:
    """Returns authenticated UserModel if valid Bearer token provided, else None."""
    if not token:
        return None
    try:
        return get_current_user(db=db, token=token)
    except HTTPException:
        return None


def require_admin(
    current_user: UserModel = Depends(get_current_user)
) -> UserModel:
    """Verifies that the authenticated user possesses administrative privileges."""
    if current_user.role.lower() not in ("admin", "administrator"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required to access this resource.",
        )
    return current_user
