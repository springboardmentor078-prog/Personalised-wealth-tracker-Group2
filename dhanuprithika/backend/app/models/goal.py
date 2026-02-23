"""Goal model."""

from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Goal(Base):
    """Financial goal for a user."""

    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    goal_type = Column(String(50), nullable=False)
    target_amount = Column(Numeric(15, 2), nullable=False)
    target_date = Column(Date, nullable=False)
    monthly_contribution = Column(Numeric(15, 2), default=0)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="goals")
