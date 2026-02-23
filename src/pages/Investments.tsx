import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useInvestments, InvestmentInsert } from '@/hooks/useInvestments';
import { mockInvestments } from '@/data/mockInvestments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, TrendingUp, TrendingDown, Loader2, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const investmentTypes = ['stock', 'etf', 'bond', 'crypto', 'mutual_fund'];

export default function InvestmentsPage() {
  const { investments: dbInvestments, isLoading, addInvestment, deleteInvestment } = useInvestments();
  const investments = dbInvestments.length > 0 ? dbInvestments : mockInvestments;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<InvestmentInsert>({
    symbol: '', name: '', type: 'stock', quantity: 0, avg_price: 0, current_price: 0, sector: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addInvestment.mutateAsync(form);
      toast({ title: 'Investment added successfully' });
      setOpen(false);
      setForm({ symbol: '', name: '', type: 'stock', quantity: 0, avg_price: 0, current_price: 0, sector: '' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInvestment.mutateAsync(id);
      toast({ title: 'Investment removed' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const totalValue = investments.reduce((sum, inv) => sum + inv.quantity * inv.current_price, 0);
  const totalCost = investments.reduce((sum, inv) => sum + inv.quantity * inv.avg_price, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Investments</h1>
            <p className="text-muted-foreground">Manage your investment portfolio</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />Add Investment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Investment</DialogTitle>
                <DialogDescription>Enter the details of your investment.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Symbol</Label>
                    <Input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })} required placeholder="AAPL" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {investmentTypes.map((t) => (
                          <SelectItem key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Apple Inc." />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input type="number" step="any" value={form.quantity || ''} onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 0 })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Avg Price</Label>
                    <Input type="number" step="0.01" value={form.avg_price || ''} onChange={(e) => setForm({ ...form, avg_price: parseFloat(e.target.value) || 0 })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Price</Label>
                    <Input type="number" step="0.01" value={form.current_price || ''} onChange={(e) => setForm({ ...form, current_price: parseFloat(e.target.value) || 0 })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sector</Label>
                  <Input value={form.sector || ''} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="Technology" />
                </div>
                <Button type="submit" className="w-full" disabled={addInvestment.isPending}>
                  {addInvestment.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Investment
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-display font-bold">{formatCurrency(totalValue)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-display font-bold">{formatCurrency(totalCost)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
              <p className={cn("text-2xl font-display font-bold", totalGain >= 0 ? "text-success" : "text-destructive")}>
                {formatCurrency(totalGain)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Return</p>
              <p className={cn("text-2xl font-display font-bold", totalGainPercent >= 0 ? "text-success" : "text-destructive")}>
                {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Investments Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Holdings
            </CardTitle>
            <CardDescription>{investments.length} investments</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : investments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No investments yet. Add your first one!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Avg Price</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Gain/Loss</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((inv) => {
                    const value = inv.quantity * inv.current_price;
                    const cost = inv.quantity * inv.avg_price;
                    const gain = value - cost;
                    const gainPercent = cost > 0 ? (gain / cost) * 100 : 0;
                    return (
                      <TableRow key={inv.id}>
                        <TableCell className="font-semibold">{inv.symbol}</TableCell>
                        <TableCell className="text-muted-foreground">{inv.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{inv.type.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{inv.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(inv.avg_price)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(inv.current_price)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(value)}</TableCell>
                        <TableCell className="text-right">
                          <div className={cn("flex items-center justify-end gap-1", gain >= 0 ? "text-success" : "text-destructive")}>
                            {gain >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            <span className="text-sm font-medium">{gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(inv.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
