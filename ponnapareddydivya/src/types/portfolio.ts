export type RiskLevel = 'conservative' | 'moderate' | 'aggressive' | 'very-aggressive';

export interface RiskQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    score: number;
  }[];
}

export interface RiskProfileResult {
  totalScore: number;
  riskLevel: RiskLevel;
  title: string;
  description: string;
  recommendedAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  change: number;
  changePercent: number;
  sector: string;
  type: 'stock' | 'etf' | 'bond' | 'crypto';
}

export interface PortfolioSummary {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface PositionReport {
  position: Position;
  performance: {
    week: number;
    month: number;
    ytd: number;
    year: number;
  };
  metrics: {
    peRatio?: number;
    dividend?: number;
    beta?: number;
    marketCap?: string;
  };
  news: {
    title: string;
    date: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }[];
}
