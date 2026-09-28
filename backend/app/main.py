"""
GRAM-DISHA — FastAPI Application Entrypoint
Smart India Hackathon 2026 (Team ERGON)
Complete unified router mount supporting all micro-services, deterministic engines,
grounded AI advisory, and role-based authentication.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.init_db import init_db

# Core Domain Routers
from app.domains.auth.router import router as auth_router
from app.domains.business.router import router as business_router
from app.domains.disha.router import router as disha_router
from app.domains.geography.router import router as geography_router
from app.domains.finance.router import router as finance_router
from app.domains.feasibility.router import router as feasibility_router
from app.domains.schemes.router import router as schemes_router
from app.domains.provenance.router import router as provenance_router
from app.domains.whisper.router import router as whisper_router
from app.domains.market.router import router as market_router
from app.domains.documents.router import router as documents_router
from app.domains.applications.router import router as applications_router
from app.domains.inventory.router import router as inventory_router
from app.domains.action_plan.router import router as action_plan_router
from app.domains.progress.router import router as progress_router
from app.domains.learning.router import router as learning_router
from app.domains.support.router import router as support_router
from app.domains.admin.router import router as admin_router
from app.domains.notifications.router import router as notifications_router
from app.domains.profile.router import router as profile_router

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS Middleware for React Vite client & Express Bridge
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers under /api/v1
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(business_router, prefix=settings.API_V1_STR)
app.include_router(disha_router, prefix=settings.API_V1_STR)
app.include_router(geography_router, prefix=settings.API_V1_STR)
app.include_router(finance_router, prefix=settings.API_V1_STR)
app.include_router(feasibility_router, prefix=settings.API_V1_STR)
app.include_router(schemes_router, prefix=settings.API_V1_STR)
app.include_router(provenance_router, prefix=settings.API_V1_STR)
app.include_router(whisper_router, prefix=settings.API_V1_STR)
app.include_router(market_router, prefix=settings.API_V1_STR)
app.include_router(documents_router, prefix=settings.API_V1_STR)
app.include_router(applications_router, prefix=settings.API_V1_STR)
app.include_router(inventory_router, prefix=settings.API_V1_STR)
app.include_router(action_plan_router, prefix=settings.API_V1_STR)
app.include_router(progress_router, prefix=settings.API_V1_STR)
app.include_router(learning_router, prefix=settings.API_V1_STR)
app.include_router(support_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)



@app.get("/health", tags=["Health & Status"])
@app.get("/api/health", tags=["Health & Status"])
def health_check():
    return {
        "status": "healthy",
        "service": "GRAM-DISHA Backend Engine",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "mode": "deterministic_evidence_first",
    }
