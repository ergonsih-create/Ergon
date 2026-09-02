"""
GRAM-DISHA — FastAPI Application Entrypoint
Smart India Hackathon 2026 (Team ERGON)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.domains.finance.router import router as finance_router
from app.domains.feasibility.router import router as feasibility_router
from app.domains.schemes.router import router as schemes_router
from app.domains.provenance.router import router as provenance_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Domain Routers
app.include_router(finance_router, prefix=settings.API_V1_STR)
app.include_router(feasibility_router, prefix=settings.API_V1_STR)
app.include_router(schemes_router, prefix=settings.API_V1_STR)
app.include_router(provenance_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health & Status"])
def health_check():
    return {
        "status": "healthy",
        "service": "GRAM-DISHA Backend Engine",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "mode": "deterministic_evidence_first",
    }
