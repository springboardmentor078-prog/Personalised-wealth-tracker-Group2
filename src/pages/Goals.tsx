import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useGoals, GoalInsert, Goal } from '@/hooks/useGoals';
import { mockGoals } from '@/data/mockInvestments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Loader2, Target, TrendingUp, DollarSign, Pencil, Calculator, CalendarDays, Zap, ChevronRight, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';

const goalCategories = [
  { value: 'retirement', label: 'Retirement', emoji: '🏖️' },
  { value: 'emergency', label: 'Emergency Fund', emoji: '🛡️' },
  { value: 'education', label: 'Education', emoji: '🎓' },
  { value: 'house', label: 'House', emoji: '🏠' },
  { value: 'vacation', label: 'Vacation', emoji: '✈️' },
  { value: 'general', label: 'General', emoji: '💰' },
];

interface SimPoint {
  month: number;
  label: string;
  conservative: number;
  moderate: number;
  aggressive: number;
  target: number;
}

function runSimulation(
  currentAmount: number,
  targetAmount: number,
  monthlyContribution: number,
  annualReturnRate: number,
): SimPoint[] {
  const maxMonths = 360;
  const points: SimPoint[] = [];
  const conservativeRate = Math.max(0, annualReturnRate - 3) / 100 / 12;
  const moderateRate = annualReturnRate / 100 / 12;
  const aggressiveRate = (annualReturnRate + 3) / 100 / 12;

  let c = currentAmount;
  let m = currentAmount;
  let a = currentAmount;

  for (let i = 0; i <= maxMonths; i++) {
    if (i > 0) {
      c = c * (1 + conservativeRate) + monthlyContribution;
      m = m * (1 + moderateRate) + monthlyContribution;
      a = a * (1 + aggressiveRate) + monthlyContribution;
    }

    const year = Math.floor(i / 12);
    const month = i % 12;
    const label = i === 0 ? 'Now' : month === 0 ? `Y${year}` : '';

    points.push({ month: i, label, conservative: Math.round(c), moderate: Math.round(m), aggressive: Math.round(a), target: targetAmount });

    if (i > 12 && a >= targetAmount * 1.5 && c >= targetAmount) break;
  }
  return points;
}

function monthsToReach(currentAmount: number, targetAmount: number, monthlyContribution: number, annualReturnRate: number): number | null {
  const r = annualReturnRate / 100 / 12;
  let balance = currentAmount;
  for (let i = 1; i <= 360; i++) {
    balance = balance * (1 + r) + monthlyContribution;
    if (balance >= targetAmount) return i;
  }
  return null;
}

function formatMonths(months: number | null): string {
  if (months === null) return 'Over 30 yrs';
  if (months < 12) return `${months} mo`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m === 0 ? `${y} yr${y !== 1 ? 's' : ''}` : `${y}y ${m}m`;
}

const SimTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
  return (
    <div className="rounded-xl border border-border bg-card/95 backdrop-blur-sm p-3 shadow-xl text-xs space-y-1.5">
      <p className="font-semibold text-foreground">Month {payload[0]?.payload?.month}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.dataKey}:</span>
          <span className="font-semibold">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

