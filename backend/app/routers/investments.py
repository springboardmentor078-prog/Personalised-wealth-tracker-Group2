"""Investments router."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.investment import Investment
from app.schemas.investment import InvestmentCreate, InvestmentUpdate, InvestmentResponse
from app.auth.dependencies import get_current_user

router = APIRouter()

@router.get("", response_model=list[InvestmentResponse])
def list_investments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Investment).filter(Investment.user_id == current_user.id).all()

@router.post("", response_model=InvestmentResponse, status_code=status.HTTP_201_CREATED)
def create_investment(data: InvestmentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cost_basis = data.units * data.avg_buy_price
    existing = db.query(Investment).filter(Investment.user_id == current_user.id, Investment.symbol == data.symbol).first()
    if existing:
        total_units = existing.units + data.units
        total_cost = existing.cost_basis + cost_basis
        existing.units = total_units
        existing.avg_buy_price = total_cost / total_units
        existing.cost_basis = total_cost
        existing.current_value = total_cost
        existing.last_price = data.avg_buy_price
        db.commit()
        db.refresh(existing)
        return existing
        
    investment = Investment(
        user_id=current_user.id,
        asset_type=data.asset_type,
        symbol=data.symbol,
        units=data.units,
        avg_buy_price=data.avg_buy_price,
        cost_basis=cost_basis,
        current_value=cost_basis,
        last_price=data.avg_buy_price
    )
    db.add(investment)
    db.commit()
    db.refresh(investment)
    return investment

@router.put("/{investment_id}", response_model=InvestmentResponse)
def update_investment(investment_id: int, data: InvestmentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    investment = db.query(Investment).filter(Investment.id == investment_id, Investment.user_id == current_user.id).first()
    if not investment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investment not found")
        
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(investment, field, value)
        
    db.commit()
    db.refresh(investment)
    return investment

@router.delete("/{investment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_investment(investment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    investment = db.query(Investment).filter(Investment.id == investment_id, Investment.user_id == current_user.id).first()
    if not investment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investment not found")
        
    db.delete(investment)
    db.commit()
    return None
