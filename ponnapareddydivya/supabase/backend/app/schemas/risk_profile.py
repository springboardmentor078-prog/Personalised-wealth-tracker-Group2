from typing import Dict, Literal
from pydantic import BaseModel, Field


RiskLevel = Literal["conservative", "moderate", "aggressive", "very-aggressive"]


class RiskQuestionOption(BaseModel):
    text: str
    score: int = Field(..., ge=1, le=4)


class RiskQuestion(BaseModel):
    id: int
    question: str
    options: list[RiskQuestionOption]


class RiskAnswers(BaseModel):
    answers: Dict[int, int] = Field(
        ...,
        description="Dictionary mapping question IDs to selected scores",
        example={1: 3, 2: 4, 3: 2, 4: 3, 5: 3, 6: 3, 7: 4}
    )


class RecommendedAllocation(BaseModel):
    stocks: int = Field(..., ge=0, le=100)
    bonds: int = Field(..., ge=0, le=100)
    cash: int = Field(..., ge=0, le=100)
    alternatives: int = Field(..., ge=0, le=100)


class RiskProfileResult(BaseModel):
    total_score: int
    risk_level: RiskLevel
    title: str
    description: str
    recommended_allocation: RecommendedAllocation


class RiskProfileResponse(BaseModel):
    success: bool = True
    data: RiskProfileResult
    message: str = "Risk profile calculated successfully"
