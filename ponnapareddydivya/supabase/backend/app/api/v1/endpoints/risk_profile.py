from fastapi import APIRouter, HTTPException, status
from app.schemas.risk_profile import (
    RiskQuestion,
    RiskAnswers,
    RiskProfileResponse,
    RiskProfileResult
)
from app.services.risk_profile import RiskProfileService

router = APIRouter()


@router.get(
    "/questions",
    response_model=list[RiskQuestion],
    summary="Get Risk Assessment Questions",
    description="Retrieve all questions for the risk profile assessment questionnaire."
)
async def get_risk_questions():
    """
    Get all risk assessment questions.
    
    Returns a list of questions with multiple choice options that users
    can answer to determine their investment risk profile.
    """
    return RiskProfileService.get_questions()


@router.post(
    "/calculate",
    response_model=RiskProfileResponse,
    summary="Calculate Risk Profile",
    description="Calculate user's risk profile based on questionnaire answers.",
    status_code=status.HTTP_200_OK
)
async def calculate_risk_profile(answers: RiskAnswers):
    """
    Calculate risk profile based on questionnaire answers.
    
    Analyzes the user's answers to determine their risk tolerance and
    provides personalized investment recommendations including:
    - Risk level classification (conservative, moderate, aggressive, very-aggressive)
    - Recommended asset allocation percentages
    - Investment strategy description
    
    Args:
        answers: Dictionary mapping question IDs to selected answer scores
        
    Returns:
        RiskProfileResponse with calculated results and recommendations
        
    Raises:
        HTTPException: If answers are invalid or incomplete
    """
    try:
        result = RiskProfileService.calculate_risk_profile(answers.answers)
        return RiskProfileResponse(
            success=True,
            data=result,
            message="Risk profile calculated successfully"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while calculating risk profile: {str(e)}"
        )
