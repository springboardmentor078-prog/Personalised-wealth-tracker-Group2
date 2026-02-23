import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';
import { TrendingUp, TrendingDown, Wallet, DollarSign, Briefcase, Download, PieChart as PieChartIcon } from 'lucide-react';
import { exportElementToPDF } from '../utils/exportUtils';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Portfolio = () => {
    const [summary, setSummary] = useState(null);
    const [allocationData, setAllocationData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [sumRes, allocRes] = await Promise.all([
                api.get('/api/portfolio/summary'),
                api.get('/api/portfolio/allocation')
            ]);
            setSummary(sumRes.data);
            setAllocationData(allocRes.data);
        } catch (error) {
            console.error('Failed to fetch portfolio data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        exportElementToPDF('portfolio-view', 'portfolio-report.pdf');
    };

    if (loading) return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="fintech-card p-6 flex items-center mb-6">
                <div className="skeleton h-8 w-1/3"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-48 w-full"></div>)}
            </div>
            <div className="skeleton h-96 w-full"></div>
        </div>
    );

    if (!(summary && allocationData)) return (
        <div className="flex flex-col animate-in fade-in duration-500">
            <div className="fintech-card p-6 border-l-4 border-l-rose-500 bg-rose-500/10">
                <h3 className="text-lg font-bold text-rose-400">Failed to load portfolio summary.</h3>
            </div>
        </div>
    );

    const { total_invested, total_current_value, total_profit_loss } = summary;
    const isProfit = total_profit_loss >= 0;
    const profitPct = total_invested > 0 ? (total_profit_loss / total_invested) * 100 : 0;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12" id="portfolio-view">

            {/* --- PAGE HEADER --- */}
            <div className="fintech-card p-6 border-l-4 border-l-purple-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-800 to-slate-900 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl shadow-inner border border-purple-500/30">
                        <Briefcase size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Portfolio Summary</h1>
                        <p className="text-slate-400 font-medium tracking-wide">High-level overview of your wealth allocations and performance.</p>
                    </div>
                </div>
                <button onClick={handleExport} className="fintech-btn-secondary flex items-center gap-2" data-html2canvas-ignore>
                    <Download size={18} /> Export PDF
                </button>
            </div>

            {/* --- SPACER --- */}
            <div className="h-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="fintech-card p-8 flex flex-col justify-center border-t-2 border-t-indigo-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Invested</p>
                            <h3 className="mt-2 text-4xl font-black text-slate-100 tracking-tight">${parseFloat(total_invested).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        </div>
                        <div className="p-4 bg-indigo-500/20 rounded-2xl shadow-indigo-900/30 shadow-xl border border-indigo-500/30 transform group-hover:scale-110 transition-transform">
                            <Wallet className="text-indigo-400" size={28} />
                        </div>
                    </div>
                </div>

                <div className="fintech-card p-8 flex flex-col justify-center border-t-2 border-t-blue-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Current Value</p>
                            <h3 className="mt-2 text-4xl font-black text-slate-100 tracking-tight">${parseFloat(total_current_value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        </div>
                        <div className="p-4 bg-blue-500/20 rounded-2xl shadow-blue-900/30 shadow-xl border border-blue-500/30 transform group-hover:scale-110 transition-transform">
                            <DollarSign className="text-blue-400" size={28} />
                        </div>
                    </div>
                </div>

                <div className="fintech-card p-8 flex flex-col justify-center border-t-2 relative overflow-hidden group border-t-emerald-500">
                    <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-3xl transition-colors ${isProfit ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 'bg-rose-500/10 group-hover:bg-rose-500/20'}`}></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Profit / Loss</p>
                            <div className="flex flex-col mt-2">
                                <h3 className={`text-4xl font-black tracking-tight ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {isProfit ? '+' : ''}${parseFloat(total_profit_loss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                                <span className={`text-sm font-bold mt-1 tracking-widest inline-flex ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    ({isProfit ? '+' : ''}{profitPct.toFixed(2)}%)
                                </span>
                            </div>
                        </div>
                        <div className={`p-4 rounded-2xl shadow-xl border transform group-hover:scale-110 transition-transform ${isProfit ? 'bg-emerald-500/20 shadow-emerald-900/40 border-emerald-500/30' : 'bg-rose-500/20 shadow-rose-900/40 border-rose-500/30'}`}>
                            {isProfit ? <TrendingUp className="text-emerald-400" size={28} /> : <TrendingDown className="text-rose-400" size={28} />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="fintech-card p-8 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900">
                <h3 className="text-2xl font-black text-slate-200 mb-8 border-b border-slate-700/50 pb-4 tracking-tight flex items-center justify-between">
                    <span>Asset Class Distribution</span>
                    <span className="text-sm font-bold bg-slate-800 px-4 py-1.5 rounded-xl border border-slate-700 text-slate-400">Total Allocations: {allocationData?.allocation?.length || 0}</span>
                </h3>

                {allocationData?.allocation?.length > 0 ? (
                    <div className="flex flex-col gap-8">
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={allocationData.allocation}
                                        dataKey="total_value"
                                        nameKey="asset_class"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={160}
                                        paddingAngle={3}
                                        label={({ asset_class, percent }) => `${asset_class} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={{ stroke: '#475569', strokeWidth: 2 }}
                                        stroke="none"
                                        cornerRadius={6}
                                    >
                                        {allocationData.allocation.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `$${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                                        itemStyle={{ fontWeight: 'bold' }}
                                    />
                                    <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ color: '#cbd5e1', paddingTop: '30px', fontWeight: 'bold' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="overflow-x-auto border-t border-slate-700/50 pt-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900/50 border-b border-slate-700/80">
                                        <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Asset Class</th>
                                        <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Amount</th>
                                        <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Percentage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/80 bg-slate-800/30">
                                    {allocationData.allocation.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-700/40 transition-colors">
                                            <td className="p-4 font-bold text-slate-200 flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                                {item.asset_class}
                                            </td>
                                            <td className="p-4 font-bold text-slate-300 text-right">${parseFloat(item.total_value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="p-4 font-bold text-slate-400 text-right">{item.percentage.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="h-96 flex flex-col items-center justify-center text-slate-500 gap-4 border-2 border-dashed border-slate-700/50 rounded-3xl mx-8 mb-8 bg-slate-800/20">
                        <PieChartIcon size={80} className="mb-4 opacity-30 text-slate-600" />
                        <p className="text-xl font-bold text-slate-400">No allocation data to display</p>
                        <p className="text-sm">Add investments to visualize your wealth distribution.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Portfolio;
