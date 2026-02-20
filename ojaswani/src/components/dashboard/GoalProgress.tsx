import { Target, Home, GraduationCap, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGoals } from "@/hooks/useGoals";
import { Link } from "react-router-dom";

const goalIcons: Record<string, React.ReactNode> = {
  retirement: <Target className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  education: <GraduationCap className="w-5 h-5" />,
  custom: <Briefcase className="w-5 h-5" />,
};

const goalColors: Record<string, string> = {
  retirement: "bg-accent",
  home: "bg-wealth-gold",
  education: "bg-wealth-navy",
  custom: "bg-wealth-slate",
};

export const GoalProgress = () => {
  const { goals, isLoading } = useGoals();
  const activeGoals = goals.filter((g) => g.status === "active").slice(0, 4);

  return (
    <Card className="p-6 shadow-card border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Your Goals</h3>
        <Link to="/goals" className="text-sm text-accent hover:text-wealth-emerald-light transition-colors font-medium">
          {goals.length > 0 ? "View All" : "Add Goal"}
        </Link>
      </div>

      {activeGoals.length === 0 ? (
        <p className="text-muted-foreground text-sm">No active goals. Create one to start tracking!</p>
      ) : (
        <div className="space-y-4">
          {activeGoals.map((goal) => {
            const progress = Number(goal.target_amount) > 0
              ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100
              : 0;
            return (
              <div
                key={goal.id}
                className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${goalColors[goal.goal_type] || "bg-accent"} flex items-center justify-center text-white shrink-0`}>
                    {goalIcons[goal.goal_type] || <Target className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground truncate">{goal.title}</h4>
                      <span className="text-sm text-muted-foreground">by {new Date(goal.target_date).getFullYear()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-display font-semibold text-foreground">
                        ${Number(goal.current_amount).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-sm text-muted-foreground">
                        ${Number(goal.target_amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={progress} className="h-2" />
                      <span className="absolute right-0 -top-5 text-xs font-medium text-muted-foreground">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
