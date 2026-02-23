"""Dashboard router."""

from decimal import Decimal
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user import User
from app.models.goal import Goal
from app.models.investment import Investment
from app.schemas.dashboard import DashboardSummary, AssetAllocationItem, GoalProgressItem
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = current_user.id
    portfolio_agg = db.query(
        func.coalesce(func.sum(Investment.cost_basis), 0).label("total_invested"),
        func.coalesce(func.sum(Investment.current_value), 0).label("total_current_value"),
    ).filter(Investment.user_id == user_id).first()

    total_invested = Decimal(str(portfolio_agg.total_invested or 0))
    total_current_value = Decimal(str(portfolio_agg.total_current_value or 0))
    total_profit_loss = total_current_value - total_invested

    allocation_rows = db.query(Investment.asset_type, func.sum(Investment.current_value).label("value")).filter(
        Investment.user_id == user_id
    ).group_by(Investment.asset_type).all()

    asset_allocation = []
    for row in allocation_rows:
        value = Decimal(str(row.value or 0))
        pct = float(value / total_current_value * 100) if total_current_value > 0 else 0
        asset_allocation.append(AssetAllocationItem(asset_type=row.asset_type, value=value, percentage=round(pct, 2)))

    active_goals_count = db.query(Goal).filter(Goal.user_id == user_id, Goal.status == "active").count()
    goals = db.query(Goal).filter(Goal.user_id == user_id).limit(10).all()
    goal_progress_summary = [
        GoalProgressItem(id=g.id, goal_type=g.goal_type, target_amount=g.target_amount, target_date=g.target_date.isoformat(),
                        status=g.status, monthly_contribution=g.monthly_contribution)
        for g in goals
    ]

    return DashboardSummary(total_invested=total_invested, total_current_value=total_current_value,
                           total_profit_loss=total_profit_loss, asset_allocation=asset_allocation,
                           active_goals_count=active_goals_count, goal_progress_summary=goal_progress_summary)
