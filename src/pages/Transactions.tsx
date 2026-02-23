import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useTransactions, TransactionInsert } from '@/hooks/useTransactions';
import { useInvestments } from '@/hooks/useInvestments';
import { mockTransactions } from '@/data/mockInvestments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Loader2, ArrowUpRight, ArrowDownRight, Wallet, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const transactionTypes = [
  { value: 'buy', label: 'Buy', color: 'bg-success/10 text-success' },
  { value: 'sell', label: 'Sell', color: 'bg-destructive/10 text-destructive' },
  { value: 'deposit', label: 'Deposit', color: 'bg-primary/10 text-primary' },
  { value: 'withdraw', label: 'Withdraw', color: 'bg-warning/10 text-warning-foreground' },
];

export default function TransactionsPage() {
  const { transactions: dbTransactions, isLoading, addTransaction, deleteTransaction } = useTransactions();
  const transactions = dbTransactions.length > 0 ? dbTransactions : mockTransactions;
  const { investments } = useInvestments();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TransactionInsert>({ type: 'buy', total_amount: 0 });

  const isTradeType = form.type === 'buy' || form.type === 'sell';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: TransactionInsert = {
        ...form,
        total_amount: isTradeType ? (form.quantity || 0) * (form.price || 0) : form.total_amount,
      };
      await addTransaction.mutateAsync(payload);
      toast({ title: 'Transaction recorded' });
      setOpen(false);
      setForm({ type: 'buy', total_amount: 0 });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction.mutateAsync(id);
      toast({ title: 'Transaction deleted' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const totalBuy = transactions.filter((t) => t.type === 'buy').reduce((s, t) => s + t.total_amount, 0);
  const totalSell = transactions.filter((t) => t.type === 'sell').reduce((s, t) => s + t.total_amount, 0);
  const totalDeposit = transactions.filter((t) => t.type === 'deposit').reduce((s, t) => s + t.total_amount, 0);
  const totalWithdraw = transactions.filter((t) => t.type === 'withdraw').reduce((s, t) => s + t.total_amount, 0);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getTypeBadge = (type: string) => {
    const config = transactionTypes.find((t) => t.value === type);
    return <Badge className={cn("capitalize", config?.color)}>{type}</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Transactions</h1>
            <p className="text-muted-foreground">Track your buys, sells, deposits & withdrawals</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />New Transaction</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Transaction</DialogTitle>
                <DialogDescription>Add a new buy, sell, deposit, or withdrawal.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {transactionTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isTradeType && (
                  <>
                    <div className="space-y-2">
                      <Label>Investment</Label>
                      <Select value={form.investment_id || ''} onValueChange={(v) => {
                        const inv = investments.find((i) => i.id === v);
                        setForm({ ...form, investment_id: v, symbol: inv?.symbol });
                      }}>
                        <SelectTrigger><SelectValue placeholder="Select investment" /></SelectTrigger>
                        <SelectContent>
                          {investments.map((inv) => (
                            <SelectItem key={inv.id} value={inv.id}>{inv.symbol} - {inv.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Symbol</Label>
                      <Input value={form.symbol || ''} onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })} placeholder="AAPL" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input type="number" step="any" value={form.quantity || ''} onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 0 })} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input type="number" step="0.01" value={form.price || ''} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required />
                      </div>
                    </div>
                  </>
                )}

                {!isTradeType && (
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" step="0.01" value={form.total_amount || ''} onChange={(e) => setForm({ ...form, total_amount: parseFloat(e.target.value) || 0 })} required />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Input value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add a note..." />
                </div>

                <Button type="submit" className="w-full" disabled={addTransaction.isPending}>
                  {addTransaction.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Record Transaction
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <ArrowUpRight className="h-4 w-4 text-success" /> Total Bought
              </div>
              <p className="text-2xl font-display font-bold">{formatCurrency(totalBuy)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <ArrowDownRight className="h-4 w-4 text-destructive" /> Total Sold
              </div>
              <p className="text-2xl font-display font-bold">{formatCurrency(totalSell)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Wallet className="h-4 w-4 text-primary" /> Deposits
              </div>
              <p className="text-2xl font-display font-bold">{formatCurrency(totalDeposit)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Wallet className="h-4 w-4 text-destructive" /> Withdrawals
              </div>
              <p className="text-2xl font-display font-bold">{formatCurrency(totalWithdraw)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Transaction History
            </CardTitle>
            <CardDescription>{transactions.length} transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No transactions yet. Record your first one!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-muted-foreground">{formatDate(tx.transaction_date)}</TableCell>
                      <TableCell>{getTypeBadge(tx.type)}</TableCell>
                      <TableCell className="font-semibold">{tx.symbol || '—'}</TableCell>
                      <TableCell className="text-right">{tx.quantity ?? '—'}</TableCell>
                      <TableCell className="text-right">{tx.price ? formatCurrency(tx.price) : '—'}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(tx.total_amount)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{tx.notes || '—'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(tx.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
