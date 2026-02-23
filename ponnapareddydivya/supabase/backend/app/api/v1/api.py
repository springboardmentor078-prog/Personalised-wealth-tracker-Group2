from fastapi import APIRouter
from app.api.v1.endpoints import risk_profile, portfolio, prices

api_router = APIRouter()

api_router.include_router(
    risk_profile.router,
    prefix="/risk-profile",
    tags=["Risk Profile"]
)

api_router.include_router(
    portfolio.router,
    prefix="/portfolio",
    tags=["Portfolio"]
)

api_router.include_router(
    prices.router,
    prefix="/prices",
    tags=["Prices"]
)
