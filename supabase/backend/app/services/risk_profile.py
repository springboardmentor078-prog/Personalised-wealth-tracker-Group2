from typing import Dict
from app.schemas.risk_profile import (
    RiskQuestion,
    RiskQuestionOption,
    RiskProfileResult,
    RecommendedAllocation,
    RiskLevel
)


class RiskProfileService:
    """Service for calculating risk profiles based on questionnaire answers."""
    
    @staticmethod
    def get_questions() -> list[RiskQuestion]:
        """Get all risk assessment questions."""
        return [
            RiskQuestion(
                id=1,
                question="What is your primary investment goal?",
                options=[
                    RiskQuestionOption(text="Preserve my capital with minimal risk", score=1),
                    RiskQuestionOption(text="Generate steady income with low to moderate risk", score=2),
                    RiskQuestionOption(text="Balance growth and income with moderate risk", score=3),
                    RiskQuestionOption(text="Maximize growth, accepting higher volatility", score=4)
                ]
            ),
            RiskQuestion(
                id=2,
                question="How long do you plan to keep your money invested?",
                options=[
                    RiskQuestionOption(text="Less than 2 years", score=1),
                    RiskQuestionOption(text="2-5 years", score=2),
                    RiskQuestionOption(text="5-10 years", score=3),
                    RiskQuestionOption(text="More than 10 years", score=4)
                ]
            ),
            RiskQuestion(
                id=3,
                question="If your portfolio lost 20% in a month, what would you do?",
                options=[
                    RiskQuestionOption(text="Sell everything immediately", score=1),
                    RiskQuestionOption(text="Sell some investments to reduce risk", score=2),
                    RiskQuestionOption(text="Hold and wait for recovery", score=3),
                    RiskQuestionOption(text="Buy more at the lower prices", score=4)
                ]
            ),
            RiskQuestion(
                id=4,
                question="What percentage of your savings does this investment represent?",
                options=[
                    RiskQuestionOption(text="More than 75%", score=1),
                    RiskQuestionOption(text="50-75%", score=2),
                    RiskQuestionOption(text="25-50%", score=3),
                    RiskQuestionOption(text="Less than 25%", score=4)
                ]
            ),
            RiskQuestion(
                id=5,
                question="How would you describe your investment knowledge?",
                options=[
                    RiskQuestionOption(text="Very limited - I'm new to investing", score=1),
                    RiskQuestionOption(text="Basic - I understand stocks and bonds", score=2),
                    RiskQuestionOption(text="Good - I follow markets regularly", score=3),
                    RiskQuestionOption(text="Advanced - I actively manage investments", score=4)
                ]
            ),
            RiskQuestion(
                id=6,
                question="What is your current age range?",
                options=[
                    RiskQuestionOption(text="60 or older", score=1),
                    RiskQuestionOption(text="45-59", score=2),
                    RiskQuestionOption(text="30-44", score=3),
                    RiskQuestionOption(text="Under 30", score=4)
                ]
            ),
            RiskQuestion(
                id=7,
                question="How stable is your current income?",
                options=[
                    RiskQuestionOption(text="Retired or variable income", score=1),
                    RiskQuestionOption(text="Somewhat stable with some uncertainty", score=2),
                    RiskQuestionOption(text="Stable with good job security", score=3),
                    RiskQuestionOption(text="Very stable with high growth potential", score=4)
                ]
            )
        ]
    
    @staticmethod
    def calculate_risk_profile(answers: Dict[int, int]) -> RiskProfileResult:
        """
        Calculate risk profile based on questionnaire answers.
        
        Args:
            answers: Dictionary mapping question IDs to selected scores
            
        Returns:
            RiskProfileResult with calculated risk level and recommendations
        """
        # Validate all questions are answered
        questions = RiskProfileService.get_questions()
        total_questions = len(questions)
        
        if len(answers) != total_questions:
            raise ValueError(f"Expected {total_questions} answers, got {len(answers)}")
        
        # Calculate total score
        total_score = sum(answers.values())
        max_score = total_questions * 4
        percentage = (total_score / max_score) * 100
        
        # Determine risk level and recommendations
        if percentage <= 30:
            risk_level: RiskLevel = "conservative"
            title = "Conservative Investor"
            description = (
                "You prioritize capital preservation over growth. Your portfolio should "
                "focus on stable, income-generating investments with minimal volatility."
            )
            allocation = RecommendedAllocation(stocks=20, bonds=50, cash=25, alternatives=5)
        elif percentage <= 50:
            risk_level = "moderate"
            title = "Moderate Investor"
            description = (
                "You seek a balance between growth and stability. Your portfolio should "
                "include a mix of growth and income investments."
            )
            allocation = RecommendedAllocation(stocks=40, bonds=40, cash=15, alternatives=5)
        elif percentage <= 75:
            risk_level = "aggressive"
            title = "Aggressive Investor"
            description = (
                "You are comfortable with market volatility in pursuit of higher returns. "
                "Your portfolio can handle significant exposure to growth investments."
            )
            allocation = RecommendedAllocation(stocks=65, bonds=25, cash=5, alternatives=5)
        else:
            risk_level = "very-aggressive"
            title = "Very Aggressive Investor"
            description = (
                "You are focused on maximum growth and can tolerate significant short-term "
                "losses. Your portfolio will be heavily weighted toward high-growth investments."
            )
            allocation = RecommendedAllocation(stocks=80, bonds=10, cash=5, alternatives=5)
        
        return RiskProfileResult(
            total_score=total_score,
            risk_level=risk_level,
            title=title,
            description=description,
            recommended_allocation=allocation
        )
