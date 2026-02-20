import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Trash2, Loader2, DollarSign, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useInvestments } from "@/hooks/useInvestments";
import { AddInvestmentDialog } from "@/components/portfolio/AddInvestmentDialog";

const assetTypeLabels: Record<string, string> = {
  stock: "Stock", etf: "ETF", mutual_fund: "Mutual Fund", bond: "Bond", cash: "Cash",
};

const allocationColors: Record<string, string> = {
  stock: "hsl(160, 84%, 39%)", etf: "hsl(222, 47%, 20%)", mutual_fund: "hsl(45, 93%, 47%)",
  bond: "hsl(215, 16%, 47%)", cash: "hsl(200, 50%, 60%)",
};

const Investments = () => {
  const { investments, isLoading, deleteInvestment } = useInvestments();

  const totalValue = investments.reduce((sum, h) => sum + Number(h.current_value), 0);
  const totalCostBasis = investments.reduce((sum, h) => sum + Number(h.cost_basis), 0);
  const totalGainLoss = totalValue - totalCostBasis;
  const totalReturn = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;
  const totalUnits = investments.reduce((sum, h) => sum + Number(h.units), 0);

  const allocationMap: Record<string, number> = {};
  investments.forEach((inv) => {
    allocationMap[inv.asset_type] = (allocationMap[inv.asset_type] || 0) + Number(inv.current_value);
  });
  const allocationData = Object.entries(allocationMap).map(([name, value]) => ({
    name: assetTypeLabels[name] || name,
    value: totalValue > 0 ? Math.round((value / totalValue) * 100) : 0,
    color: allocationColors[name] || "hsl(0, 0%, 50%)",
  }));

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                <span className="text-gradient">Investments</span>
              </h1>
              <p className="text-muted-foreground">Detailed view of all your holdings</p>
            </div>
            <AddInvestmentDialog />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-5 shadow-card border-border/50 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="font-display text-xl font-bold text-foreground">
                    ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.05s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Shares</p>
                  <p className="font-display text-xl font-bold text-foreground">{totalUnits.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${totalGainLoss >= 0 ? "bg-wealth-success/10" : "bg-wealth-danger/10"}`}>
                  {totalGainLoss >= 0 ? <TrendingUp className="w-5 h-5 text-wealth-success" /> : <TrendingDown className="w-5 h-5 text-wealth-danger" />}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gain/Loss</p>
                  <p className={`font-display text-xl font-bold ${totalGainLoss >= 0 ? "text-wealth-success" : "text-wealth-danger"}`}>
                    ${Math.abs(totalGainLoss).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${totalReturn >= 0 ? "bg-wealth-success/10" : "bg-wealth-danger/10"}`}>
                  <PieChartIcon className={`w-5 h-5 ${totalReturn >= 0 ? "text-wealth-success" : "text-wealth-danger"}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Return</p>
                  <p className={`font-display text-xl font-bold ${totalReturn >= 0 ? "text-wealth-success" : "text-wealth-danger"}`}>
                    {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(2)}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Allocation + Holdings */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Allocation Sidebar */}
            {allocationData.length > 0 && (
              <Card className="p-6 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <h3 className="font-display text-sm font-semibold text-foreground mb-4">Allocation</h3>
                <div className="w-32 h-32 mx-auto mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={allocationData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value">
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
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
              </Card>
            )}

            {/* Holdings Table */}
            <div className={allocationData.length > 0 ? "lg:col-span-3" : "lg:col-span-4"}>
              {investments.length === 0 ? (
                <Card className="p-12 text-center shadow-card border-border/50">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">No investments yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first investment to get started</p>
                  <AddInvestmentDialog />
                </Card>
              ) : (
                <Card className="shadow-card border-border/50 overflow-hidden animate-slide-up" style={{ animationDelay: "0.25s" }}>
                  <div className="p-6 border-b border-border/50">
                    <h3 className="font-display text-lg font-semibold text-foreground">All Holdings ({investments.length})</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
                          <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Units</th>
                          <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Price</th>
                          <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Price</th>
                          <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Cost Basis</th>
                          <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
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
                                <p className="font-medium text-foreground">{inv.symbol}</p>
                                <p className="text-sm text-muted-foreground">{inv.name || assetTypeLabels[inv.asset_type]}</p>
                              </td>
                              <td className="px-6 py-4 text-right text-foreground">{Number(inv.units)}</td>
                              <td className="px-6 py-4 text-right text-foreground">${Number(inv.avg_buy_price).toFixed(2)}</td>
                              <td className="px-6 py-4 text-right text-foreground">${Number(inv.last_price).toFixed(2)}</td>
                              <td className="px-6 py-4 text-right text-foreground">${Number(inv.cost_basis).toLocaleString()}</td>
                              <td className="px-6 py-4 text-right font-display font-semibold text-foreground">${Number(inv.current_value).toLocaleString()}</td>
                              <td className="px-6 py-4 text-right">
                                <div className={`flex items-center justify-end gap-1 ${pl >= 0 ? "text-wealth-success" : "text-wealth-danger"}`}>
                                  {pl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                  <span className="text-sm font-medium">${Math.abs(pl).toFixed(2)} ({plPercent >= 0 ? "+" : ""}{plPercent.toFixed(1)}%)</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => deleteInvestment.mutate(inv.id)}>
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Investments;
