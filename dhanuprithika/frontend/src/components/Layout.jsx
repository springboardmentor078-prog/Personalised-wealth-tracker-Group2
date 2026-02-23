import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#0f172a]">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
