"""Goals router."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.get("", response_model=list[GoalResponse])
def list_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Goal).filter(Goal.user_id == current_user.id).all()


@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(data: GoalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = Goal(user_id=current_user.id, goal_type=data.goal_type, target_amount=data.target_amount,
                target_date=data.target_date, monthly_contribution=data.monthly_contribution, status=data.status)
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(goal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return goal


@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: int, data: GoalUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return None
