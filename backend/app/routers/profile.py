"""Profile router."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_profile(data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if data.name is not None:
        current_user.name = data.name
    if data.risk_profile is not None:
        current_user.risk_profile = data.risk_profile
    db.commit()
    db.refresh(current_user)
    return current_user
