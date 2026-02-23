import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Target, Briefcase, ListOrdered, UserCircle, LogOut, BarChart3, FileText, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Portfolio', path: '/portfolio', icon: <BarChart3 size={20} /> },
        { name: 'Investments', path: '/investments', icon: <Briefcase size={20} /> },
        { name: 'Transactions', path: '/transactions', icon: <ListOrdered size={20} /> },
        { name: 'Goals', path: '/goals', icon: <Target size={20} /> },
        { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
        { name: 'Profile', path: '/profile', icon: <UserCircle size={20} /> },
    ];

    return (
        <div className="w-[240px] shrink-0 h-screen bg-[#0f172a] border-r border-[#334155] flex flex-col justify-between shadow-lg z-20">
            <div className="p-6">
                <h1 className="text-2xl font-black text-white tracking-tight mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                        <Activity className="text-emerald-500" size={24} />
                    </div>
                    <span>Wealth<span className="text-emerald-500">Track</span></span>
                </h1>
                <nav className="space-y-1.5 flex flex-col">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-[#1e293b] text-emerald-400 font-semibold shadow-sm'
                                    : 'text-slate-400 font-medium hover:bg-[#1e293b]/60 hover:text-slate-200'
                                }`
                            }
                        >
                            <span className={({ isActive }) => isActive ? 'text-emerald-400' : 'text-slate-500'}>{item.icon}</span>
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-6 border-t border-[#1e293b]">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-medium text-sm group"
                >
                    <LogOut size={20} className="text-slate-500 group-hover:text-rose-400" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
