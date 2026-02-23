"""FastAPI application entry point."""

import traceback
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.database import engine, Base

# Import models so they register with Base.metadata before create_all
from app.models import User, Goal, Investment, Transaction  # noqa: F401

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Personalized Wealth Management & Goal Tracker",
    description="Multi-user financial goal planning and portfolio tracking API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Return error details for 500s to aid debugging."""
    tb = traceback.format_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "traceback": tb.split("\n")},
    )


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


# Routers
from app.routers import auth, goals, portfolio, dashboard, profile, investments, transactions

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(goals.router, prefix="/api/goals", tags=["Goals"])
app.include_router(investments.router, prefix="/api/investments", tags=["Investments"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])