function GoalSimulator({ goal }: { goal: Goal }) {
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);
  const [monthly, setMonthly] = useState(Math.max(500, Math.round(remaining / 60)));
  const [rate, setRate] = useState(7);

  const simData = useMemo(
    () => runSimulation(goal.current_amount, goal.target_amount, monthly, rate),
    [goal.current_amount, goal.target_amount, monthly, rate],
  );

  const conservativeMonths = monthsToReach(goal.current_amount, goal.target_amount, monthly, Math.max(0, rate - 3));
  const moderateMonths = monthsToReach(goal.current_amount, goal.target_amount, monthly, rate);
  const aggressiveMonths = monthsToReach(goal.current_amount, goal.target_amount, monthly, rate + 3);

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  const reachPoint = simData.find((d) => d.moderate >= goal.target_amount);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Monthly Contribution</Label>
            <span className="text-sm font-bold text-primary">{fmt(monthly)}</span>
          </div>
          <Slider min={100} max={Math.max(10000, monthly * 2)} step={50} value={[monthly]} onValueChange={([v]) => setMonthly(v)} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>$100</span><span>{fmt(Math.max(10000, monthly * 2))}</span></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Expected Annual Return</Label>
            <span className="text-sm font-bold text-primary">{rate}%</span>
          </div>
          <Slider min={1} max={20} step={0.5} value={[rate]} onValueChange={([v]) => setRate(v)} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1%</span><span>20%</span></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Conservative', months: conservativeMonths, r: Math.max(0, rate - 3), color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Moderate', months: moderateMonths, r: rate, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Aggressive', months: aggressiveMonths, r: rate + 3, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl border p-3 text-center space-y-1', s.bg)}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={cn('text-lg font-bold font-display', s.color)}>{formatMonths(s.months)}</p>
            <p className="text-xs text-muted-foreground">@ {s.r.toFixed(1)}% / yr</p>
          </div>
        ))}
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={simData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
              <linearGradient id="gm" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
              <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} width={52} />
            <Tooltip content={<SimTooltip />} />
            {reachPoint && (
              <ReferenceLine x={reachPoint.label} stroke="hsl(var(--primary))" strokeDasharray="4 4"
                label={{ value: '🎯', position: 'top', fontSize: 12 }} />
            )}
            <ReferenceLine y={goal.target_amount} stroke="hsl(var(--primary))" strokeDasharray="6 3" strokeOpacity={0.5} />
            <Area type="monotone" dataKey="conservative" stroke="#3b82f6" strokeWidth={1.5} fill="url(#gc)" dot={false} name="conservative" />
            <Area type="monotone" dataKey="moderate" stroke="#10b981" strokeWidth={2} fill="url(#gm)" dot={false} name="moderate" />
            <Area type="monotone" dataKey="aggressive" stroke="#f59e0b" strokeWidth={1.5} fill="url(#ga)" dot={false} name="aggressive" />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} formatter={(value) => <span style={{ textTransform: 'capitalize', color: 'hsl(var(--muted-foreground))' }}>{value}</span>} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {moderateMonths && (
        <div className="flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 text-sm">
          <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span className="text-muted-foreground">
            Contributing <span className="font-semibold text-foreground">{fmt(monthly)}/mo</span> at{' '}
            <span className="font-semibold text-foreground">{rate}%</span> return puts you on track to reach{' '}
            <span className="font-semibold text-foreground">{goal.name}</span> in{' '}
            <span className="font-semibold text-primary">{formatMonths(moderateMonths)}</span>.
          </span>
        </div>
      )}
    </div>
  );
}

