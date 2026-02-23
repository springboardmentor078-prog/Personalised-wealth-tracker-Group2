import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, RefreshCcw, TrendingUp, TrendingDown, Download, Briefcase } from 'lucide-react';
import api from '../services/api';
import { getAlphaVantagePrice } from '../services/marketService';
import { downloadCSV } from '../utils/exportUtils';

const Investments = () => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingPrices, setUpdatingPrices] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingInvestment, setEditingInvestment] = useState(null);

    const [formData, setFormData] = useState({
        asset_type: 'stock',
        symbol: '',
        units: '',
        avg_buy_price: ''
    });

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/investments');
            setInvestments(data);
        } catch (error) {
            console.error('Failed to fetch investments', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    const updatePrices = async () => {
        setUpdatingPrices(true);
        let updatedCount = 0;

        for (const inv of investments) {
            if (inv.asset_type === 'stock') {
                const livePrice = await getAlphaVantagePrice(inv.symbol);
                if (livePrice) {
                    try {
                        await api.put(`/api/investments/${inv.id}`, {
                            last_price: livePrice,
                            current_value: livePrice * inv.units
                        });
                        updatedCount++;
                    } catch (err) {
                        console.error(`Failed to push price for ${inv.symbol}`, err);
                    }
                }
            }
        }

        if (updatedCount > 0) {
            await fetchInvestments();
        }
        setUpdatingPrices(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingInvestment) {
                const payload = {
                    units: parseFloat(formData.units),
                    avg_buy_price: parseFloat(formData.avg_buy_price)
                };
                payload.cost_basis = payload.units * payload.avg_buy_price;
                payload.current_value = payload.units * (editingInvestment.last_price || payload.avg_buy_price);

                await api.put(`/api/investments/${editingInvestment.id}`, payload);
            } else {
                await api.post('/api/investments', formData);
            }
            setModalOpen(false);
            setEditingInvestment(null);
            setFormData({ asset_type: 'stock', symbol: '', units: '', avg_buy_price: '' });
            fetchInvestments();
        } catch (error) {
            console.error('Failed to save investment', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await api.delete(`/api/investments/${id}`);
                fetchInvestments();
            } catch (error) {
                console.error('Failed to delete investment', error);
            }
        }
    };

    const openNewModal = () => {
        setEditingInvestment(null);
        setFormData({ asset_type: 'stock', symbol: '', units: '', avg_buy_price: '' });
        setModalOpen(true);
    };

    const openEditModal = (inv) => {
        setEditingInvestment(inv);
        setFormData({
            asset_type: inv.asset_type,
            symbol: inv.symbol,
            units: inv.units,
            avg_buy_price: inv.avg_buy_price
        });
        setModalOpen(true);
    };

    const handleExport = () => {
        const headers = ['Symbol', 'Asset Type', 'Units', 'Avg Buy Price', 'Last Price', 'Current Value', 'Profit'];
        const rows = investments.map(inv => {
            const p = (inv.current_value - inv.cost_basis);
            return [
                inv.symbol, inv.asset_type, inv.units, inv.avg_buy_price, inv.last_price, inv.current_value, p.toFixed(2)
            ];
        });
        downloadCSV(headers, rows, 'investments_export.csv');
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">

            {/* --- PAGE HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 fintech-card p-6 border-l-4 border-l-blue-500 bg-gradient-to-r from-slate-800 to-slate-900 shadow-xl">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mb-1 flex items-center gap-3">
                        <Briefcase size={32} className="text-blue-400" /> Active Investments
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Manage and track your individual asset positions in real-time.</p>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <button onClick={updatePrices} disabled={updatingPrices} className="fintech-btn-secondary flex items-center gap-2 border border-slate-700 hover:border-blue-500/50">
                        <RefreshCcw size={18} className={`${updatingPrices ? "animate-spin text-blue-400" : "text-slate-400"}`} />
                        {updatingPrices ? 'Syncing Markets...' : 'Live Prices'}
                    </button>
                    <button onClick={handleExport} className="fintech-btn-secondary flex items-center gap-2">
                        <Download size={18} /> CSV
                    </button>
                    <button onClick={openNewModal} className="fintech-btn-primary flex items-center gap-2">
                        <Plus size={18} /> Add Asset
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
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Asset</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Units</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Cost Basis</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider text-emerald-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Last Price</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Value (NAV)</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider">Profit/Loss</th>
                                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 bg-slate-800/50">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="7" className="p-5"><div className="skeleton h-12 w-full"></div></td>
                                    </tr>
                                ))
                            ) : investments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-16 text-center text-slate-500 font-medium">
                                        <Briefcase size={48} className="mx-auto mb-4 opacity-50 text-slate-600" />
                                        No open positions detected. Start investing.
                                    </td>
                                </tr>
                            ) : (
                                investments.map((inv) => {
                                    const currentValue = Number(inv.current_value);
                                    const costBasis = Number(inv.cost_basis);
                                    const profit = currentValue - costBasis;
                                    const profitPct = costBasis > 0 ? (profit / costBasis) * 100 : 0;
                                    const isProfit = profit >= 0;

                                    return (
                                        <tr key={inv.id} className="hover:bg-slate-700/40 transition-colors group cursor-default">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-xl bg-gradient-to-br border border-white/10 ${inv.asset_type === 'stock' ? 'from-blue-500 to-indigo-600 shadow-blue-500/20' : inv.asset_type === 'crypto' ? 'from-amber-400 to-orange-500 shadow-amber-500/20' : 'from-purple-500 to-pink-600 shadow-purple-500/20'}`}>
                                                        {inv.symbol.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-100 uppercase tracking-widest text-lg">{inv.symbol}</p>
                                                        <span className="text-xs font-bold text-slate-400 capitalize px-2 py-0.5 bg-slate-900 rounded-md border border-slate-700/50 mt-1 inline-block">{inv.asset_type}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5 font-bold text-slate-300">{parseFloat(inv.units).toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>

                                            <td className="p-5">
                                                <p className="font-black text-slate-200">${costBasis.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                <p className="text-xs font-medium text-slate-500">Avg: ${parseFloat(inv.avg_buy_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                            </td>

                                            <td className="p-5 font-black text-emerald-400 text-lg">${parseFloat(inv.last_price || inv.avg_buy_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="p-5 font-black text-slate-100 text-lg">${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>

                                            <td className="p-5">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-black border tracking-wide shadow-lg ${isProfit ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-900/20'}`}>
                                                    {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                    {isProfit ? '+' : ''}${Math.abs(profit).toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs opacity-75">({profitPct.toFixed(2)}%)</span>
                                                </div>
                                            </td>

                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEditModal(inv)} className="p-2.5 text-blue-400 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 transition-all border border-blue-500/20 shadow hover:shadow-lg hover:-translate-y-0.5">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(inv.id)} className="p-2.5 text-rose-400 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-all border border-rose-500/20 shadow hover:shadow-lg hover:-translate-y-0.5">
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
                    <div className="bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-700/80">

                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700/50">
                            <h2 className="text-2xl font-black text-slate-100 tracking-tight">{editingInvestment ? 'Edit Position' : 'Open Position'}</h2>
                            <button title="Close" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-200 bg-slate-700/30 hover:bg-slate-700/80 p-2 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Asset Type</label>
                                <select required disabled={!!editingInvestment} value={formData.asset_type} onChange={e => setFormData({ ...formData, asset_type: e.target.value })} className="fintech-select font-bold text-lg h-14 disabled:opacity-50">
                                    <option value="stock">Stock</option>
                                    <option value="crypto">Crypto</option>
                                    <option value="bond">Bond</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Symbol / Ticker</label>
                                <input required disabled={!!editingInvestment} type="text" value={formData.symbol} onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })} className="fintech-input uppercase font-black text-lg h-14 tracking-widest disabled:opacity-50" placeholder="e.g. AAPL" />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Total Units</label>
                                    <input required type="number" step="0.0001" value={formData.units} onChange={e => setFormData({ ...formData, units: e.target.value })} className="fintech-input font-bold text-lg h-14" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Avg Buy Price</label>
                                    <input required type="number" step="0.01" value={formData.avg_buy_price} onChange={e => setFormData({ ...formData, avg_buy_price: e.target.value })} className="fintech-input font-bold text-lg h-14" />
                                </div>
                            </div>
                            <div className="pt-6">
                                <button type="submit" className="fintech-btn-primary w-full flex justify-center py-4 text-lg shadow-emerald-500/20">
                                    {editingInvestment ? 'Update Position' : 'Commit Position'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Investments;
