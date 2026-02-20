import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useGoals, type GoalInsert } from "@/hooks/useGoals";

export const AddGoalDialog = () => {
  const [open, setOpen] = useState(false);
  const { addGoal } = useGoals();
  const [form, setForm] = useState<GoalInsert>({
    title: "",
    goal_type: "custom",
    target_amount: 0,
    current_amount: 0,
    target_date: "",
    monthly_contribution: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.target_date || form.target_amount <= 0) return;
    addGoal.mutate(form, {
      onSuccess: () => {
        setOpen(false);
        setForm({ title: "", goal_type: "custom", target_amount: 0, current_amount: 0, target_date: "", monthly_contribution: 0 });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent">
          <Plus className="w-4 h-4 mr-2" />
          Add New Goal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Create New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Goal Name</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Retirement Fund" required />
          </div>
          <div>
            <Label>Goal Type</Label>
            <Select value={form.goal_type} onValueChange={(v) => setForm({ ...form, goal_type: v as GoalInsert["goal_type"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="retirement">Retirement</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target Amount ($)</Label>
              <Input type="number" min={1} value={form.target_amount || ""} onChange={(e) => setForm({ ...form, target_amount: Number(e.target.value) })} required />
            </div>
            <div>
              <Label>Current Amount ($)</Label>
              <Input type="number" min={0} value={form.current_amount || ""} onChange={(e) => setForm({ ...form, current_amount: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target Date</Label>
              <Input type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} required />
            </div>
            <div>
              <Label>Monthly Contribution ($)</Label>
              <Input type="number" min={0} value={form.monthly_contribution || ""} onChange={(e) => setForm({ ...form, monthly_contribution: Number(e.target.value) })} />
            </div>
          </div>
          <Button type="submit" variant="accent" className="w-full" disabled={addGoal.isPending}>
            {addGoal.isPending ? "Creating..." : "Create Goal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
