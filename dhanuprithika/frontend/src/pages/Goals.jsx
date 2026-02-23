import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Download, Activity, PlayCircle } from 'lucide-react';
import api from '../services/api';
import { downloadCSV } from '../utils/exportUtils';
import GoalSimulationModal from '../components/GoalSimulationModal';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [simulationGoal, setSimulationGoal] = useState(null);
    const [editingGoal, setEditingGoal] = useState(null);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        goal_type: 'retirement',
        target_amount: '',
        target_date: '',
        monthly_contribution: '',
        status: 'active'
    });

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/goals');
            setGoals(data);
        } catch (error) {
            console.error('Failed to fetch goals', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, target_date: new Date(formData.target_date).toISOString().split('T')[0] };
            if (editingGoal) {
                await api.put(`/api/goals/${editingGoal.id}`, payload);
            } else {
                await api.post('/api/goals', payload);
            }
            setModalOpen(false);
            setEditingGoal(null);
            fetchGoals();
        } catch (error) {
            console.error('Failed to save goal', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await api.delete(`/api/goals/${id}`);
                fetchGoals();
            } catch (error) {
                console.error('Failed to delete goal', error);
            }
        }
    };

    const openEditModal = (goal) => {
        setEditingGoal(goal);
        setFormData({
            goal_type: goal.goal_type,
            target_amount: goal.target_amount,
            target_date: goal.target_date.split('T')[0],
            monthly_contribution: goal.monthly_contribution,
            status: goal.status
        });
        setModalOpen(true);
    };

    const openNewModal = () => {
        setEditingGoal(null);
        setFormData({
            goal_type: 'house',
            target_amount: '',
            target_date: '',
            monthly_contribution: '',
            status: 'active'
        });
        setModalOpen(true);
    };

    const handleExport = () => {
        const headers = ['Type', 'Target Amount', 'Monthly Contribution', 'Status', 'Target Date'];
        const rows = goals.map(g => [g.goal_type, g.target_amount, g.monthly_contribution, g.status, g.target_date]);
        downloadCSV(headers, rows, 'goals_export.csv');
    };

    const filteredGoals = filter === 'all' ? goals : goals.filter(g => g.status === filter);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">

            {/* --- PAGE HEADER --- */}
            <div className="fintech-card p-6 border-l-4 border-l-emerald-500 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-800 to-slate-900">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
                        <Activity className="text-emerald-500" size={32} /> Goal Tracker
                    </h1>
                    <p className="text-slate-400 font-medium mt-1">Set, track, and project your financial milestones.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-slate-800 p-1 rounded-xl border border-slate-700/50 flex">
                        {['all', 'active', 'paused', 'completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 text-sm font-bold uppercase rounded-lg transition-colors ${filter === f ? 'bg-slate-700 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <button onClick={handleExport} className="fintech-btn-secondary flex items-center gap-2 !py-2">
                        <Download size={18} /> CSV
                    </button>
                    <button onClick={openNewModal} className="fintech-btn-primary flex items-center gap-2 !py-2">
                        <Plus size={18} /> New Goal
                    </button>
                </div>
            </div>

            {/* --- SPACER --- */}
            <div className="h-0"></div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton h-64 w-full"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGoals.map((goal) => {
                        const currentSaved = 0; // Backend placeholder for accumulated savings per goal wasn't strictly built yet
                        const progress = Math.min(100, (currentSaved / parseFloat(goal.target_amount)) * 100);
                        return (
                            <div key={goal.id} className="fintech-card p-6 relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-1.5 h-full transition-colors ${goal.status === 'active' ? 'bg-emerald-500' : goal.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>

                                <div className="flex justify-between items-start mb-6 pr-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-100 capitalize tracking-tight">{goal.goal_type}</h3>
                                        <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                                            Target: <strong className="text-emerald-400">${parseFloat(goal.target_amount).toLocaleString()}</strong>
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase border shadow-sm ${goal.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : goal.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                        {goal.status}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="w-full bg-slate-700/50 rounded-full h-3.5 shadow-inner overflow-hidden border border-slate-700">
                                        <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(2, progress)}%` }}></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                            <p className="text-xs font-medium text-slate-400">Monthly Deposit</p>
                                            <p className="font-bold text-slate-200 mt-0.5">${parseFloat(goal.monthly_contribution).toLocaleString()}</p>
                                        </div>
                                        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                            <p className="text-xs font-medium text-slate-400">Deadline</p>
                                            <p className="font-bold text-blue-400 mt-0.5">{new Date(goal.target_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                                    <button onClick={() => setSimulationGoal(goal)} className="flex items-center gap-1.5 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors group-hover:translate-x-1 duration-300">
                                        <PlayCircle size={18} /> Simulate
                                    </button>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(goal)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/20">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(goal.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {filteredGoals.length === 0 && !loading && (
                <div className="fintech-card border-2 border-dashed border-slate-700 p-16 text-center bg-slate-800/30 flex flex-col items-center justify-center">
                    <Activity size={48} className="text-slate-600 mb-4" />
                    <p className="text-xl font-bold text-slate-300">No goals found</p>
                    <p className="text-slate-500 font-medium mt-2">Adjust your filters or create a new financial milestone to project.</p>
                </div>
            )}

            {/* Goal Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-100">{editingGoal ? 'Edit Goal' : 'Create Goal'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Milestone Category</label>
                                <input required type="text" value={formData.goal_type} onChange={e => setFormData({ ...formData, goal_type: e.target.value })} className="fintech-input" placeholder="e.g. Retirement, House, Car" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Target Amount ($)</label>
                                    <input required type="number" step="0.01" value={formData.target_amount} onChange={e => setFormData({ ...formData, target_amount: e.target.value })} className="fintech-input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Monthly Deposit ($)</label>
                                    <input required type="number" step="0.01" value={formData.monthly_contribution} onChange={e => setFormData({ ...formData, monthly_contribution: e.target.value })} className="fintech-input" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Target Date</label>
                                <input required type="date" value={formData.target_date} onChange={e => setFormData({ ...formData, target_date: e.target.value })} className="fintech-input [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="fintech-select">
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <button type="submit" className="fintech-btn-primary w-full mt-6 flex justify-center py-3.5">
                                {editingGoal ? 'Update Milestone' : 'Save Milestone'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Goal Simulation Modal */}
            {simulationGoal && (
                <GoalSimulationModal goal={simulationGoal} onClose={() => setSimulationGoal(null)} />
            )}
        </div>
    );
};

export default Goals;
