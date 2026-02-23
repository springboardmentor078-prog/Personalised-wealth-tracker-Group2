"""Goal schemas."""

from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel


class GoalBase(BaseModel):
    goal_type: str
    target_amount: Decimal
    target_date: date
    monthly_contribution: Decimal = 0
    status: str = "active"


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    goal_type: str | None = None
    target_amount: Decimal | None = None
    target_date: date | None = None
    monthly_contribution: Decimal | None = None
    status: str | None = None


class GoalResponse(GoalBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
