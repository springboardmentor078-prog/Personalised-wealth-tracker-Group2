import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { exportElementToPDF } from '../utils/exportUtils';

const GoalSimulationModal = ({ goal, onClose }) => {
    const [targetAmount, setTargetAmount] = useState(parseFloat(goal.target_amount));
    const [currentAmount] = useState(0); // Assuming 0 as we don't track saved locally per goal yet
    const [monthlyContribution, setMonthlyContribution] = useState(parseFloat(goal.monthly_contribution));
    const [annualReturn, setAnnualReturn] = useState(7.0);
    const [inflationRate] = useState(2.5);
    const [timeHorizon, setTimeHorizon] = useState(10);

    const [projectionData, setProjectionData] = useState([]);
    const [achievable, setAchievable] = useState(false);
    const [finalValue, setFinalValue] = useState(0);
    const [estimatedCompletion, setEstimatedCompletion] = useState(null);

    useEffect(() => {
        // Calculate difference between Target Date and Now
        const targetDate = new Date(goal.target_date);
        const now = new Date();
        const monthsDiff = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
        const yearsDiff = Math.max(1, Math.ceil(monthsDiff / 12));
        setTimeHorizon(yearsDiff);
    }, [goal.target_date]);

    useEffect(() => {
        calculateProjection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetAmount, currentAmount, monthlyContribution, annualReturn, inflationRate, timeHorizon]);

    const calculateProjection = () => {
        const data = [];
        let current = currentAmount;
        const monthlyRate = (annualReturn / 100) / 12;
        const totalMonths = timeHorizon * 12;
        // Real target adjusted for inflation over time
        // But for simpler chart, we project nominal target
        let achievedMonth = null;

        for (let m = 0; m <= totalMonths; m++) {
            if (m % 12 === 0) {
                data.push({
                    year: m / 12,
                    projected: parseFloat(current.toFixed(2)),
                    target: targetAmount
                });
            }

            if (!achievedMonth && current >= targetAmount) {
                achievedMonth = m;
            }

            current = current * (1 + monthlyRate) + monthlyContribution;
        }

        setProjectionData(data);
        setFinalValue(current);
        setAchievable(current >= targetAmount);

        if (achievedMonth) {
            const completionDate = new Date();
            completionDate.setMonth(completionDate.getMonth() + achievedMonth);
            setEstimatedCompletion(completionDate.toLocaleDateString());
        } else {
            setEstimatedCompletion('Unreachable in timeframe');
        }
    };

    const exportSimulation = () => {
        exportElementToPDF('simulation-report', `${goal.goal_type}-simulation.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-5xl shadow-2xl relative my-8" id="simulation-report">

                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100 capitaize capitalize">{goal.goal_type} Simulation</h2>
                            <p className="text-sm font-medium text-slate-400">Project different scenarios to achieve your ${targetAmount.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={exportSimulation} className="fintech-btn-secondary py-2 flex items-center gap-2" data-html2canvas-ignore>
                            <Download size={16} /> Export PDF
                        </button>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-200" data-html2canvas-ignore>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Controls section */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="fintech-card p-5 border-l-4 border-l-blue-500 bg-slate-800">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Variables</h3>

                            <div className="space-y-5">
                                <div>
                                    <label className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                                        <span>Monthly Contribution</span>
                                        <span className="text-emerald-400 font-bold">${monthlyContribution}</span>
                                    </label>
                                    <input type="range" min="0" max="10000" step="50" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full accent-emerald-500" />
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                                        <span>Expected Annual Return</span>
                                        <span className="text-blue-400 font-bold">{annualReturn}%</span>
                                    </label>
                                    <input type="range" min="1" max="25" step="0.5" value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value))} className="w-full accent-blue-500" />
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                                        <span>Time Horizon</span>
                                        <span className="text-indigo-400 font-bold">{timeHorizon} Years</span>
                                    </label>
                                    <input type="range" min="1" max="50" step="1" value={timeHorizon} onChange={(e) => setTimeHorizon(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>

                                <div className="pt-4 border-t border-slate-700">
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Target Amount</label>
                                    <input type="number" value={targetAmount} onChange={e => setTargetAmount(Number(e.target.value))} className="fintech-input py-2 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results section */}
                    <div className="lg:col-span-2 space-y-6">

                        <div className="grid grid-cols-2 gap-4">
                            <div className={`p-5 rounded-2xl border ${achievable ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                                <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                    Status {achievable ? <CheckCircle size={16} className="text-emerald-400" /> : <AlertTriangle size={16} className="text-rose-400" />}
                                </p>
                                <h2 className={`text-2xl font-bold mt-1 ${achievable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {achievable ? 'On Track' : 'Shortfall Detected'}
                                </h2>
                                <p className="text-sm mt-1 text-slate-300">
                                    Projected final value: <strong className="text-white">${finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                                </p>
                            </div>

                            <div className="fintech-card p-5">
                                <p className="text-sm font-medium text-slate-400">Estimated Completion</p>
                                <h2 className="text-2xl font-bold mt-1 text-slate-100">{estimatedCompletion}</h2>
                                <p className="text-sm mt-1 text-slate-500">Based on compounded returns</p>
                            </div>
                        </div>

                        <div className="fintech-card p-6 h-80">
                            <h3 className="text-sm font-bold text-slate-300 mb-4">Projection Over Time</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={projectionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="year" stroke="#94a3b8" tickFormatter={(v) => `Yr ${v}`} />
                                    <YAxis stroke="#94a3b8" tickFormatter={(v) => `$${(v / 1000)}k`} />
                                    <Tooltip
                                        formatter={(value) => `$${value.toLocaleString()}`}
                                        labelFormatter={(label) => `Year ${label}`}
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                                    />
                                    <ReferenceLine y={targetAmount} label={{ position: 'top', value: 'Target', fill: '#94a3b8', fontSize: 12 }} stroke="#f59e0b" strokeDasharray="3 3" />
                                    <Line type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalSimulationModal;
