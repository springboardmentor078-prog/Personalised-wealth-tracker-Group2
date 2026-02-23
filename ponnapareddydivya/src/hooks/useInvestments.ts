import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface Investment {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  type: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  sector: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestmentInsert {
  symbol: string;
  name: string;
  type: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  sector?: string;
  notes?: string;
}

export function useInvestments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['investments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Investment[];
    },
    enabled: !!user,
  });

  const addInvestment = useMutation({
    mutationFn: async (investment: InvestmentInsert) => {
      const { data, error } = await supabase
        .from('investments')
        .insert({ ...investment, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data as Investment;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investments'] }),
  });

  const updateInvestment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Investment> & { id: string }) => {
      const { data, error } = await supabase
        .from('investments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Investment;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investments'] }),
  });

  const deleteInvestment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('investments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investments'] }),
  });

  return { investments: query.data ?? [], isLoading: query.isLoading, addInvestment, updateInvestment, deleteInvestment };
}
