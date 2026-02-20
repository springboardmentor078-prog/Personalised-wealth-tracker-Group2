import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { useInvestments, type InvestmentInsert } from "@/hooks/useInvestments";
import { useStockPrice } from "@/hooks/useStockPrice";

export const AddInvestmentDialog = () => {
  const [open, setOpen] = useState(false);
  const { addInvestment } = useInvestments();
  const [form, setForm] = useState<InvestmentInsert>({
    asset_type: "stock",
    symbol: "",
    name: "",
    units: 0,
    avg_buy_price: 0,
  });

  const { price, isLoading: priceLoading, error: priceError } = useStockPrice(form.symbol);

  useEffect(() => {
    if (price !== null) {
      setForm((prev) => ({ ...prev, avg_buy_price: price }));
    }
  }, [price]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.symbol || form.units <= 0 || form.avg_buy_price <= 0) return;
    addInvestment.mutate(form, {
      onSuccess: () => {
        setOpen(false);
        setForm({ asset_type: "stock", symbol: "", name: "", units: 0, avg_buy_price: 0 });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent">
          <Plus className="w-4 h-4 mr-2" />
          Add Investment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Add Investment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Asset Type</Label>
            <Select value={form.asset_type} onValueChange={(v) => setForm({ ...form, asset_type: v as InvestmentInsert["asset_type"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="etf">ETF</SelectItem>
                <SelectItem value="mutual_fund">Mutual Fund</SelectItem>
                <SelectItem value="bond">Bond</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Symbol</Label>
              <Input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })} placeholder="e.g. RELIANCE.BSE" required />
            </div>
            <div>
              <Label>Name</Label>
              <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Reliance Industries" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Units/Shares</Label>
              <Input type="number" min={0.01} step={0.01} value={form.units || ""} onChange={(e) => setForm({ ...form, units: Number(e.target.value) })} required />
            </div>
            <div>
              <Label>Avg Buy Price ($)</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={form.avg_buy_price || ""}
                  onChange={(e) => setForm({ ...form, avg_buy_price: Number(e.target.value) })}
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
                <p className="text-xs text-muted-foreground mt-1">Live price: ${price.toFixed(2)}</p>
              )}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            Cost Basis: <span className="font-semibold text-foreground">${(form.units * form.avg_buy_price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
          <Button type="submit" variant="accent" className="w-full" disabled={addInvestment.isPending}>
            {addInvestment.isPending ? "Adding..." : "Add Investment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
