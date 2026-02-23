"""User schemas."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    risk_profile: str
    kyc_status: str
    created_at: datetime


class UserUpdate(BaseModel):
    name: str | None = None
    risk_profile: str | None = None
