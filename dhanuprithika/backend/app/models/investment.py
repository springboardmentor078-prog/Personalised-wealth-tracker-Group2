"""Investment model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Investment(Base):
    """User's investment holding."""

    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    asset_type = Column(String(50), nullable=False)
    symbol = Column(String(50), nullable=False)
    units = Column(Numeric(15, 6), nullable=False)
    avg_buy_price = Column(Numeric(15, 4), nullable=False)
    cost_basis = Column(Numeric(15, 2), nullable=False)
    current_value = Column(Numeric(15, 2), nullable=False)
    last_price = Column(Numeric(15, 4), nullable=True)
    last_price_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="investments")
