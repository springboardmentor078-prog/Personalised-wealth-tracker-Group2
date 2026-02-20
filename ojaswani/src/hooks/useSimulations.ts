import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export type Simulation = {
  id: string;
  user_id: string;
  goal_id: string | null;
  scenario_name: string;
  assumptions: Record<string, unknown>;
  results: Record<string, unknown>;
  created_at: string;
};

export type SimulationInput = {
  goal_id?: string;
  scenario_name: string;
  assumptions: {
    monthly_contribution: number;
    expected_return: number;
    inflation: number;
    time_horizon_years: number;
    initial_amount?: number;
  };
};

export const useSimulations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: simulations = [], isLoading } = useQuery({
    queryKey: ["simulations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("simulations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Simulation[];
    },
    enabled: !!user,
  });

  const runSimulation = useMutation({
    mutationFn: async (input: SimulationInput) => {
      if (!user) throw new Error("Not authenticated");
      
      const { assumptions } = input;
      const monthlyRate = assumptions.expected_return / 100 / 12;
      const months = assumptions.time_horizon_years * 12;
      const initial = assumptions.initial_amount || 0;
      
      // Future value of initial amount
      const fvInitial = initial * Math.pow(1 + monthlyRate, months);
      
      // Future value of monthly contributions (annuity)
      const fvContributions = assumptions.monthly_contribution * 
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
        (1 + monthlyRate);
      
      const totalFutureValue = fvInitial + fvContributions;
      const totalInvested = initial + (assumptions.monthly_contribution * months);
      const totalReturns = totalFutureValue - totalInvested;
      
      // Inflation-adjusted value
      const realReturn = ((1 + assumptions.expected_return / 100) / (1 + assumptions.inflation / 100) - 1);
      const realMonthlyRate = realReturn / 12;
      const realFvInitial = initial * Math.pow(1 + realMonthlyRate, months);
      const realFvContributions = assumptions.monthly_contribution * 
        ((Math.pow(1 + realMonthlyRate, months) - 1) / realMonthlyRate) * 
        (1 + realMonthlyRate);
      const inflationAdjustedValue = realFvInitial + realFvContributions;

      // Year-by-year projections
      const yearlyProjections = [];
      for (let year = 1; year <= assumptions.time_horizon_years; year++) {
        const m = year * 12;
        const fv1 = initial * Math.pow(1 + monthlyRate, m);
        const fv2 = assumptions.monthly_contribution * 
          ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * 
          (1 + monthlyRate);
        yearlyProjections.push({
          year,
          value: Math.round(fv1 + fv2),
          invested: Math.round(initial + assumptions.monthly_contribution * m),
        });
      }

      const results = {
        total_future_value: Math.round(totalFutureValue),
        total_invested: Math.round(totalInvested),
        total_returns: Math.round(totalReturns),
        inflation_adjusted_value: Math.round(inflationAdjustedValue),
        yearly_projections: yearlyProjections,
      };

      const { data, error } = await supabase
        .from("simulations")
        .insert([{
          user_id: user.id,
          goal_id: input.goal_id || null,
          scenario_name: input.scenario_name,
          assumptions: assumptions as unknown as Record<string, never>,
          results: results as unknown as Record<string, never>,
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
      toast({ title: "Simulation completed!" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Simulation failed", description: error.message });
    },
  });

  const deleteSimulation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("simulations")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
    },
  });

  return { simulations, isLoading, runSimulation, deleteSimulation };
};
