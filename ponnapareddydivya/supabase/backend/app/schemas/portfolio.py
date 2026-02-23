from typing import Literal, Optional
from pydantic import BaseModel, Field
from datetime import datetime


PositionType = Literal["stock", "etf", "bond", "crypto"]
SentimentType = Literal["positive", "negative", "neutral"]


class Position(BaseModel):
    id: str
    symbol: str
    name: str
    quantity: float = Field(..., gt=0)
    avg_price: float = Field(..., gt=0)
    current_price: float = Field(..., gt=0)
    total_value: float
    change: float
    change_percent: float
    sector: str
    type: PositionType


class PositionCreate(BaseModel):
    symbol: str = Field(..., min_length=1, max_length=10)
    name: str = Field(..., min_length=1)
    quantity: float = Field(..., gt=0)
    avg_price: float = Field(..., gt=0)
    current_price: float = Field(..., gt=0)
    sector: str
    type: PositionType


class PortfolioSummary(BaseModel):
    total_value: float
    total_gain: float
    total_gain_percent: float
    day_change: float
    day_change_percent: float


class PositionPerformance(BaseModel):
    week: float
    month: float
    ytd: float
    year: float


class PositionMetrics(BaseModel):
    pe_ratio: Optional[float] = None
    dividend: Optional[float] = None
    beta: Optional[float] = None
    market_cap: Optional[str] = None


class NewsItem(BaseModel):
    title: str
    date: str
    sentiment: SentimentType


class PositionReport(BaseModel):
    position: Position
    performance: PositionPerformance
    metrics: PositionMetrics
    news: list[NewsItem]


class Goal(BaseModel):
    id: str
    name: str
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(..., ge=0)
    deadline: str
    category: str
    priority: Literal["high", "medium", "low"]
    description: Optional[str] = None


class GoalCreate(BaseModel):
    name: str = Field(..., min_length=1)
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(default=0, ge=0)
    deadline: str
    category: str
    priority: Literal["high", "medium", "low"] = "medium"
    description: Optional[str] = None


class Transaction(BaseModel):
    id: str
    date: str
    type: Literal["buy", "sell", "dividend", "deposit", "withdrawal"]
    symbol: Optional[str] = None
    quantity: Optional[float] = None
    price: Optional[float] = None
    amount: float
    description: str


class TransactionCreate(BaseModel):
    type: Literal["buy", "sell", "dividend", "deposit", "withdrawal"]
    symbol: Optional[str] = None
    quantity: Optional[float] = None
    price: Optional[float] = None
    amount: float
    description: str
