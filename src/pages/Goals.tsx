import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Home, GraduationCap, Briefcase, TrendingUp, Calendar, Trash2, Loader2 } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { AddGoalDialog } from "@/components/goals/AddGoalDialog";

const goalIcons: Record<string, React.ReactNode> = {
  retirement: <Target className="w-6 h-6" />,
  home: <Home className="w-6 h-6" />,
  education: <GraduationCap className="w-6 h-6" />,
  custom: <Briefcase className="w-6 h-6" />,
};

const goalColors: Record<string, string> = {
  retirement: "bg-accent",
  home: "bg-wealth-gold",
  education: "bg-wealth-navy",
  custom: "bg-wealth-slate",
};

const Goals = () => {
  const { goals, isLoading, deleteGoal } = useGoals();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(goals.map((g) => g.goal_type))];
  const filteredGoals = selectedCategory === "All" ? goals : goals.filter((g) => g.goal_type === selectedCategory);

  const totalValue = goals.reduce((sum, goal) => sum + Number(goal.current_amount), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.target_amount), 0);
  const overallProgress = totalTarget > 0 ? (totalValue / totalTarget) * 100 : 0;

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
                Your <span className="text-gradient">Goals</span>
              </h1>
              <p className="text-muted-foreground">Track and manage your financial goals</p>
            </div>
            <AddGoalDialog />
          </div>

          {/* Overall Progress */}
          {goals.length > 0 && (
            <Card className="p-6 mb-8 shadow-card border-border/50 animate-slide-up">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">Overall Progress</h3>
                  <p className="text-muted-foreground text-sm">
                    You've achieved {overallProgress.toFixed(1)}% of your total goals
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="font-display text-xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Target</p>
                    <p className="font-display text-xl font-bold text-accent">${totalTarget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <Progress value={overallProgress} className="mt-4 h-3" />
            </Card>
          )}

          {/* Category Filter */}
          {goals.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Goals Grid */}
          {goals.length === 0 ? (
            <Card className="p-12 text-center shadow-card border-border/50">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-4">Start by creating your first financial goal</p>
              <AddGoalDialog />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGoals.map((goal, index) => {
                const progress = Number(goal.target_amount) > 0
                  ? (Number(goal.current_amount) / Number(goal.target_amount)) * 100
                  : 0;
                return (
                  <Card
                    key={goal.id}
                    className="p-6 shadow-card border-border/50 hover:shadow-lg transition-all hover:-translate-y-1 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${goalColors[goal.goal_type] || "bg-accent"} flex items-center justify-center text-white`}>
                        {goalIcons[goal.goal_type] || <Target className="w-6 h-6" />}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => deleteGoal.mutate(goal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 capitalize">{goal.goal_type} • {goal.status}</p>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-foreground">${Number(goal.current_amount).toLocaleString()}</span>
                        <span className="text-muted-foreground">of ${Number(goal.target_amount).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span>${Number(goal.monthly_contribution).toLocaleString()}/mo</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(goal.target_date).getFullYear()}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Goals;
