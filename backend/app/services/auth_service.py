"""
GRAM-DISHA — Authentication Service
Orchestrates user creation, password verification, and JWT session generation.
"""

import uuid
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.db.models import UserModel
from app.core.security import verify_password, get_password_hash, create_access_token
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, GoogleAuthRequest, AuthTokenResponse, UserResponse


class AuthService:
    @staticmethod
    def register(db: Session, req: UserRegisterRequest) -> AuthTokenResponse:
        existing = db.query(UserModel).filter(UserModel.email == req.email.lower()).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"An account with email '{req.email}' is already registered."
            )

        user_id = f"usr_{uuid.uuid4().hex[:12]}"
        hashed_pw = get_password_hash(req.password)
        category_val = req.social_category or req.category or "General"

        user = UserModel(
            id=user_id,
            email=req.email.lower(),
            hashed_password=hashed_pw,
            full_name=req.full_name,
            phone=req.phone,
            role=req.role or "beneficiary",
            category=category_val,
            social_category=category_val,
            gender=req.gender or "male",
            is_differently_abled=bool(req.is_differently_abled),
            state=req.state or "Maharashtra",
            district=req.district or "Yavatmal",
            block=req.block or "Pusad",
            preferred_language=req.preferred_language or "en",
            is_active=True
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token(
            data={"sub": user.id, "email": user.email, "role": user.role}
        )

        return AuthTokenResponse(
            access_token=token,
            token_type="bearer",
            expires_in=604800,
            user=UserResponse.model_validate(user)
        )

    @staticmethod
    def login(db: Session, req: UserLoginRequest) -> AuthTokenResponse:
        user = db.query(UserModel).filter(UserModel.email == req.email.lower()).first()
        if not user or not verify_password(req.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User account is deactivated. Please contact support."
            )

        token = create_access_token(
            data={"sub": user.id, "email": user.email, "role": user.role}
        )

        return AuthTokenResponse(
            access_token=token,
            token_type="bearer",
            expires_in=604800,
            user=UserResponse.model_validate(user)
        )

    @staticmethod
    def google_auth(db: Session, req: GoogleAuthRequest) -> AuthTokenResponse:
        email = (req.email or "").lower()
        if not email and req.credential:
            # Basic fallback for demo Google credential
            email = f"google_user_{uuid.uuid4().hex[:8]}@gramdisha.in"
            name = req.name or "Google Beneficiary"
        else:
            name = req.name or "Beneficiary"

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google authentication token could not be verified."
            )

        user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user:
            user_id = f"usr_{uuid.uuid4().hex[:12]}"
            user = UserModel(
                id=user_id,
                email=email,
                hashed_password=get_password_hash(uuid.uuid4().hex),
                full_name=name,
                role="beneficiary",
                category="General",
                social_category="General",
                gender="male",
                state="Maharashtra",
                district="Yavatmal",
                block="Pusad",
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        token = create_access_token(
            data={"sub": user.id, "email": user.email, "role": user.role}
        )

        return AuthTokenResponse(
            access_token=token,
            token_type="bearer",
            expires_in=604800,
            user=UserResponse.model_validate(user)
        )
