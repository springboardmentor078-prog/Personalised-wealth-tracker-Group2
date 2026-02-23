import React, { useState } from 'react';
import { DownloadCloud, Loader2, CheckCircle, Calendar, FileText, Download, Trash2, ArrowRight, FileCheck, Layers } from 'lucide-react';

const Reports = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [history, setHistory] = useState([]);

    const [builderForm, setBuilderForm] = useState({
        type: 'Dashboard Summary',
        startDate: '',
        endDate: '',
        format: 'PDF',
    });

    const handleGenerate = (e) => {
        e.preventDefault();
        setIsGenerating(true);

        // Simulate backend report generation
        setTimeout(() => {
            const newReport = {
                id: Date.now(),
                name: `${builderForm.type.replace(' ', '_')}_Report`,
                type: builderForm.type,
                dateRange: builderForm.startDate && builderForm.endDate ? `${builderForm.startDate} to ${builderForm.endDate}` : 'All Time',
                format: builderForm.format,
                generatedAt: new Date().toISOString(),
            };

            setHistory([newReport, ...history]);
            setIsGenerating(false);
            setToastMsg('Report generated and downloaded successfully!');
            setTimeout(() => setToastMsg(''), 4000);

            // In a real app, window.location.href = download_url or Blob download
        }, 1500);
    };

    const handleDelete = (id) => {
        setHistory(history.filter(h => h.id !== id));
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-12 w-full max-w-6xl mx-auto">

            {/* --- PAGE HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 fintech-card p-6 border-l-4 border-l-indigo-500 shadow-xl bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl shadow-inner border border-indigo-500/30">
                        <DownloadCloud size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Report Center</h1>
                        <p className="text-slate-400 font-medium tracking-wide">Generate custom exports and structured datasets summarizing your ecosystem.</p>
                    </div>
                </div>
            </div>

            {/* --- TOAST NOTIFICATION --- */}
            {toastMsg && (
                <div className="fixed bottom-6 right-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom flex-row">
                    <CheckCircle size={20} className="text-emerald-500" />
                    <span className="font-bold">{toastMsg}</span>
                </div>
            )}

            {/* --- SECTION 1: REPORT BUILDER --- */}
            <div className="fintech-card p-8 border-t-2 border-t-emerald-500 relative overflow-hidden shadow-xl bg-[#1e293b]">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Layers size={200} />
                </div>

                <h2 className="text-xl font-black text-slate-100 mb-6 flex items-center gap-2 relative z-10">
                    <FileCheck className="text-emerald-400" size={24} /> Generate Custom Report
                </h2>

                <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">

                    {/* Report Type */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Report Type</label>
                        <select
                            required
                            className="fintech-select font-bold !bg-slate-900/80"
                            value={builderForm.type}
                            onChange={(e) => setBuilderForm({ ...builderForm, type: e.target.value })}
                        >
                            <option value="Dashboard Summary">Dashboard Summary</option>
                            <option value="Portfolio Allocation">Portfolio Allocation</option>
                            <option value="Goals Overview">Goals Overview</option>
                            <option value="Transactions Log">Transactions Log</option>
                            <option value="Investment Performance">Investment Performance</option>
                        </select>
                    </div>

                    {/* Date Range Start */}
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                            <Calendar size={14} /> Start Date
                        </label>
                        <input
                            type="date"
                            className="fintech-input font-bold !bg-slate-900/80 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                            value={builderForm.startDate}
                            onChange={(e) => setBuilderForm({ ...builderForm, startDate: e.target.value })}
                        />
                    </div>

                    {/* Date Range End */}
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                            <Calendar size={14} /> End Date
                        </label>
                        <input
                            type="date"
                            className="fintech-input font-bold !bg-slate-900/80 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                            value={builderForm.endDate}
                            onChange={(e) => setBuilderForm({ ...builderForm, endDate: e.target.value })}
                        />
                    </div>

                    {/* Format */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1 lg:row-start-2">
                        <label className="flex items-center gap-1.5 text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                            <FileText size={14} /> Output Format
                        </label>
                        <select
                            required
                            className="fintech-select font-bold !bg-slate-900/80"
                            value={builderForm.format}
                            onChange={(e) => setBuilderForm({ ...builderForm, format: e.target.value })}
                        >
                            <option value="PDF">PDF Document</option>
                            <option value="CSV">CSV Data (Excel)</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:row-start-2 flex items-end">
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className={`fintech-btn-primary w-full md:w-auto px-8 !py-3.5 flex items-center justify-center gap-2 text-base shadow-emerald-900/30 ${isGenerating && 'opacity-80 cursor-wait'}`}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Compiling Data...
                                </>
                            ) : (
                                <>
                                    <Download size={18} /> Generate & Download
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* --- SECTION 2: GENERATED REPORT HISTORY --- */}
            <div className="fintech-card overflow-hidden shadow-2xl bg-[#1e293b] border-t-2 border-t-blue-500 relative">
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
                    <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
                        <FileText className="text-blue-400" size={20} /> Generated Reports
                    </h2>
                    <span className="text-xs font-bold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/20 tracking-wider uppercase">
                        {history.length} Files
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/80 border-b border-slate-700/80">
                                <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Report Name</th>
                                <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Type / Content</th>
                                <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Date Filters</th>
                                <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Format</th>
                                <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Generated At</th>
                                <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 bg-slate-800/30">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center text-slate-500 font-medium">
                                        <FileText className="mx-auto mb-4 opacity-50 text-slate-600" size={48} />
                                        No reports have been generated yet.
                                    </td>
                                </tr>
                            ) : (
                                history.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-700/40 transition-colors group">
                                        <td className="p-4 font-bold text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg text-white font-black text-[10px] ${report.format === 'PDF' ? 'bg-rose-500 shadow-rose-500/30 shadow-lg' : 'bg-emerald-500 shadow-emerald-500/30 shadow-lg'}`}>
                                                    {report.format}
                                                </div>
                                                <span className="truncate max-w-[150px] inline-block" title={report.name}>{report.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-slate-300">{report.type}</td>
                                        <td className="p-4 font-medium text-slate-400 text-sm whitespace-nowrap">{report.dateRange}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold border tracking-wide uppercase ${report.format === 'PDF' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                                {report.format}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-slate-400 text-sm whitespace-nowrap">
                                            {new Date(report.generatedAt).toLocaleString(undefined, {
                                                month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-blue-400 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all border border-blue-500/20 shadow hover:shadow-lg hover:-translate-y-0.5" title="Download Again">
                                                    <Download size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(report.id)} className="p-2 text-slate-400 bg-slate-700/50 rounded-lg hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all border border-transparent shadow hover:-translate-y-0.5" title="Delete Log">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- SECTION 3: QUICK EXPORT TEMPLATES --- */}
            <div className="mb-4 mt-4 px-2">
                <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
                    Quick Export Templates
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Navigate directly to core modules to contextualize your data exports before downloading.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        title: 'Dashboard Outline',
                        description: 'Generates a PDF snapshot capturing your overall risk profile, portfolio total, asset distribution, growth graph, and goals.',
                        type: 'PDF',
                        link: '/dashboard',
                        iconColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                        accentLine: 'border-t-emerald-500'
                    },
                    {
                        title: 'Portfolio Allocation',
                        description: 'Generates a detailed PDF report isolating your asset allocations and visual breakdowns securely formatting wealth distribution patterns.',
                        type: 'PDF',
                        link: '/portfolio',
                        iconColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                        accentLine: 'border-t-indigo-500'
                    },
                    {
                        title: 'Transaction Logs',
                        description: 'Structured CSV export capturing all historical trading, deposits, and withdrawal records filtering exact quantities and prices.',
                        type: 'CSV',
                        link: '/transactions',
                        iconColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                        accentLine: 'border-t-rose-500'
                    },
                    {
                        title: 'Goal Milestones',
                        description: 'Generates a raw CSV outlining all tracked goals including monthly deposit inputs, deadlines, statuses, and capital targets.',
                        type: 'CSV',
                        link: '/goals',
                        iconColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                        accentLine: 'border-t-amber-500'
                    },
                    {
                        title: 'Investments Pipeline',
                        description: 'Yields a CSV dataset computing cost-basis mapping with live performance comparisons tracking direct floating profits limits.',
                        type: 'CSV',
                        link: '/investments',
                        iconColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                        accentLine: 'border-t-blue-500'
                    }
                ].map((rep, i) => (
                    <div key={i} className={`fintech-card p-6 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/40 border-t-2 ${rep.accentLine}`}>
                        {/* Gradient flare on hover */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-700/10 blur-3xl rounded-full group-hover:bg-slate-600/20 transition-colors pointer-events-none"></div>

                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-black text-slate-100 tracking-tight">{rep.title}</h3>
                                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm ${rep.iconColor}`}>
                                    {rep.type} Output
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">{rep.description}</p>
                        </div>

                        <a
                            href={rep.link}
                            className="inline-flex w-full items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 hover:border-slate-500/50 text-slate-200 font-bold px-4 py-3 rounded-xl transition-all shadow-md group-hover:-translate-y-0.5"
                        >
                            Review & Export Now <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-200 transition-colors" />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
