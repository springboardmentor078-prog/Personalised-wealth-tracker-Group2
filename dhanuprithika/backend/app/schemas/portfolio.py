"""Portfolio schemas."""

from decimal import Decimal
from pydantic import BaseModel
from app.schemas.dashboard import AssetAllocationItem

class PortfolioSummary(BaseModel):
    total_invested: Decimal
    total_current_value: Decimal
    total_profit_loss: Decimal
    asset_allocation: list[AssetAllocationItem]

class AllocationItem(BaseModel):
    asset_class: str
    total_value: float
    percentage: float

class AllocationResponse(BaseModel):
    total_value: float
    allocation: list[AllocationItem]
