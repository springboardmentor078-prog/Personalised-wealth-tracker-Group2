import React, { useState, useEffect } from 'react';
import { User, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
    const { user, fetchUserProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        risk_profile: 'moderate'
    });
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                risk_profile: user.risk_profile
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg('');
        try {
            await api.patch('/api/profile/me', formData);
            await fetchUserProfile(); // Update context
            setSuccessMsg('Profile updated successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setSaving(false);
        }
    };

    if (!user) return (
        <div className="flex flex-col animate-in fade-in duration-500">
            <div className="fintech-card p-6">
                <p className="text-slate-500 font-medium">Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12 w-full max-w-3xl mx-auto">

            {/* --- PAGE HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 fintech-card p-6 border-l-4 border-l-emerald-500 shadow-xl bg-gradient-to-r from-slate-800 to-slate-900">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl shadow-inner border border-emerald-500/30">
                        <User size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Your Profile</h1>
                        <p className="text-slate-400 font-medium tracking-wide">Manage your account details and risk preferences.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border shadow-sm ${user.kyc_status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {user.kyc_status === 'verified' ? <CheckCircle size={16} /> : <Shield size={16} />}
                        KYC: <span className="uppercase">{user.kyc_status}</span>
                    </span>
                </div>
            </div>

            {/* --- SPACER --- */}
            <div className="h-0"></div>

            <div className="fintech-card overflow-hidden">
                <div className="p-8">

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {successMsg && (
                            <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl text-sm font-medium border border-emerald-500/20 flex items-center gap-2">
                                <CheckCircle size={16} /> {successMsg}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-400">Email (Read Only)</label>
                            <input type="email" readOnly value={user.email} className="fintech-input !bg-slate-800/50 !text-slate-500 cursor-not-allowed" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300">Full Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="fintech-input" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300">Risk Profile</label>
                            <div className="mt-2 text-xs text-sky-400 mb-4 bg-sky-500/10 p-4 rounded-xl border border-sky-500/20">
                                Changes to your risk profile might trigger portfolio rebalancing recommendations.
                            </div>
                            <select value={formData.risk_profile} onChange={e => setFormData({ ...formData, risk_profile: e.target.value })} className="fintech-select">
                                <option value="conservative">Conservative</option>
                                <option value="moderate">Moderate</option>
                                <option value="aggressive">Aggressive</option>
                            </select>
                        </div>

                        <button type="submit" disabled={saving} className="fintech-btn-primary w-full mt-4">
                            {saving ? 'Saving Changes...' : 'Save Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
