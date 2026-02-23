import React, { useState, useEffect } from 'react';
import { Plus, ArrowDownCircle, ArrowUpCircle, DollarSign, Edit2, Trash2, X, Download, ListOrdered, Filter } from 'lucide-react';
import api from '../services/api';
import { downloadCSV } from '../utils/exportUtils';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const [formData, setFormData] = useState({
        symbol: '',
        type: 'buy',
        quantity: '',
        price: '',
        fees: '0.00'
    });

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/transactions');
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTransaction) {
                await api.put(`/api/transactions/${editingTransaction.id}`, formData);
            } else {
                await api.post('/api/transactions', formData);
            }
            setModalOpen(false);
            setEditingTransaction(null);
            setFormData({ symbol: '', type: 'buy', quantity: '', price: '', fees: '0.00' });
            fetchTransactions();
        } catch (error) {
            console.error('Failed to save transaction', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/api/transactions/${id}`);
                fetchTransactions();
            } catch (error) {
                console.error('Failed to delete transaction', error);
            }
        }
    };

    const openNewModal = () => {
        setEditingTransaction(null);
        setFormData({ symbol: '', type: 'buy', quantity: '', price: '', fees: '0.00' });
        setModalOpen(true);
    };

    const openEditModal = (tx) => {
        setEditingTransaction(tx);
        setFormData({
            symbol: tx.symbol || '',
            type: tx.type,
            quantity: tx.quantity,
            price: tx.price,
            fees: tx.fees
        });
        setModalOpen(true);
    };

    const handleExport = () => {
        const headers = ['Date', 'Type', 'Symbol', 'Quantity', 'Price', 'Fees', 'Total'];
        const rows = filteredTransactions.map(tx => {
            const total = (tx.quantity * tx.price) + Number(tx.fees);
            return [
                new Date(tx.executed_at).toLocaleString(),
                tx.type,
                tx.symbol || '-',
                tx.quantity,
                tx.price,
                tx.fees,
                total.toFixed(2)
            ];
        });
        downloadCSV(headers, rows, 'transactions_export.csv');
    };

    const filteredTransactions = filterType === 'all'
        ? transactions
        : transactions.filter(tx => tx.type === filterType);

    const getIcon = (type) => {
        switch (type) {
            case 'buy':
            case 'contribution':
                return <ArrowDownCircle className="text-emerald-400 group-hover:scale-110 transition-transform" size={20} />;
            case 'sell':
            case 'withdrawal':
                return <ArrowUpCircle className="text-rose-400 group-hover:scale-110 transition-transform" size={20} />;
            default:
                return <DollarSign className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />;
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">

            {/* --- PAGE HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 fintech-card p-6 border-l-4 border-l-indigo-500 bg-gradient-to-r from-slate-800 to-slate-900 shadow-xl">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mb-1 flex items-center gap-3">
                        <ListOrdered size={32} className="text-indigo-400" /> Transaction History
                    </h1>
                    <p className="text-slate-400 font-medium">Record and track all your financial movements transparently.</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative group flex items-center bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 cursor-pointer hover:border-indigo-500/50 transition-colors">
                        <Filter size={16} className="text-slate-400 group-hover:text-indigo-400 mr-2" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-200 uppercase tracking-widest outline-none appearance-none cursor-pointer"
                        >
                            <option value="all">All Types</option>
                            <option value="buy">Buys</option>
                            <option value="sell">Sells</option>
                            <option value="dividend">Dividends</option>
                        </select>
                    </div>

                    <button onClick={handleExport} className="fintech-btn-secondary flex items-center gap-2 !py-2.5">
                        <Download size={18} /> CSV
                    </button>
                    <button onClick={openNewModal} className="fintech-btn-primary flex items-center gap-2 !py-2.5">
                        <Plus size={18} /> Add Record
                    </button>
                </div>
            </div>

            {/* --- SPACER --- */}
            <div className="h-0"></div>

            <div className="fintech-card overflow-hidden shadow-2xl border-t border-slate-700/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 border-b border-slate-700/80 shadow-sm">
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Date</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Type</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Asset</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Qty</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Price</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Fees</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Total</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 bg-slate-800/50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="8" className="p-5"><div className="skeleton h-8 w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-16 text-center text-slate-500 font-medium">
                                        <ListOrdered size={48} className="mx-auto mb-4 opacity-50 text-slate-600" />
                                        No transactions match your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => {
                                    const total = (tx.quantity * tx.price) + Number(tx.fees);
                                    return (
                                        <tr key={tx.id} className="hover:bg-slate-700/40 transition-colors group cursor-default">
                                            <td className="p-5 font-medium text-slate-400 whitespace-nowrap">{new Date(tx.executed_at).toLocaleString(undefined, {
                                                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}</td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2.5 font-bold capitalize tracking-wide">
                                                    <div className={`p-1.5 rounded-lg border ${['buy', 'contribution'].includes(tx.type) ? 'bg-emerald-500/10 border-emerald-500/20' : ['sell', 'withdrawal'].includes(tx.type) ? 'bg-rose-500/10 border-rose-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                                                        {getIcon(tx.type)}
                                                    </div>
                                                    <span className={`${['buy', 'contribution'].includes(tx.type) ? 'text-emerald-400' : ['sell', 'withdrawal'].includes(tx.type) ? 'text-rose-400' : 'text-blue-400'}`}>
                                                        {tx.type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5 font-black text-slate-200 uppercase tracking-widest">{tx.symbol || '-'}</td>
                                            <td className="p-5 font-bold text-slate-300">{tx.quantity > 0 ? parseFloat(tx.quantity).toLocaleString(undefined, { maximumFractionDigits: 4 }) : '-'}</td>
                                            <td className="p-5 font-bold text-slate-300">{tx.price > 0 ? `$${parseFloat(tx.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}</td>
                                            <td className="p-5 font-medium text-slate-500">${parseFloat(tx.fees).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="p-5 font-black text-slate-100">${total > 0 ? total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEditModal(tx)} className="p-2.5 text-blue-400 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 transition-all border border-blue-500/20 shadow hover:shadow-lg hover:-translate-y-0.5">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(tx.id)} className="p-2.5 text-rose-400 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-all border border-rose-500/20 shadow hover:shadow-lg hover:-translate-y-0.5">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-700/80 transform transition-all scale-100 opacity-100">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700/50">
                            <h2 className="text-2xl font-black text-slate-100 tracking-tight">{editingTransaction ? 'Edit Transaction' : 'Record Transaction'}</h2>
                            <button title="Close" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-200 bg-slate-700/30 hover:bg-slate-700/80 p-2 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Type</label>
                                <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="fintech-select font-bold text-lg h-14">
                                    <option value="buy">Buy</option>
                                    <option value="sell">Sell</option>
                                    <option value="dividend">Dividend</option>
                                    <option value="contribution">Contribution</option>
                                    <option value="withdrawal">Withdrawal</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Symbol / Asset</label>
                                    <input type="text" value={formData.symbol} onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })} className="fintech-input uppercase font-black text-lg h-14 tracking-widest" placeholder="e.g. MSFT" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Quantity</label>
                                    <input required type="number" step="0.0001" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="fintech-input font-bold text-lg h-14" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Price/Unit</label>
                                    <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="fintech-input font-bold text-lg h-14" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Fees / Costs</label>
                                <input required type="number" step="0.01" value={formData.fees} onChange={e => setFormData({ ...formData, fees: e.target.value })} className="fintech-input font-bold text-lg h-14" />
                            </div>

                            <div className="pt-6">
                                <button type="submit" className="fintech-btn-primary w-full flex justify-center py-4 text-lg">
                                    {editingTransaction ? 'Save Changes' : 'Record Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
