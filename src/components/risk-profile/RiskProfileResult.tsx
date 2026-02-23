import { useRiskProfile } from '@/context/RiskProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { RefreshCw, Shield, TrendingUp, Wallet, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = {
  stocks: 'hsl(217, 91%, 60%)',
  bonds: 'hsl(142, 71%, 45%)',
  cash: 'hsl(38, 92%, 50%)',
  alternatives: 'hsl(280, 67%, 60%)'
};

const riskLevelStyles = {
  'conservative': {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/30',
    icon: Shield
  },
  'moderate': {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/30',
    icon: TrendingUp
  },
  'aggressive': {
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/30',
    icon: TrendingUp
  },
  'very-aggressive': {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/30',
    icon: TrendingUp
  }
};

export function RiskProfileResult() {
  const { result, resetProfile, totalQuestions } = useRiskProfile();

  if (!result) return null;

  const style = riskLevelStyles[result.riskLevel];
  const Icon = style.icon;

  const chartData = [
    { name: 'Stocks', value: result.recommendedAllocation.stocks, color: COLORS.stocks },
    { name: 'Bonds', value: result.recommendedAllocation.bonds, color: COLORS.bonds },
    { name: 'Cash', value: result.recommendedAllocation.cash, color: COLORS.cash },
    { name: 'Alternatives', value: result.recommendedAllocation.alternatives, color: COLORS.alternatives }
  ];

  const maxScore = totalQuestions * 4;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Main Result Card */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <div className={cn("p-6", style.bg)}>
          <div className="flex items-center gap-4">
            <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl", style.bg, style.border, "border-2")}>
              <Icon className={cn("h-8 w-8", style.text)} />
            </div>
            <div>
              <h2 className={cn("text-2xl font-display font-bold", style.text)}>
                {result.title}
              </h2>
              <p className="text-muted-foreground">
                Risk Score: {result.totalScore} / {maxScore}
              </p>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {result.description}
          </p>
        </CardContent>
      </Card>

      {/* Allocation Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display">Recommended Allocation</CardTitle>
            <CardDescription>Based on your risk profile assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display">Allocation Breakdown</CardTitle>
            <CardDescription>Percentage distribution of your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {chartData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <Progress 
                  value={item.value} 
                  className="h-2"
                  style={{ 
                    '--progress-color': item.color 
                  } as React.CSSProperties}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <Button onClick={resetProfile} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retake Assessment
        </Button>
      </div>
    </div>
  );
}
