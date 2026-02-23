import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useInvestments } from '@/hooks/useInvestments';
import { mockInvestments } from '@/data/mockInvestments';
import { investmentToPosition, getPositionReport } from '@/data/mockPortfolio';
import { PositionReport } from '@/types/portfolio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Calendar,
  DollarSign,
  BarChart3,
  Newspaper,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
  const [searchParams] = useSearchParams();
  const { investments: dbInvestments } = useInvestments();
  const investments = dbInvestments.length > 0 ? dbInvestments : mockInvestments;
  const positions = useMemo(() => investments.map(investmentToPosition), [investments]);
  const initialSymbol = searchParams.get('symbol') || positions[0]?.symbol || '';
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [report, setReport] = useState<PositionReport | null>(null);

  const selectedPosition = positions.find(p => p.symbol === selectedSymbol);

  useEffect(() => {
    if (selectedPosition) {
      setReport(getPositionReport(selectedPosition));
    }
  }, [selectedSymbol, selectedPosition]);

  if (!selectedPosition || !report) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const performanceData = [
    { period: '1W', value: report.performance.week },
    { period: '1M', value: report.performance.month },
    { period: 'YTD', value: report.performance.ytd },
    { period: '1Y', value: report.performance.year },
  ];

  // Mock price history data
  const priceHistory = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    price: selectedPosition.currentPrice * (0.9 + Math.random() * 0.2)
  }));

  const gainLoss = (selectedPosition.currentPrice - selectedPosition.avgPrice) * selectedPosition.quantity;
  const gainLossPercent = ((selectedPosition.currentPrice - selectedPosition.avgPrice) / selectedPosition.avgPrice) * 100;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold flex items-center gap-3">
              <FileText className="h-10 w-10 text-primary" />
              Position Reports
            </h1>
            <p className="text-muted-foreground mt-2">Detailed analysis of your holdings</p>
          </div>
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((position) => (
                <SelectItem key={position.id} value={position.symbol}>
                  {position.symbol} - {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Position Header */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="gradient-primary p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-primary-foreground">
                <h2 className="text-3xl font-display font-bold">{selectedPosition.symbol}</h2>
                <p className="text-primary-foreground/80">{selectedPosition.name}</p>
              </div>
              <div className="text-right text-primary-foreground">
                <p className="text-4xl font-display font-bold">{formatCurrency(selectedPosition.currentPrice)}</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  {selectedPosition.changePercent >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{formatPercent(selectedPosition.changePercent)} today</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="font-bold">{formatCurrency(selectedPosition.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-bold">{selectedPosition.quantity} shares</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  gainLoss >= 0 ? "bg-success/10" : "bg-destructive/10"
                )}>
                  {gainLoss >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gain/Loss</p>
                  <p className={cn(
                    "font-bold",
                    gainLoss >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {formatCurrency(gainLoss)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  gainLossPercent >= 0 ? "bg-success/10" : "bg-destructive/10"
                )}>
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Return</p>
                  <p className={cn(
                    "font-bold",
                    gainLossPercent >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {formatPercent(gainLossPercent)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-display">Period Performance</CardTitle>
                  <CardDescription>Returns over different time periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="period" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Return']} />
                        <Bar
                          dataKey="value"
                          fill="hsl(217, 91%, 60%)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Price History */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-display">30-Day Price History</CardTitle>
                  <CardDescription>Daily closing prices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="day" />
                        <YAxis 
                          domain={['auto', 'auto']} 
                          tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <Tooltip formatter={(value: number) => [formatCurrency(value), 'Price']} />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="hsl(217, 91%, 60%)"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display">Key Metrics</CardTitle>
                <CardDescription>Fundamental analysis data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {report.metrics.peRatio && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">P/E Ratio</p>
                      <p className="text-2xl font-bold">{report.metrics.peRatio.toFixed(2)}</p>
                    </div>
                  )}
                  {report.metrics.dividend !== undefined && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Dividend Yield</p>
                      <p className="text-2xl font-bold">{report.metrics.dividend.toFixed(2)}%</p>
                    </div>
                  )}
                  {report.metrics.beta && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Beta</p>
                      <p className="text-2xl font-bold">{report.metrics.beta.toFixed(2)}</p>
                    </div>
                  )}
                  {report.metrics.marketCap && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Market Cap</p>
                      <p className="text-2xl font-bold">{report.metrics.marketCap}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-semibold mb-4">Position Details</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Avg. Cost</p>
                      <p className="text-lg font-semibold">{formatCurrency(selectedPosition.avgPrice)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Current Price</p>
                      <p className="text-lg font-semibold">{formatCurrency(selectedPosition.currentPrice)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Cost Basis</p>
                      <p className="text-lg font-semibold">{formatCurrency(selectedPosition.avgPrice * selectedPosition.quantity)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Sector</p>
                      <Badge variant="secondary">{selectedPosition.sector}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Newspaper className="h-5 w-5" />
                  Recent News
                </CardTitle>
                <CardDescription>Latest news and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.news.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        item.sentiment === 'positive' ? "bg-success/10" :
                        item.sentiment === 'negative' ? "bg-destructive/10" : "bg-muted"
                      )}>
                        {item.sentiment === 'positive' ? (
                          <TrendingUp className="h-5 w-5 text-success" />
                        ) : item.sentiment === 'negative' ? (
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        ) : (
                          <Newspaper className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {item.date}
                        </p>
                      </div>
                      <Badge variant={
                        item.sentiment === 'positive' ? 'default' :
                        item.sentiment === 'negative' ? 'destructive' : 'secondary'
                      } className={cn(
                        item.sentiment === 'positive' ? "bg-success/10 text-success" :
                        item.sentiment === 'negative' ? "bg-destructive/10 text-destructive" : ""
                      )}>
                        {item.sentiment}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
