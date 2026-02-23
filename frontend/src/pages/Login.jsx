import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // Let App.js redirect logic handle it, but fallback handle here
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to login. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-600/20 border border-emerald-500/50 rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg shadow-emerald-500/20">
                        <span className="text-emerald-400 text-3xl font-bold -rotate-3">W</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-100 tracking-tight">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                            Sign up today
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-slate-900 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-800">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm font-medium border border-red-500/20 flex items-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Email address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="fintech-input pl-10 h-12"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="fintech-input pl-10 h-12"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="fintech-btn-primary w-full flex justify-center py-3 px-4 group !h-12"
                            >
                                {loading ? 'Signing in...' : (
                                    <div className="flex items-center">
                                        Sign in <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