export default function GoalsPage() {
  const { goals: dbGoals, isLoading, addGoal, updateGoal, deleteGoal } = useGoals();
  const goals = dbGoals.length > 0 ? dbGoals : mockGoals;
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [simulateGoalId, setSimulateGoalId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [updateAmount, setUpdateAmount] = useState(0);
  const [form, setForm] = useState<GoalInsert>({ name: '', target_amount: 0, category: 'general' });

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGoal.mutateAsync(form);
      toast({ title: 'Goal created' });
      setOpen(false);
      setForm({ name: '', target_amount: 0, category: 'general' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleUpdateAmount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId) return;
    try {
      const goal = goals.find((g) => g.id === selectedGoalId);
      if (!goal) return;
      const newAmount = goal.current_amount + updateAmount;
      const status = newAmount >= goal.target_amount ? 'completed' : 'active';
      await updateGoal.mutateAsync({ id: selectedGoalId, current_amount: newAmount, status });
      toast({ title: status === 'completed' ? '🎉 Goal completed!' : 'Progress updated' });
      setUpdateOpen(false);
      setUpdateAmount(0);
      setSelectedGoalId(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal.mutateAsync(id);
      toast({ title: 'Goal deleted' });
      if (simulateGoalId === id) setSimulateGoalId(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');
  const totalTarget = activeGoals.reduce((s, g) => s + g.target_amount, 0);
  const totalSaved = activeGoals.reduce((s, g) => s + g.current_amount, 0);

  const simulatedGoal = simulateGoalId ? goals.find((g) => g.id === simulateGoalId) : null;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Financial Goals</h1>
            <p className="text-muted-foreground">Set targets, track progress, and simulate your path to success</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />New Goal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a Goal</DialogTitle>
                <DialogDescription>Set a financial target to work towards.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Goal Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Down payment for house" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {goalCategories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.emoji} {c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Amount</Label>
                  <Input type="number" step="0.01" value={form.target_amount || ''} onChange={(e) => setForm({ ...form, target_amount: parseFloat(e.target.value) || 0 })} required />
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Input value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your goal" />
                </div>
                <Button type="submit" className="w-full" disabled={addGoal.isPending}>
                  {addGoal.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Goal
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Target className="h-4 w-4 text-primary" /> Active Goals
              </div>
              <p className="text-3xl font-display font-bold">{activeGoals.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4 text-success" /> Total Saved
              </div>
              <p className="text-3xl font-display font-bold text-success">{formatCurrency(totalSaved)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" /> Total Target
              </div>
              <p className="text-3xl font-display font-bold">{formatCurrency(totalTarget)}</p>
            </CardContent>
          </Card>
        </div>

        <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Savings</DialogTitle>
              <DialogDescription>How much did you save towards this goal?</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateAmount} className="space-y-4">
              <div className="space-y-2">
                <Label>Amount to Add</Label>
                <Input type="number" step="0.01" value={updateAmount || ''} onChange={(e) => setUpdateAmount(parseFloat(e.target.value) || 0)} required />
              </div>
              <Button type="submit" className="w-full" disabled={updateGoal.isPending}>
                {updateGoal.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Progress
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : goals.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-12 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No goals yet. Create your first financial goal!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Left: Goals list */}
            <div className="lg:col-span-2 space-y-6">
              {activeGoals.length > 0 && (
                <div>
                  <h2 className="text-xl font-display font-semibold mb-4">Active Goals</h2>
                  <div className="space-y-3">
                    {activeGoals.map((goal) => {
                      const percent = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
                      const cat = goalCategories.find((c) => c.value === goal.category);
                      const isSelected = simulateGoalId === goal.id;
                      return (
                        <Card
                          key={goal.id}
                          className={cn(
                            'border shadow-sm transition-all cursor-pointer hover:shadow-md',
                            isSelected
                              ? 'border-primary/50 bg-primary/5 shadow-md ring-1 ring-primary/20'
                              : 'border-border/50 hover:border-border',
                          )}
                          onClick={() => setSimulateGoalId(isSelected ? null : goal.id)}
                        >
                          <CardHeader className="pb-2 pt-4 px-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{cat?.emoji || '💰'}</span>
                                <div>
                                  <CardTitle className="text-sm font-semibold leading-tight">{goal.name}</CardTitle>
                                  {goal.description && <CardDescription className="text-xs mt-0.5 line-clamp-1">{goal.description}</CardDescription>}
                                </div>
                              </div>
                              <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSelectedGoalId(goal.id); setUpdateOpen(true); }}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(goal.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-4 px-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">{formatCurrency(goal.current_amount)}</span>
                                <span className="font-medium">{formatCurrency(goal.target_amount)}</span>
                              </div>
                              <Progress value={Math.min(percent, 100)} className="h-2" />
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="text-xs capitalize">{cat?.label || goal.category}</Badge>
                                <div className="flex items-center gap-1.5">
                                  <span className={cn('text-xs font-semibold', percent >= 75 ? 'text-success' : 'text-muted-foreground')}>
                                    {percent.toFixed(1)}%
                                  </span>
                                  {isSelected ? (
                                    <span className="text-xs text-primary font-medium flex items-center gap-0.5">
                                      <BarChart3 className="h-3 w-3" /> Simulating
                                    </span>
                                  ) : (
                                    <span className="text-xs text-muted-foreground flex items-center gap-0.5 opacity-50">
                                      <Calculator className="h-3 w-3" /> Simulate <ChevronRight className="h-3 w-3" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {completedGoals.length > 0 && (
                <div>
                  <h2 className="text-xl font-display font-semibold mb-4">🎉 Completed Goals</h2>
                  <div className="space-y-3">
                    {completedGoals.map((goal) => {
                      const cat = goalCategories.find((c) => c.value === goal.category);
                      return (
                        <Card key={goal.id} className="border-0 shadow-sm opacity-75">
                          <CardContent className="pt-4 pb-4 px-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{cat?.emoji || '💰'}</span>
                                <div>
                                  <p className="font-semibold text-sm">{goal.name}</p>
                                  <p className="text-xs text-success font-medium">{formatCurrency(goal.target_amount)} reached!</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(goal.id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Simulation panel */}
            <div className="lg:col-span-3">
              {simulatedGoal ? (
                <Card className="border-0 shadow-lg sticky top-6">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Calculator className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-display text-lg">Goal Simulator</CardTitle>
                        <CardDescription className="text-sm">
                          Projecting: <span className="font-semibold text-foreground">{simulatedGoal.name}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <GoalSimulator goal={simulatedGoal} />
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-dashed border-border/60 shadow-none bg-muted/20">
                  <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-muted/60 flex items-center justify-center">
                      <Calculator className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Run a Goal Simulation</p>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Click any active goal on the left to project your savings timeline across conservative, moderate, and aggressive return scenarios.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>Adjust monthly contributions and expected returns</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
