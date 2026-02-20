import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const marketData = [
  { name: "9AM", value: 4520 },
  { name: "10AM", value: 4540 },
  { name: "11AM", value: 4510 },
  { name: "12PM", value: 4580 },
  { name: "1PM", value: 4620 },
  { name: "2PM", value: 4590 },
  { name: "3PM", value: 4650 },
  { name: "4PM", value: 4680 },
];

const indices = [
  { name: "S&P 500", value: "4,680.25", change: 1.24, trending: "up" },
  { name: "NASDAQ", value: "14,892.50", change: 1.58, trending: "up" },
  { name: "DOW", value: "36,124.23", change: -0.32, trending: "down" },
  { name: "NIFTY 50", value: "19,425.35", change: 0.85, trending: "up" },
];

export const MarketOverview = () => {
  return (
    <Card className="p-6 shadow-card border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Market Overview</h3>
        <span className="text-sm text-muted-foreground">Live Updates</span>
      </div>

      {/* Chart */}
      <div className="h-32 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={marketData}>
            <defs>
              <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)'
              }}
              formatter={(value) => [value, 'Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={2}
              fill="url(#marketGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Indices */}
      <div className="grid grid-cols-2 gap-3">
        {indices.map((index) => (
          <div 
            key={index.name}
            className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <p className="text-xs text-muted-foreground mb-1">{index.name}</p>
            <p className="font-display font-semibold text-foreground">{index.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {index.trending === "up" ? (
                <TrendingUp className="w-3 h-3 text-wealth-success" />
              ) : (
                <TrendingDown className="w-3 h-3 text-wealth-danger" />
              )}
              <span className={`text-xs font-medium ${
                index.trending === "up" ? "text-wealth-success" : "text-wealth-danger"
              }`}>
                {index.change >= 0 ? "+" : ""}{index.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
