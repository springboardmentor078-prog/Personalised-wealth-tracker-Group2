import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const REFRESH_INTERVAL = 60000;

export const useStockPrice = (symbol: string) => {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async (sym: string) => {
    if (!sym || sym.length < 1) {
      setPrice(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        "alpha-vantage-proxy",
        { body: { symbol: sym.toUpperCase() } }
      );
      if (invokeError) throw invokeError;
      if (data?.price) {
        setPrice(data.price);
      } else {
        setError("Price unavailable");
        setPrice(null);
      }
    } catch {
      setError("Price unavailable");
      setPrice(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice(symbol);
    if (!symbol) return;
    const interval = setInterval(() => fetchPrice(symbol), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [symbol, fetchPrice]);

  return { price, isLoading, error };
};
