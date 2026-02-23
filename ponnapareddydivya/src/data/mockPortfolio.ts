import { Position, PortfolioSummary, PositionReport } from '@/types/portfolio';
import { Investment } from '@/hooks/useInvestments';

export function investmentToPosition(inv: Investment): Position {
  const totalValue = inv.quantity * inv.current_price;
  const costBasis = inv.quantity * inv.avg_price;
  const change = inv.current_price - inv.avg_price;
  const changePercent = inv.avg_price > 0 ? (change / inv.avg_price) * 100 : 0;
  return {
    id: inv.id,
    symbol: inv.symbol,
    name: inv.name,
    quantity: inv.quantity,
    avgPrice: inv.avg_price,
    currentPrice: inv.current_price,
    totalValue,
    change: change,
    changePercent,
    sector: inv.sector || 'Other',
    type: inv.type as Position['type'],
  };
}
export const mockPositions: Position[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 50,
    avgPrice: 145.00,
    currentPrice: 178.50,
    totalValue: 8925.00,
    change: 2.35,
    changePercent: 1.33,
    sector: 'Technology',
    type: 'stock'
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    quantity: 30,
    avgPrice: 280.00,
    currentPrice: 378.20,
    totalValue: 11346.00,
    change: -1.80,
    changePercent: -0.47,
    sector: 'Technology',
    type: 'stock'
  },
  {
    id: '3',
    symbol: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    quantity: 25,
    avgPrice: 380.00,
    currentPrice: 445.30,
    totalValue: 11132.50,
    change: 3.20,
    changePercent: 0.72,
    sector: 'Index Fund',
    type: 'etf'
  },
  {
    id: '4',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    quantity: 20,
    avgPrice: 120.00,
    currentPrice: 141.80,
    totalValue: 2836.00,
    change: 1.45,
    changePercent: 1.03,
    sector: 'Technology',
    type: 'stock'
  },
  {
    id: '5',
    symbol: 'BND',
    name: 'Vanguard Total Bond Market ETF',
    quantity: 100,
    avgPrice: 78.00,
    currentPrice: 72.50,
    totalValue: 7250.00,
    change: -0.25,
    changePercent: -0.34,
    sector: 'Bonds',
    type: 'bond'
  },
  {
    id: '6',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    quantity: 15,
    avgPrice: 450.00,
    currentPrice: 875.30,
    totalValue: 13129.50,
    change: 12.50,
    changePercent: 1.45,
    sector: 'Technology',
    type: 'stock'
  },
  {
    id: '7',
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    quantity: 40,
    avgPrice: 140.00,
    currentPrice: 195.40,
    totalValue: 7816.00,
    change: 0.85,
    changePercent: 0.44,
    sector: 'Financial',
    type: 'stock'
  },
  {
    id: '8',
    symbol: 'VNQ',
    name: 'Vanguard Real Estate ETF',
    quantity: 35,
    avgPrice: 88.00,
    currentPrice: 84.20,
    totalValue: 2947.00,
    change: -0.45,
    changePercent: -0.53,
    sector: 'Real Estate',
    type: 'etf'
  }
];

export function getPortfolioSummary(positions: Position[]): PortfolioSummary {
  const totalValue = positions.reduce((sum, p) => sum + p.totalValue, 0);
  const totalCost = positions.reduce((sum, p) => sum + (p.avgPrice * p.quantity), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = (totalGain / totalCost) * 100;
  const dayChange = positions.reduce((sum, p) => sum + (p.change * p.quantity), 0);
  const dayChangePercent = (dayChange / (totalValue - dayChange)) * 100;

  return {
    totalValue,
    totalGain,
    totalGainPercent,
    dayChange,
    dayChangePercent
  };
}

export function getPositionReport(position: Position): PositionReport {
  // Mock data for demonstration
  const mockPerformance = {
    week: Math.random() * 6 - 3,
    month: Math.random() * 15 - 5,
    ytd: Math.random() * 40 - 10,
    year: Math.random() * 60 - 15
  };

  const mockMetrics = {
    peRatio: position.type === 'stock' ? Math.random() * 40 + 10 : undefined,
    dividend: Math.random() * 4,
    beta: position.type === 'stock' ? Math.random() * 1.5 + 0.5 : undefined,
    marketCap: position.type === 'stock' ? `$${(Math.random() * 2000 + 100).toFixed(0)}B` : undefined
  };

  const mockNews = [
    {
      title: `${position.name} announces quarterly earnings beat`,
      date: '2 hours ago',
      sentiment: 'positive' as const
    },
    {
      title: `Analysts raise price target for ${position.symbol}`,
      date: '1 day ago',
      sentiment: 'positive' as const
    },
    {
      title: `${position.sector} sector faces headwinds amid market volatility`,
      date: '2 days ago',
      sentiment: 'neutral' as const
    }
  ];

  return {
    position,
    performance: mockPerformance,
    metrics: mockMetrics,
    news: mockNews
  };
}
