import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Download, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { exportElementToPDF } from '../utils/exportUtils';

const Navbar = () => {
    const location = useLocation();
    const pathName = location.pathname.split('/').pop();
    const title = pathName ? pathName.charAt(0).toUpperCase() + pathName.slice(1) : 'Overview';
    const { user } = useAuth();

    const handleExport = () => {
        exportElementToPDF(`${pathName}-view`, `${pathName}-report.pdf`);
    };

    return (
        <header className="h-[64px] bg-[#0f172a] border-b border-[#334155] flex items-center justify-between px-6 z-10 w-full shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-slate-100 tracking-tight">{title}</h2>
            </div>

            <div className="flex items-center gap-5">

                {/* Mock Search Hook */}
                <div className="hidden md:flex relative group items-center mr-2">
                    <Search size={16} className="absolute left-3 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Quick search..."
                        className="pl-9 pr-4 py-2 bg-[#1e293b] border border-slate-700/50 rounded-lg text-sm font-medium text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors w-48"
                    />
                </div>

                {/* Global Export Button */}
                <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-[#1e293b] border border-slate-700/50 rounded-lg text-slate-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all text-sm font-semibold shadow-sm" data-html2canvas-ignore>
                    <Download size={16} /> Export PDF
                </button>

                {/* Profile Element Map */}
                <div className="flex items-center gap-3 pl-5 border-l border-[#1e293b] cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors leading-tight">{user?.name}</p>
                        <p className="text-xs text-slate-500 font-medium leading-tight">Profile View</p>
                    </div>
                    <ChevronDown size={16} className="text-slate-500 group-hover:text-indigo-400" />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
