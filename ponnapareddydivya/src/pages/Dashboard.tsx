import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useInvestments } from '@/hooks/useInvestments';
import { useTransactions } from '@/hooks/useTransactions';
import { useGoals } from '@/hooks/useGoals';
import { mockInvestments, mockTransactions, mockGoals } from '@/data/mockInvestments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Shield,
  FileText,
  ArrowRight,
  Wallet,
  Briefcase,
  Receipt,
  Target,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { investments: dbInvestments, isLoading: invLoading } = useInvestments();
  const { transactions: dbTransactions, isLoading: txLoading } = useTransactions();
  const { goals: dbGoals, isLoading: goalsLoading } = useGoals();

  const investments = dbInvestments.length > 0 ? dbInvestments : mockInvestments;
  const transactions = dbTransactions.length > 0 ? dbTransactions : mockTransactions;
  const goals = dbGoals.length > 0 ? dbGoals : mockGoals;

  const isLoading = invLoading || txLoading || goalsLoading;

  const totalValue = investments.reduce((sum, inv) => sum + inv.quantity * inv.current_price, 0);
  const totalCost = investments.reduce((sum, inv) => sum + inv.quantity * inv.avg_price, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const activeGoals = goals.filter((g) => g.status === 'active');
  const totalSaved = activeGoals.reduce((s, g) => s + g.current_amount, 0);
  const totalTarget = activeGoals.reduce((s, g) => s + g.target_amount, 0);

  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-12">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground">
              Welcome to Wealth Management
            </h1>
            <p className="text-primary-foreground/80 mt-4 text-lg max-w-2xl">
              Track your investments, manage transactions, set financial goals, and make informed decisions.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link to="/investments"><Briefcase className="h-5 w-5" />My Investments</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/goals"><Target className="h-5 w-5" />Set Goals</Link>
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-white/5 rounded-full translate-y-1/2" />
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Wallet className="h-4 w-4" /> Portfolio Value</div>
              <p className="text-2xl font-display font-bold mt-1">{formatCurrency(totalValue)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {totalGain >= 0 ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                Total Gain/Loss
              </div>
              <p className={cn("text-2xl font-display font-bold mt-1", totalGain >= 0 ? "text-success" : "text-destructive")}>
                {formatCurrency(totalGain)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Briefcase className="h-4 w-4" /> Investments</div>
              <p className="text-2xl font-display font-bold mt-1">{investments.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Target className="h-4 w-4 text-primary" /> Active Goals</div>
              <p className="text-2xl font-display font-bold mt-1">{activeGoals.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display flex items-center gap-2"><Receipt className="h-5 w-5 text-primary" /> Recent Transactions</CardTitle>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link to="/transactions">View All <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground text-sm">No transactions yet</p>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div>
                        <Badge className={cn("capitalize text-xs",
                          tx.type === 'buy' ? 'bg-success/10 text-success' :
                          tx.type === 'sell' ? 'bg-destructive/10 text-destructive' :
                          'bg-primary/10 text-primary'
                        )}>{tx.type}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">{tx.symbol || 'Cash'}</p>
                      </div>
                      <p className="font-medium">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.total_amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Goals Progress</CardTitle>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link to="/goals">View All <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeGoals.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground text-sm">No active goals</p>
              ) : (
                <div className="space-y-4">
                  {activeGoals.slice(0, 4).map((goal) => {
                    const percent = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
                    return (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{goal.name}</span>
                          <span className="text-muted-foreground">{percent.toFixed(0)}%</span>
                        </div>
                        <Progress value={Math.min(percent, 100)} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatCurrency(goal.current_amount)}</span>
                          <span>{formatCurrency(goal.target_amount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                <Link to="/investments"><Briefcase className="h-5 w-5 text-primary" /><span className="text-xs">Investments</span></Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                <Link to="/transactions"><Receipt className="h-5 w-5 text-primary" /><span className="text-xs">Transactions</span></Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                <Link to="/risk-profile"><Shield className="h-5 w-5 text-primary" /><span className="text-xs">Risk Profile</span></Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                <Link to="/reports"><FileText className="h-5 w-5 text-primary" /><span className="text-xs">Reports</span></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
