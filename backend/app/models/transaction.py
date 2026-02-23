"""Transaction model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Transaction(Base):
    """Investment transaction record."""

    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    symbol = Column(String(50), nullable=False)
    type = Column(String(50), nullable=False)
    quantity = Column(Numeric(15, 6), nullable=False)
    price = Column(Numeric(15, 4), nullable=False)
    fees = Column(Numeric(15, 2), default=0)
    executed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")
