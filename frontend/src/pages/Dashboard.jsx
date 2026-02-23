import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpCircle, ArrowDownCircle, Target, PieChart as PieChartIcon } from 'lucide-react';
import api from '../services/api';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [recentTx, setRecentTx] = useState([]);
    const [allocationData, setAllocationData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const [sumRes, txRes, allocRes] = await Promise.all([
                api.get('/api/dashboard/summary'),
                api.get('/api/transactions'),
                api.get('/api/portfolio/allocation')
            ]);
            setData(sumRes.data);
            setRecentTx(txRes.data.slice(0, 5));
            setAllocationData(allocRes.data);
        } catch (error) {
            console.error('Error fetching dashboard', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="fintech-card p-6 flex items-center mb-6">
                <div className="skeleton h-8 w-1/3"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 w-full rounded-xl"></div>)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => <div key={i} className="skeleton h-96 w-full rounded-xl"></div>)}
            </div>
        </div>
    );

    if (!(data && allocationData)) return (
        <div className="flex flex-col animate-in fade-in duration-500">
            <div className="fintech-card p-6 border-l-4 border-l-rose-500 bg-rose-500/10">
                <h3 className="text-lg font-bold text-rose-400">Failed to load dashboard structure.</h3>
            </div>
        </div>
    );

    const {
        total_invested,
        total_current_value,
        total_profit_loss,
        asset_allocation,
        goal_progress_summary,
    } = data;

    const isProfit = total_profit_loss >= 0;

    // Static mockup logic representing timeline injections matching Recharts cleanly
    const historicalGrowth = [
        { name: 'Jan', value: Number(total_current_value) * 0.75 },
        { name: 'Feb', value: Number(total_current_value) * 0.8 },
        { name: 'Mar', value: Number(total_current_value) * 0.85 },
        { name: 'Apr', value: Number(total_current_value) * 0.82 },
        { name: 'May', value: Number(total_current_value) * 0.95 },
        { name: 'Jun', value: Number(total_current_value) },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12" id="dashboard-view">

            {/* --- PAGE HEADER --- */}
            <div className="fintech-card p-6 border-l-4 border-l-blue-500 shadow-xl flex justify-between items-center bg-gradient-to-r from-slate-800 to-slate-900">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-400 font-medium mt-1">Real-time pulse of your financial ecosystem.</p>
                </div>
            </div>

            {/* --- SPACER --- */}
            <div className="h-0"></div>

            {/* --- ROW 1: STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Portfolio value */}
                <div className="bg-[#1e293b] rounded-xl shadow-md p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Total Portfolio Value</p>
                            <h3 className="mt-2 text-3xl font-black text-slate-100 tracking-tight">${parseFloat(total_current_value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-xl shadow-inner border border-blue-500/30">
                            <DollarSign size={24} className="text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Total Invested */}
                <div className="bg-[#1e293b] rounded-xl shadow-md p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-slate-700/50 hover:border-indigo-500/50">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Total Invested Cost</p>
                            <h3 className="mt-2 text-3xl font-black text-slate-100 tracking-tight">${parseFloat(total_invested).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        </div>
                        <div className="p-3 bg-indigo-500/20 rounded-xl shadow-inner border border-indigo-500/30">
                            <Wallet size={24} className="text-indigo-400" />
                        </div>
                    </div>
                </div>

                {/* Profit Loss */}
                <div className="bg-[#1e293b] rounded-xl shadow-md p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-slate-700/50 hover:border-emerald-500/50">
                    <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-3xl transition-colors ${isProfit ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 'bg-rose-500/10 group-hover:bg-rose-500/20'}`}></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Unrealized Net Pnl</p>
                            <h3 className={`mt-2 text-3xl font-black tracking-tight ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isProfit ? '+' : ''}${parseFloat(total_profit_loss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className={`p-3 rounded-xl shadow-inner border ${isProfit ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-rose-500/20 border-rose-500/30'}`}>
                            {isProfit ? <TrendingUp size={24} className="text-emerald-400" /> : <TrendingDown size={24} className="text-rose-400" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ROW 2: CHARTS PIPELINE --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left: Line Chart */}
                <div className="bg-[#1e293b] rounded-xl shadow-md p-6 border border-slate-700/50 flex flex-col hover:-translate-y-1 transition-transform duration-300 h-96">
                    <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-emerald-400" /> Portfolio Growth Target
                    </h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historicalGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tickMargin={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" tickFormatter={(v) => `$${(v / 1000)}k`} axisLine={false} tickLine={false} width={50} />
                                <RechartsTooltip
                                    formatter={(value) => `$${value.toLocaleString()}`}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#0f172a', stroke: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#3b82f6', stroke: '#0f172a', strokeWidth: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Pie Chart */}
                <div className="bg-[#1e293b] rounded-xl shadow-md p-6 border border-slate-700/50 flex flex-col hover:-translate-y-1 transition-transform duration-300 h-96">
                    <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                        Asset Allocation Output
                    </h3>
                    {allocationData?.allocation?.length > 0 ? (
                        <div className="flex-1 w-full relative">
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Value</span>
                                <span className="text-xl font-black text-slate-200">
                                    ${parseFloat(allocationData.total_value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={allocationData.allocation}
                                        dataKey="total_value"
                                        nameKey="asset_class"
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={70}
                                        outerRadius={105}
                                        paddingAngle={4}
                                        stroke="none"
                                        cornerRadius={6}
                                        label={({ asset_class, percent }) => `${asset_class} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={{ stroke: '#475569', strokeWidth: 1 }}
                                    >
                                        {allocationData.allocation.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        formatter={(value) => `$${parseFloat(value).toLocaleString()}`}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                                    />
                                    <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ fontSize: '13px', color: '#cbd5e1', paddingTop: '15px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-800/20">
                            <PieChartIcon size={64} className="mb-4 opacity-30 text-slate-600" />
                            <p className="text-sm font-semibold">No active investments linked.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- ROW 3: TRANSACTIONS AND GOALS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left: Recent Transactions Table */}
                <div className="bg-[#1e293b] rounded-xl shadow-md p-6 border border-slate-700/50 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">Log Matrix Pipeline</h3>
                    <div className="flex-1 flex flex-col justify-start">
                        {recentTx.length > 0 ? (
                            <div className="space-y-3">
                                {recentTx.map(tx => {
                                    const isBuy = ['buy', 'contribution'].includes(tx.type);
                                    return (
                                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0f172a]/50 hover:bg-[#0f172a] transition-colors border border-transparent hover:border-slate-700/50">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-xl ${isBuy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                                    {isBuy ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-200 capitalize tracking-tight">{tx.type} {tx.symbol}</p>
                                                    <p className="text-xs font-medium text-slate-500 mt-0.5">{new Date(tx.executed_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-200">${(tx.quantity * tx.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5 tracking-wider">{tx.quantity} units</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex h-full flex-col justify-center items-center text-slate-500 py-10 border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-800/20">
                                <p className="text-sm font-semibold">No recent transactions detected.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Goal Progress Visuals */}
                <div className="bg-[#1e293b] rounded-xl shadow-md p-6 border border-slate-700/50 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2"><Target size={20} className="text-indigo-400" /> Milestone Tracking</h3>
                        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20 shadow-inner">{goal_progress_summary.length} Active Profiles</span>
                    </div>
                    <div className="flex-1 space-y-6 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                        {goal_progress_summary.length > 0 ? (
                            goal_progress_summary.map((goal) => {
                                const limit = Math.min(100, Math.max(2, (0 / parseFloat(goal.target_amount)) * 100)); // Default mock % since saved=0 locally
                                const isComplete = goal.status === 'completed';
                                return (
                                    <div key={goal.id} className="relative p-4 rounded-xl bg-[#0f172a]/50 hover:bg-[#0f172a] transition-colors border border-transparent hover:border-slate-700/50">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-200 capitalize tracking-tight flex items-center gap-2">
                                                    {goal.goal_type}
                                                    {isComplete && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                                                </span>
                                                <span className="text-xs font-semibold text-slate-500 mt-0.5">Deadline: {new Date(goal.target_date).getFullYear()}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-black text-slate-100 tracking-tight">${parseFloat(goal.target_amount).toLocaleString()} target</span>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isComplete ? 'text-emerald-500' : 'text-indigo-400'}`}>
                                                    {isComplete ? 'Completed' : 'On Track'}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Animated Gradient Bar Pipeline Container */}
                                        <div className="w-full bg-[#1e293b] rounded-full h-3 shadow-inner border border-slate-700/50 overflow-hidden relative">
                                            <div
                                                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${isComplete ? 'from-emerald-600 to-teal-400' : 'from-indigo-600 to-blue-400'}`}
                                                style={{ width: `${isComplete ? 100 : limit}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex h-full flex-col justify-center items-center text-slate-500 py-10 border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-800/20">
                                <p className="text-sm font-semibold">No active pipelines found.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
