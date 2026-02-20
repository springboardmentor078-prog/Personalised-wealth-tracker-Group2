import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export type Transaction = {
  id: string;
  user_id: string;
  investment_id: string | null;
  symbol: string;
  type: "buy" | "sell" | "dividend" | "contribution" | "withdrawal";
  quantity: number;
  price: number;
  fees: number;
  executed_at: string;
  created_at: string;
};

export type TransactionInsert = {
  investment_id?: string;
  symbol: string;
  type: Transaction["type"];
  quantity: number;
  price: number;
  fees?: number;
  executed_at?: string;
};

export const useTransactions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("executed_at", { ascending: false });
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });

  const addTransaction = useMutation({
    mutationFn: async (transaction: TransactionInsert) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("transactions")
        .insert({ ...transaction, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      toast({ title: "Transaction recorded!" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Failed to record transaction", description: error.message });
    },
  });

  return { transactions, isLoading, addTransaction };
};
