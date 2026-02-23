"""User model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    """User table for authentication and profile."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    risk_profile = Column(String(50), default="moderate")
    kyc_status = Column(String(50), default="unverified")
    created_at = Column(DateTime, default=datetime.utcnow)

    goals = relationship("Goal", back_populates="user")
    investments = relationship("Investment", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
