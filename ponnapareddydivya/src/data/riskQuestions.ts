import { RiskQuestion, RiskLevel, RiskProfileResult } from '@/types/portfolio';

export const riskQuestions: RiskQuestion[] = [
  {
    id: 1,
    question: "What is your primary investment goal?",
    options: [
      { text: "Preserve my capital with minimal risk", score: 1 },
      { text: "Generate steady income with low to moderate risk", score: 2 },
      { text: "Balance growth and income with moderate risk", score: 3 },
      { text: "Maximize growth, accepting higher volatility", score: 4 }
    ]
  },
  {
    id: 2,
    question: "How long do you plan to keep your money invested?",
    options: [
      { text: "Less than 2 years", score: 1 },
      { text: "2-5 years", score: 2 },
      { text: "5-10 years", score: 3 },
      { text: "More than 10 years", score: 4 }
    ]
  },
  {
    id: 3,
    question: "If your portfolio lost 20% in a month, what would you do?",
    options: [
      { text: "Sell everything immediately", score: 1 },
      { text: "Sell some investments to reduce risk", score: 2 },
      { text: "Hold and wait for recovery", score: 3 },
      { text: "Buy more at the lower prices", score: 4 }
    ]
  },
  {
    id: 4,
    question: "What percentage of your savings does this investment represent?",
    options: [
      { text: "More than 75%", score: 1 },
      { text: "50-75%", score: 2 },
      { text: "25-50%", score: 3 },
      { text: "Less than 25%", score: 4 }
    ]
  },
  {
    id: 5,
    question: "How would you describe your investment knowledge?",
    options: [
      { text: "Very limited - I'm new to investing", score: 1 },
      { text: "Basic - I understand stocks and bonds", score: 2 },
      { text: "Good - I follow markets regularly", score: 3 },
      { text: "Advanced - I actively manage investments", score: 4 }
    ]
  },
  {
    id: 6,
    question: "What is your current age range?",
    options: [
      { text: "60 or older", score: 1 },
      { text: "45-59", score: 2 },
      { text: "30-44", score: 3 },
      { text: "Under 30", score: 4 }
    ]
  },
  {
    id: 7,
    question: "How stable is your current income?",
    options: [
      { text: "Retired or variable income", score: 1 },
      { text: "Somewhat stable with some uncertainty", score: 2 },
      { text: "Stable with good job security", score: 3 },
      { text: "Very stable with high growth potential", score: 4 }
    ]
  }
];

export function calculateRiskProfile(answers: Record<number, number>): RiskProfileResult {
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
  const maxScore = riskQuestions.length * 4;
  const percentage = (totalScore / maxScore) * 100;

  let riskLevel: RiskLevel;
  let title: string;
  let description: string;
  let recommendedAllocation: RiskProfileResult['recommendedAllocation'];

  if (percentage <= 30) {
    riskLevel = 'conservative';
    title = 'Conservative Investor';
    description = 'You prioritize capital preservation over growth. Your portfolio should focus on stable, income-generating investments with minimal volatility.';
    recommendedAllocation = { stocks: 20, bonds: 50, cash: 25, alternatives: 5 };
  } else if (percentage <= 50) {
    riskLevel = 'moderate';
    title = 'Moderate Investor';
    description = 'You seek a balance between growth and stability. Your portfolio should include a mix of growth and income investments.';
    recommendedAllocation = { stocks: 40, bonds: 40, cash: 15, alternatives: 5 };
  } else if (percentage <= 75) {
    riskLevel = 'aggressive';
    title = 'Aggressive Investor';
    description = 'You are comfortable with market volatility in pursuit of higher returns. Your portfolio can handle significant exposure to growth investments.';
    recommendedAllocation = { stocks: 65, bonds: 25, cash: 5, alternatives: 5 };
  } else {
    riskLevel = 'very-aggressive';
    title = 'Very Aggressive Investor';
    description = 'You are focused on maximum growth and can tolerate significant short-term losses. Your portfolio will be heavily weighted toward high-growth investments.';
    recommendedAllocation = { stocks: 80, bonds: 10, cash: 5, alternatives: 5 };
  }

  return {
    totalScore,
    riskLevel,
    title,
    description,
    recommendedAllocation
  };
}
