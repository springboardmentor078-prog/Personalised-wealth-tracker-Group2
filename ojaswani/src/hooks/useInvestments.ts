import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export type Investment = {
  id: string;
  user_id: string;
  asset_type: "stock" | "etf" | "mutual_fund" | "bond" | "cash";
  symbol: string;
  name: string | null;
  units: number;
  avg_buy_price: number;
  cost_basis: number;
  current_value: number;
  last_price: number;
  last_price_at: string | null;
  created_at: string;
  updated_at: string;
};

export type InvestmentInsert = {
  asset_type: Investment["asset_type"];
  symbol: string;
  name?: string;
  units: number;
  avg_buy_price: number;
};

export const useInvestments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ["investments", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Investment[];
    },
    enabled: !!user,
  });

  const addInvestment = useMutation({
    mutationFn: async (investment: InvestmentInsert) => {
      if (!user) throw new Error("Not authenticated");
      const costBasis = investment.units * investment.avg_buy_price;
      const { data, error } = await supabase
        .from("investments")
        .insert({
          ...investment,
          user_id: user.id,
          cost_basis: costBasis,
          current_value: costBasis,
          last_price: investment.avg_buy_price,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      toast({ title: "Investment added successfully!" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Failed to add investment", description: error.message });
    },
  });

  const updateInvestment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Investment> & { id: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("investments")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });

  const deleteInvestment = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("investments")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      toast({ title: "Investment removed" });
    },
  });

  return { investments, isLoading, addInvestment, updateInvestment, deleteInvestment };
};
