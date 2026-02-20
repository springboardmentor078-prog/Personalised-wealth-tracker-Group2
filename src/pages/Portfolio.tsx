import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Filter, ArrowUpDown, Trash2, Loader2, Sparkles } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useInvestments } from "@/hooks/useInvestments";
import { useRecommendations } from "@/hooks/useRecommendations";
import { AddInvestmentDialog } from "@/components/portfolio/AddInvestmentDialog";

const assetTypeLabels: Record<string, string> = {
  stock: "Stock",
  etf: "ETF",
  mutual_fund: "Mutual Fund",
  bond: "Bond",
  cash: "Cash",
};

const allocationColors: Record<string, string> = {
  stock: "hsl(160, 84%, 39%)",
  etf: "hsl(222, 47%, 20%)",
  mutual_fund: "hsl(45, 93%, 47%)",
  bond: "hsl(215, 16%, 47%)",
  cash: "hsl(200, 50%, 60%)",
};

const Portfolio = () => {
  const { investments, isLoading, deleteInvestment } = useInvestments();
  const { recommendations, generateRecommendation } = useRecommendations();

  const totalValue = investments.reduce((sum, h) => sum + Number(h.current_value), 0);
  const totalCostBasis = investments.reduce((sum, h) => sum + Number(h.cost_basis), 0);
  const totalChange = totalValue - totalCostBasis;
  const totalChangePercent = totalCostBasis > 0 ? (totalChange / totalCostBasis) * 100 : 0;

  // Allocation data for pie chart
  const allocationMap: Record<string, number> = {};
  investments.forEach((inv) => {
    const type = inv.asset_type;
    allocationMap[type] = (allocationMap[type] || 0) + Number(inv.current_value);
  });

  const allocationData = Object.entries(allocationMap).map(([name, value]) => ({
    name: assetTypeLabels[name] || name,
    value: totalValue > 0 ? Math.round((value / totalValue) * 100) : 0,
    color: allocationColors[name] || "hsl(0, 0%, 50%)",
  }));

  const latestRec = recommendations.length > 0 ? recommendations[0] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Your <span className="text-gradient">Portfolio</span>
              </h1>
              <p className="text-muted-foreground">Manage and track your investments</p>
            </div>
            <AddInvestmentDialog />
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Value */}
            <Card className="p-6 shadow-card border-border/50 animate-slide-up">
              <p className="text-sm text-muted-foreground mb-2">Total Portfolio Value</p>
              <p className="font-display text-3xl font-bold text-foreground mb-2">
                ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-2">
                {totalChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-wealth-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-wealth-danger" />
                )}
                <span className={`text-sm font-medium ${totalChange >= 0 ? "text-wealth-success" : "text-wealth-danger"}`}>
                  ${Math.abs(totalChange).toFixed(2)} ({totalChangePercent >= 0 ? "+" : ""}{totalChangePercent.toFixed(2)}%)
                </span>
              </div>
            </Card>

            {/* Allocation Chart */}
            <Card className="p-6 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <p className="text-sm text-muted-foreground mb-4">Asset Allocation</p>
              {allocationData.length > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={allocationData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value">
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {allocationData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-medium text-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No investments yet</p>
              )}
            </Card>

            {/* AI Recommendation */}
            <Card className="p-6 shadow-card border-border/50 bg-accent/5 border-accent/20 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-sm text-accent font-medium mb-2">AI Recommendation</p>
              {latestRec ? (
                <>
                  <p className="font-display text-lg font-semibold text-foreground mb-2">{latestRec.title}</p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{latestRec.recommendation_text}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">Get AI-powered allocation suggestions based on your risk profile and goals.</p>
              )}
              <Button
                variant="accent"
                size="sm"
                onClick={() => generateRecommendation.mutate()}
                disabled={generateRecommendation.isPending}
              >
                {generateRecommendation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {latestRec ? "Refresh" : "Generate"} Recommendations
              </Button>
            </Card>
          </div>

          {/* Holdings Table */}
          {investments.length === 0 ? (
            <Card className="p-12 text-center shadow-card border-border/50">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">No investments yet</h3>
              <p className="text-muted-foreground mb-4">Start building your portfolio by adding your first investment</p>
              <AddInvestmentDialog />
            </Card>
          ) : (
            <Card className="shadow-card border-border/50 overflow-hidden animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-foreground">Holdings ({investments.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Units</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Price</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Cost Basis</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Value</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">P&L</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {investments.map((inv) => {
                      const pl = Number(inv.current_value) - Number(inv.cost_basis);
                      const plPercent = Number(inv.cost_basis) > 0 ? (pl / Number(inv.cost_basis)) * 100 : 0;
                      return (
                        <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{inv.name || inv.symbol}</p>
                              <p className="text-sm text-muted-foreground">{inv.symbol} • {assetTypeLabels[inv.asset_type]}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-foreground">{Number(inv.units)}</td>
                          <td className="px-6 py-4 text-right font-medium text-foreground">${Number(inv.avg_buy_price).toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-foreground">${Number(inv.cost_basis).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right font-display font-semibold text-foreground">${Number(inv.current_value).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <div className={`flex items-center justify-end gap-1 ${pl >= 0 ? "text-wealth-success" : "text-wealth-danger"}`}>
                              {pl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              <span className="font-medium">{plPercent >= 0 ? "+" : ""}{plPercent.toFixed(2)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => deleteInvestment.mutate(inv.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
