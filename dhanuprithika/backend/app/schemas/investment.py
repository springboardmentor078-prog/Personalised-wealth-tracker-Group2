"""Investment and transaction schemas."""

from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class InvestmentCreate(BaseModel):
    asset_type: str
    symbol: str
    units: Decimal
    avg_buy_price: Decimal

class InvestmentUpdate(BaseModel):
    units: Decimal | None = None
    avg_buy_price: Decimal | None = None
    cost_basis: Decimal | None = None
    current_value: Decimal | None = None
    last_price: Decimal | None = None


class InvestmentResponse(BaseModel):
    id: int
    user_id: int
    asset_type: str
    symbol: str
    units: Decimal
    avg_buy_price: Decimal
    cost_basis: Decimal
    current_value: Decimal
    last_price: Decimal | None = None
    last_price_at: datetime | None = None

    class Config:
        from_attributes = True


class TransactionCreate(BaseModel):
    symbol: str
    type: str
    quantity: Decimal
    price: Decimal
    fees: Decimal = 0


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    symbol: str
    type: str
    quantity: Decimal
    price: Decimal
    fees: Decimal
    executed_at: datetime

    class Config:
        from_attributes = True
