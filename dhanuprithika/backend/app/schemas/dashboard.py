"""Dashboard summary schemas."""

from decimal import Decimal
from pydantic import BaseModel


class AssetAllocationItem(BaseModel):
    asset_type: str
    value: Decimal
    percentage: float


class GoalProgressItem(BaseModel):
    id: int
    goal_type: str
    target_amount: Decimal
    target_date: str
    status: str
    monthly_contribution: Decimal


class DashboardSummary(BaseModel):
    total_invested: Decimal
    total_current_value: Decimal
    total_profit_loss: Decimal
    asset_allocation: list[AssetAllocationItem]
    active_goals_count: int
    goal_progress_summary: list[GoalProgressItem]
