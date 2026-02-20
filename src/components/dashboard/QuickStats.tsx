import { Wallet, TrendingUp, Target, PiggyBank } from "lucide-react";
import { useInvestments } from "@/hooks/useInvestments";
import { useGoals } from "@/hooks/useGoals";

export const QuickStats = () => {
  const { investments } = useInvestments();
  const { goals } = useGoals();

  const totalValue = investments.reduce((sum, inv) => sum + Number(inv.current_value), 0);
  const totalCostBasis = investments.reduce((sum, inv) => sum + Number(inv.cost_basis), 0);
  const totalReturns = totalValue - totalCostBasis;
  const returnPercent = totalCostBasis > 0 ? ((totalReturns / totalCostBasis) * 100).toFixed(1) : "0.0";
  
  const monthlyContribution = goals
    .filter((g) => g.status === "active")
    .reduce((sum, g) => sum + Number(g.monthly_contribution), 0);

  const activeGoals = goals.filter((g) => g.status === "active");
  const avgProgress = activeGoals.length > 0
    ? activeGoals.reduce((sum, g) => {
        const p = Number(g.target_amount) > 0 ? (Number(g.current_amount) / Number(g.target_amount)) * 100 : 0;
        return sum + p;
      }, 0) / activeGoals.length
    : 0;

  const stats = [
    {
      label: "Net Worth",
      value: `$${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      change: `${Number(returnPercent) >= 0 ? "+" : ""}${returnPercent}%`,
      isPositive: Number(returnPercent) >= 0,
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      label: "Monthly Investment",
      value: `$${monthlyContribution.toLocaleString()}`,
      change: monthlyContribution > 0 ? "On Track" : "Set Goals",
      isPositive: monthlyContribution > 0,
      icon: <PiggyBank className="w-5 h-5" />,
    },
    {
      label: "Total Returns",
      value: `$${Math.abs(totalReturns).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      change: `${Number(returnPercent) >= 0 ? "+" : ""}${returnPercent}%`,
      isPositive: totalReturns >= 0,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: "Goals Progress",
      value: `${activeGoals.length} Active`,
      change: `${avgProgress.toFixed(0)}% avg`,
      isPositive: true,
      icon: <Target className="w-5 h-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-card border border-border/50 rounded-2xl p-5 shadow-card hover:shadow-lg transition-all hover:-translate-y-0.5 group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              {stat.icon}
            </div>
            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
              stat.isPositive
                ? "bg-wealth-success/10 text-wealth-success"
                : "bg-wealth-danger/10 text-wealth-danger"
            }`}>
              {stat.change}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
          <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
