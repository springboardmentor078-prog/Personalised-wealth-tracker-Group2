import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, Download, TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useInvestments } from "@/hooks/useInvestments";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import { useProfile } from "@/hooks/useProfile";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const assetTypeLabels: Record<string, string> = {
  stock: "Stock", etf: "ETF", mutual_fund: "Mutual Fund", bond: "Bond", cash: "Cash",
};

const Reports = () => {
  const { investments, isLoading: invLoading } = useInvestments();
  const { transactions, isLoading: txLoading } = useTransactions();
  const { goals, isLoading: goalsLoading } = useGoals();
  const { profile } = useProfile();
  const [selectedSymbol, setSelectedSymbol] = useState<string>("all");

  const isLoading = invLoading || txLoading || goalsLoading;

  const filteredInvestments = selectedSymbol === "all" ? investments : investments.filter((i) => i.symbol === selectedSymbol);

  const selectedInv = selectedSymbol !== "all" ? investments.find((i) => i.symbol === selectedSymbol) : null;

  const totalValue = filteredInvestments.reduce((s, i) => s + Number(i.current_value), 0);
  const totalCost = filteredInvestments.reduce((s, i) => s + Number(i.cost_basis), 0);
  const totalUnits = filteredInvestments.reduce((s, i) => s + Number(i.units), 0);
  const gainLoss = totalValue - totalCost;
  const returnPct = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

  // Period performance mock data based on actual P&L
  const periodData = [
    { name: "1W", value: returnPct * 0.1 },
    { name: "1M", value: returnPct * 0.3 },
    { name: "3M", value: returnPct * 0.6 },
    { name: "6M", value: returnPct * 0.8 },
    { name: "1Y", value: returnPct },
  ];

  // Price history mock
  const priceHistory = Array.from({ length: 30 }, (_, i) => {
    const basePrice = selectedInv ? Number(selectedInv.last_price) : totalValue / Math.max(totalUnits, 1);
    return {
      day: i + 1,
      price: basePrice * (1 + (Math.sin(i * 0.5) * 0.03) + (Math.random() - 0.5) * 0.02),
    };
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("WealthWise - Position Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Risk Profile: ${profile?.risk_profile || "N/A"}`, 14, 36);

    // Portfolio Summary
    doc.setFontSize(14);
    doc.text("Portfolio Summary", 14, 48);
    autoTable(doc, {
      startY: 52,
      head: [["Metric", "Value"]],
      body: [
        ["Total Value", `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
        ["Total Cost Basis", `$${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
        ["Gain/Loss", `$${gainLoss.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
        ["Return", `${returnPct.toFixed(2)}%`],
        ["Total Positions", `${investments.length}`],
      ],
    });

    // Holdings
    doc.setFontSize(14);
    const afterSummary = (doc as any).lastAutoTable?.finalY || 90;
    doc.text("Holdings", 14, afterSummary + 12);
    autoTable(doc, {
      startY: afterSummary + 16,
      head: [["Symbol", "Name", "Type", "Units", "Avg Price", "Cost Basis", "Current Value", "P&L"]],
      body: filteredInvestments.map((inv) => {
        const pl = Number(inv.current_value) - Number(inv.cost_basis);
        return [
          inv.symbol,
          inv.name || "-",
          assetTypeLabels[inv.asset_type],
          Number(inv.units).toString(),
          `$${Number(inv.avg_buy_price).toFixed(2)}`,
          `$${Number(inv.cost_basis).toLocaleString()}`,
          `$${Number(inv.current_value).toLocaleString()}`,
          `$${pl.toFixed(2)}`,
        ];
      }),
    });

    // Goals
    if (goals.length > 0) {
      const afterHoldings = (doc as any).lastAutoTable?.finalY || 150;
      doc.setFontSize(14);
      doc.text("Financial Goals", 14, afterHoldings + 12);
      autoTable(doc, {
        startY: afterHoldings + 16,
        head: [["Goal", "Type", "Target", "Current", "Progress", "Target Date"]],
        body: goals.map((g) => {
          const progress = Number(g.target_amount) > 0 ? ((Number(g.current_amount) / Number(g.target_amount)) * 100).toFixed(1) : "0";
          return [g.title, g.goal_type, `$${Number(g.target_amount).toLocaleString()}`, `$${Number(g.current_amount).toLocaleString()}`, `${progress}%`, g.target_date];
        }),
      });
    }

    // Recent Transactions
    if (transactions.length > 0) {
      const afterGoals = (doc as any).lastAutoTable?.finalY || 200;
      if (afterGoals > 250) doc.addPage();
      const startY = afterGoals > 250 ? 20 : afterGoals + 12;
      doc.setFontSize(14);
      doc.text("Recent Transactions", 14, startY);
      autoTable(doc, {
        startY: startY + 4,
        head: [["Date", "Symbol", "Type", "Qty", "Price", "Fees", "Total"]],
        body: transactions.slice(0, 20).map((tx) => [
          new Date(tx.executed_at).toLocaleDateString(),
          tx.symbol,
          tx.type,
          Number(tx.quantity).toString(),
          `$${Number(tx.price).toFixed(2)}`,
          `$${Number(tx.fees).toFixed(2)}`,
          `$${(Number(tx.quantity) * Number(tx.price) + Number(tx.fees)).toFixed(2)}`,
        ]),
      });
    }

    doc.save("wealthwise-report.pdf");
  };

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
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-muted-foreground" />
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">Position Reports</h1>
                <p className="text-muted-foreground">Detailed analysis of your holdings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {investments.map((inv) => (
                    <SelectItem key={inv.id} value={inv.symbol}>
                      {inv.symbol} - {inv.name || inv.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="accent" onClick={downloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Selected Position Header */}
          {selectedInv && (
            <Card className="p-6 mb-6 bg-accent text-accent-foreground shadow-card animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold">{selectedInv.symbol}</h2>
                  <p className="opacity-80">{selectedInv.name || assetTypeLabels[selectedInv.asset_type]}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl font-bold">${Number(selectedInv.last_price).toFixed(2)}</p>
                  <div className="flex items-center gap-1 justify-end opacity-80">
                    {gainLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{returnPct >= 0 ? "+" : ""}{returnPct.toFixed(2)}% overall</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-5 shadow-card border-border/50 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="font-display text-xl font-bold text-foreground">${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.05s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-display text-xl font-bold text-foreground">{totalUnits.toLocaleString()} shares</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gainLoss >= 0 ? "bg-wealth-success/10" : "bg-wealth-danger/10"}`}>
                  {gainLoss >= 0 ? <TrendingUp className="w-5 h-5 text-wealth-success" /> : <TrendingDown className="w-5 h-5 text-wealth-danger" />}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gain/Loss</p>
                  <p className={`font-display text-xl font-bold ${gainLoss >= 0 ? "text-wealth-success" : "text-wealth-danger"}`}>
                    ${Math.abs(gainLoss).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${returnPct >= 0 ? "bg-wealth-success/10" : "bg-wealth-danger/10"}`}>
                  <TrendingUp className={`w-5 h-5 ${returnPct >= 0 ? "text-wealth-success" : "text-wealth-danger"}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Return</p>
                  <p className={`font-display text-xl font-bold ${returnPct >= 0 ? "text-wealth-success" : "text-wealth-danger"}`}>
                    {returnPct >= 0 ? "+" : ""}{returnPct.toFixed(2)}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">Period Performance</h3>
              <p className="text-sm text-muted-foreground mb-4">Returns over different time periods</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={periodData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(v) => `${v.toFixed(0)}%`} />
                    <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Return"]} />
                    <Bar dataKey="value" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-6 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.25s" }}>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">30-Day Price History</h3>
              <p className="text-sm text-muted-foreground mb-4">Daily closing prices</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} domain={["dataMin - 5", "dataMax + 5"]} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                    <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]} />
                    <Line type="monotone" dataKey="price" stroke="hsl(215, 16%, 47%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Holdings Table */}
          {filteredInvestments.length > 0 && (
            <Card className="shadow-card border-border/50 overflow-hidden animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="p-6 border-b border-border/50">
                <h3 className="font-display text-lg font-semibold text-foreground">Positions Detail</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Symbol</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Type</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Units</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Avg Price</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Last Price</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Value</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase">P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredInvestments.map((inv) => {
                      const pl = Number(inv.current_value) - Number(inv.cost_basis);
                      const plPct = Number(inv.cost_basis) > 0 ? (pl / Number(inv.cost_basis)) * 100 : 0;
                      return (
                        <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{inv.symbol}</p>
                            <p className="text-sm text-muted-foreground">{inv.name}</p>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{assetTypeLabels[inv.asset_type]}</td>
                          <td className="px-6 py-4 text-right text-foreground">{Number(inv.units)}</td>
                          <td className="px-6 py-4 text-right text-foreground">${Number(inv.avg_buy_price).toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-foreground">${Number(inv.last_price).toFixed(2)}</td>
                          <td className="px-6 py-4 text-right font-display font-semibold text-foreground">${Number(inv.current_value).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`font-medium ${pl >= 0 ? "text-wealth-success" : "text-wealth-danger"}`}>
                              ${pl.toFixed(2)} ({plPct >= 0 ? "+" : ""}{plPct.toFixed(1)}%)
                            </span>
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

export default Reports;
