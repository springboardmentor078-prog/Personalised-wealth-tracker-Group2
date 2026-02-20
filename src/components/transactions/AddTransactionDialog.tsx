import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { useTransactions, type TransactionInsert } from "@/hooks/useTransactions";
import { useInvestments } from "@/hooks/useInvestments";
import { useStockPrice } from "@/hooks/useStockPrice";

export const AddTransactionDialog = () => {
  const [open, setOpen] = useState(false);
  const { addTransaction } = useTransactions();
  const { investments } = useInvestments();
  const [form, setForm] = useState<TransactionInsert>({
    symbol: "",
    type: "buy",
    quantity: 0,
    price: 0,
    fees: 0,
  });

  const { price, isLoading: priceLoading, error: priceError } = useStockPrice(form.symbol);

  useEffect(() => {
    if (price !== null) {
      setForm((prev) => ({ ...prev, price }));
    }
  }, [price]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.symbol || form.quantity <= 0 || form.price <= 0) return;
    const linked = investments.find((i) => i.symbol === form.symbol);
    addTransaction.mutate(
      { ...form, investment_id: linked?.id },
      {
        onSuccess: () => {
          setOpen(false);
          setForm({ symbol: "", type: "buy", quantity: 0, price: 0, fees: 0 });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Record Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Symbol</Label>
              <Input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })} placeholder="e.g. RELIANCE.BSE" required />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TransactionInsert["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="dividend">Dividend</SelectItem>
                  <SelectItem value="contribution">Contribution</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Quantity</Label>
              <Input type="number" min={0.01} step={0.01} value={form.quantity || ""} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required />
            </div>
            <div>
              <Label>Price ($)</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  required
                  className={priceLoading ? "pr-10" : ""}
                  readOnly={priceLoading}
                />
                {priceLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {priceError && <p className="text-xs text-destructive mt-1">{priceError}</p>}
              {price !== null && !priceLoading && (
                <p className="text-xs text-muted-foreground mt-1">Live: ${price.toFixed(2)}</p>
              )}
            </div>
            <div>
              <Label>Fees ($)</Label>
              <Input type="number" min={0} step={0.01} value={form.fees || ""} onChange={(e) => setForm({ ...form, fees: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <Label>Executed At</Label>
            <Input type="datetime-local" onChange={(e) => setForm({ ...form, executed_at: e.target.value ? new Date(e.target.value).toISOString() : undefined })} />
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">${((form.quantity * form.price) + (form.fees || 0)).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
          <Button type="submit" variant="accent" className="w-full" disabled={addTransaction.isPending}>
            {addTransaction.isPending ? "Recording..." : "Record Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
