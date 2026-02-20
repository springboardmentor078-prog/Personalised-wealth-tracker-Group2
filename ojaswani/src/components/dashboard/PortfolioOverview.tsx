import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useInvestments } from "@/hooks/useInvestments";

const assetColors: Record<string, string> = {
  stock: "hsl(160, 84%, 39%)",
  etf: "hsl(222, 47%, 20%)",
  mutual_fund: "hsl(45, 93%, 47%)",
  bond: "hsl(215, 16%, 47%)",
  cash: "hsl(200, 50%, 60%)",
};

const assetLabels: Record<string, string> = {
  stock: "Stocks",
  etf: "ETFs",
  mutual_fund: "Mutual Funds",
  bond: "Bonds",
  cash: "Cash",
};

export const PortfolioOverview = () => {
  const { investments } = useInvestments();

  const totalValue = investments.reduce((sum, inv) => sum + Number(inv.current_value), 0);
  const totalCostBasis = investments.reduce((sum, inv) => sum + Number(inv.cost_basis), 0);
  const dayChange = totalValue - totalCostBasis;
  const dayChangePercent = totalCostBasis > 0 ? (dayChange / totalCostBasis) * 100 : 0;

  // Allocation data
  const allocationMap: Record<string, number> = {};
  investments.forEach((inv) => {
    allocationMap[inv.asset_type] = (allocationMap[inv.asset_type] || 0) + Number(inv.current_value);
  });

  const portfolioData = Object.entries(allocationMap).map(([type, value]) => ({
    name: assetLabels[type] || type,
    value: totalValue > 0 ? Math.round((value / totalValue) * 100) : 0,
    color: assetColors[type] || "hsl(0, 0%, 50%)",
  }));

  return (
    <Card className="p-6 shadow-card border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Portfolio Overview</h3>
        <span className="text-sm text-muted-foreground">Live</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            {portfolioData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, ""]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="font-display text-xl font-bold text-foreground">
                {totalValue >= 1000 ? `$${(totalValue / 1000).toFixed(1)}K` : `$${totalValue.toFixed(0)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Total Value</p>
            <p className="font-display text-2xl font-bold text-foreground">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {dayChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-wealth-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-wealth-danger" />
              )}
              <span className={`text-sm font-medium ${dayChange >= 0 ? "text-wealth-success" : "text-wealth-danger"}`}>
                ${Math.abs(dayChange).toLocaleString()} ({dayChangePercent >= 0 ? "+" : ""}{dayChangePercent.toFixed(2)}%)
              </span>
              <span className="text-sm text-muted-foreground">P&L</span>
            </div>
          </div>

          {/* Legend */}
          {portfolioData.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {portfolioData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-medium text-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Add investments to see allocation</p>
          )}
        </div>
      </div>
    </Card>
  );
};
