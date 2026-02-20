import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowUpRight, ArrowDownRight, Gift, Wallet, ArrowRightLeft } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
import { format } from "date-fns";

const typeConfig: Record<string, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  buy: { label: "Buy", icon: <ArrowUpRight className="w-3.5 h-3.5" />, variant: "default" },
  sell: { label: "Sell", icon: <ArrowDownRight className="w-3.5 h-3.5" />, variant: "destructive" },
  dividend: { label: "Dividend", icon: <Gift className="w-3.5 h-3.5" />, variant: "secondary" },
  contribution: { label: "Contribution", icon: <Wallet className="w-3.5 h-3.5" />, variant: "outline" },
  withdrawal: { label: "Withdrawal", icon: <ArrowRightLeft className="w-3.5 h-3.5" />, variant: "outline" },
};

const Transactions = () => {
  const { transactions, isLoading } = useTransactions();

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

  const totalBuys = transactions.filter((t) => t.type === "buy").reduce((s, t) => s + Number(t.quantity) * Number(t.price), 0);
  const totalSells = transactions.filter((t) => t.type === "sell").reduce((s, t) => s + Number(t.quantity) * Number(t.price), 0);
  const totalFees = transactions.reduce((s, t) => s + Number(t.fees), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                <span className="text-gradient">Transactions</span>
              </h1>
              <p className="text-muted-foreground">Complete history of all your trades</p>
            </div>
            <AddTransactionDialog />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-5 shadow-card border-border/50 animate-slide-up">
              <p className="text-xs text-muted-foreground mb-1">Total Bought</p>
              <p className="font-display text-xl font-bold text-foreground">${totalBuys.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </Card>
            <Card className="p-5 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.05s" }}>
              <p className="text-xs text-muted-foreground mb-1">Total Sold</p>
              <p className="font-display text-xl font-bold text-foreground">${totalSells.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </Card>
            <Card className="p-5 shadow-card border-border/50 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <p className="text-xs text-muted-foreground mb-1">Total Fees</p>
              <p className="font-display text-xl font-bold text-wealth-danger">${totalFees.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </Card>
          </div>

          {/* Transactions Table */}
          {transactions.length === 0 ? (
            <Card className="p-12 text-center shadow-card border-border/50">
              <ArrowRightLeft className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">No transactions yet</h3>
              <p className="text-muted-foreground mb-4">Record your first trade to start tracking</p>
              <AddTransactionDialog />
            </Card>
          ) : (
            <Card className="shadow-card border-border/50 overflow-hidden animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="p-6 border-b border-border/50">
                <h3 className="font-display text-lg font-semibold text-foreground">History ({transactions.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Symbol</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Fees</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {transactions.map((tx) => {
                      const cfg = typeConfig[tx.type] || typeConfig.buy;
                      const total = Number(tx.quantity) * Number(tx.price) + Number(tx.fees);
                      return (
                        <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 text-sm text-foreground">{format(new Date(tx.executed_at), "MMM dd, yyyy HH:mm")}</td>
                          <td className="px-6 py-4 font-medium text-foreground">{tx.symbol}</td>
                          <td className="px-6 py-4">
                            <Badge variant={cfg.variant} className="gap-1">
                              {cfg.icon} {cfg.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right text-foreground">{Number(tx.quantity)}</td>
                          <td className="px-6 py-4 text-right text-foreground">${Number(tx.price).toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-muted-foreground">${Number(tx.fees).toFixed(2)}</td>
                          <td className="px-6 py-4 text-right font-display font-semibold text-foreground">${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
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

export default Transactions;
