import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const results = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = timePeriod * 12;
    const invested = monthlyInvestment * months;
    
    const futureValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    
    const returns = futureValue - invested;
    
    return { invested, returns, total: futureValue };
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const chartData = [
    { name: "Invested", value: results.invested, color: "hsl(222, 47%, 20%)" },
    { name: "Returns", value: results.returns, color: "hsl(160, 84%, 39%)" },
  ];

  return (
    <Card className="p-6 shadow-card border-border/50">
      <h3 className="font-display text-xl font-semibold text-foreground mb-6">SIP Calculator</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-8">
          {/* Monthly Investment */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">Monthly Investment</label>
              <span className="font-display font-bold text-accent">
                ₹{monthlyInvestment.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[monthlyInvestment]}
              onValueChange={([value]) => setMonthlyInvestment(value)}
              min={500}
              max={100000}
              step={500}
              className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>₹500</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Expected Return */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">Expected Return (p.a.)</label>
              <span className="font-display font-bold text-accent">{expectedReturn}%</span>
            </div>
            <Slider
              value={[expectedReturn]}
              onValueChange={([value]) => setExpectedReturn(value)}
              min={1}
              max={30}
              step={0.5}
              className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Time Period */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">Time Period</label>
              <span className="font-display font-bold text-accent">{timePeriod} Years</span>
            </div>
            <Slider
              value={[timePeriod]}
              onValueChange={([value]) => setTimePeriod(value)}
              min={1}
              max={40}
              step={1}
              className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 Yr</span>
              <span>40 Yrs</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Invested Amount</span>
              <span className="font-display font-semibold text-foreground">
                ₹{results.invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Est. Returns</span>
              <span className="font-display font-semibold text-wealth-success">
                ₹{results.returns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-accent/10 border border-accent/20">
              <span className="text-sm font-medium text-foreground">Total Value</span>
              <span className="font-display text-xl font-bold text-accent">
                ₹{results.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
