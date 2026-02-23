import { Layout } from '@/components/layout/Layout';
import { useInvestments } from '@/hooks/useInvestments';
import { mockInvestments } from '@/data/mockInvestments';
import { investmentToPosition, getPortfolioSummary } from '@/data/mockPortfolio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, PieChart as PieIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const SECTOR_COLORS: Record<string, string> = {
  'Technology': 'hsl(217, 91%, 60%)',
  'Financial': 'hsl(142, 71%, 45%)',
  'Index Fund': 'hsl(38, 92%, 50%)',
  'Bonds': 'hsl(280, 67%, 60%)',
  'Real Estate': 'hsl(340, 82%, 52%)'
};

export default function PortfolioPage() {
  const navigate = useNavigate();
  const { investments: dbInvestments } = useInvestments();
  const investments = dbInvestments.length > 0 ? dbInvestments : mockInvestments;
  const positions = investments.map(investmentToPosition);
  const summary = getPortfolioSummary(positions);
  const sectorAllocation = positions.reduce((acc, position) => {
    const existing = acc.find(item => item.name === position.sector);
    if (existing) {
      existing.value += position.totalValue;
    } else {
      acc.push({
        name: position.sector,
        value: position.totalValue,
        color: SECTOR_COLORS[position.sector] || 'hsl(220, 10%, 50%)'
      });
    }
    return acc;
  }, [] as { name: string; value: number; color: string }[]);

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

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold">Portfolio</h1>
            <p className="text-muted-foreground mt-2">Track your investments and performance</p>
          </div>
          <Button onClick={() => navigate('/reports')} className="gap-2">
            <FileText className="h-4 w-4" />
            View Reports
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-display font-bold">{formatCurrency(summary.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  summary.totalGain >= 0 ? "bg-success/10" : "bg-destructive/10"
                )}>
                  {summary.totalGain >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-success" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
                  <p className={cn(
                    "text-2xl font-display font-bold",
                    summary.totalGain >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {formatCurrency(summary.totalGain)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  summary.totalGainPercent >= 0 ? "bg-success/10" : "bg-destructive/10"
                )}>
                  <Percent className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Return</p>
                  <p className={cn(
                    "text-2xl font-display font-bold",
                    summary.totalGainPercent >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {formatPercent(summary.totalGainPercent)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  summary.dayChange >= 0 ? "bg-success/10" : "bg-destructive/10"
                )}>
                  {summary.dayChange >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-success" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Day Change</p>
                  <p className={cn(
                    "text-2xl font-display font-bold",
                    summary.dayChange >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {formatCurrency(summary.dayChange)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Positions Table */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display">Positions</CardTitle>
              <CardDescription>Your current investment holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position) => (
                      <TableRow 
                        key={position.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/reports?symbol=${position.symbol}`)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-semibold">{position.symbol}</p>
                            <p className="text-xs text-muted-foreground">{position.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>{position.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(position.currentPrice)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(position.totalValue)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={position.changePercent >= 0 ? "default" : "destructive"} className={cn(
                            position.changePercent >= 0 ? "bg-success/10 text-success hover:bg-success/20" : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                          )}>
                            {formatPercent(position.changePercent)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Sector Allocation */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <PieIcon className="h-5 w-5" />
                Sector Allocation
              </CardTitle>
              <CardDescription>Portfolio distribution by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {sectorAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
