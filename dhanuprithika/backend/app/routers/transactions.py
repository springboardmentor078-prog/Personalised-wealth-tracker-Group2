"""Transactions router."""

from decimal import Decimal
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.investment import Investment
from app.models.transaction import Transaction
from app.schemas.investment import TransactionCreate, TransactionResponse
from pydantic import BaseModel
from app.auth.dependencies import get_current_user

router = APIRouter()

class TransactionUpdate(BaseModel):
    symbol: str | None = None
    type: str | None = None
    quantity: Decimal | None = None
    price: Decimal | None = None
    fees: Decimal | None = None

@router.get("", response_model=list[TransactionResponse])
def list_transactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.executed_at.desc()).all()


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def record_transaction(data: TransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    transaction = Transaction(user_id=current_user.id, symbol=data.symbol, type=data.type,
                             quantity=data.quantity, price=data.price, fees=data.fees)
    db.add(transaction)
    
    # Update portfolio logic as it was in portfolio.py
    if data.type in ("buy", "contribution"):
        cost_basis = data.quantity * data.price
        existing = db.query(Investment).filter(Investment.user_id == current_user.id, Investment.symbol == data.symbol).first()
        if existing:
            total_units = existing.units + data.quantity
            total_cost = existing.cost_basis + cost_basis
            existing.units = total_units
            existing.avg_buy_price = total_cost / total_units if total_units > 0 else 0
            existing.cost_basis = total_cost
            existing.current_value = existing.current_value + cost_basis
            existing.last_price = data.price
        else:
            inv = Investment(user_id=current_user.id, asset_type="stock", symbol=data.symbol, units=data.quantity,
                            avg_buy_price=data.price, cost_basis=cost_basis, current_value=cost_basis, last_price=data.price)
            db.add(inv)
    elif data.type in ("sell", "withdrawal"):
        existing = db.query(Investment).filter(Investment.user_id == current_user.id, Investment.symbol == data.symbol).first()
        if existing:
            old_units = existing.units
            existing.units = existing.units - data.quantity
            if existing.units <= 0:
                db.delete(existing)
            else:
                proportion_sold = float(data.quantity) / float(old_units)
                existing.cost_basis = existing.cost_basis * (1 - Decimal(str(proportion_sold)))
                existing.current_value = existing.current_value * (1 - Decimal(str(proportion_sold)))
                existing.last_price = data.price
                
    db.commit()
    db.refresh(transaction)
    return transaction

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(transaction_id: int, data: TransactionUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
        
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(transaction, field, value)
        
    db.commit()
    db.refresh(transaction)
    return transaction

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
        
    db.delete(transaction)
    db.commit()
    return None
