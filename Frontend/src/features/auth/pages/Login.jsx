import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth.js';
import { useNavigate } from 'react-router';

const Login = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({
            email: formData.email,
            password: formData.password,
        });
        navigate('/');
    };

    return (
        <div className="min-h-[100dvh] w-full flex bg-[#0D1117] text-[#E6EDF3] font-sans selection:bg-[#3B82F6] selection:text-white">

            {/* Left Pane - Branding (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0D1117] items-center justify-center border-r border-[#3B82F6]/10 z-0">

                {/* Abstract Tech Orbs (Background) */}
                <div className="absolute top-1/4 -left-32 w-[30rem] h-[30rem] bg-[#3B82F6] opacity-5 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-1/4 -right-32 w-[40rem] h-[40rem] bg-[#22C55E] opacity-5 rounded-full blur-[140px] mix-blend-screen pointer-events-none"></div>

                <div className="relative z-10 p-16 max-w-2xl flex flex-col justify-center h-full">
                    <div className="mb-12">
                        <h2 className="text-xl tracking-[0.3em] text-[#3B82F6] font-semibold uppercase mb-4">Snitch</h2>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-8 text-[#E6EDF3]">
                            Welcome <br />
                            <span className="text-[#3B82F6]">Back.</span>
                        </h1>
                        <p className="text-gray-400 text-lg lg:text-xl max-w-md leading-relaxed">
                            Log in to access your dashboard, track orders, and experience retail without compromises.
                        </p>
                    </div>

                    <div className="mt-auto space-y-6 pt-12 border-t border-white/5">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full border border-[#3B82F6]/30 flex items-center justify-center bg-[#3B82F6]/10">
                                <svg className="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <p className="text-sm text-gray-300 tracking-wide">Secure & Encrypted Sessions</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full border border-[#22C55E]/30 flex items-center justify-center bg-[#22C55E]/10">
                                <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <p className="text-sm text-gray-300 tracking-wide">Fast, Frictionless Checkout</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-24 bg-[#0D1117] relative z-20">
                <div className="w-full max-w-[440px] relative z-10 bg-[#161B22] p-8 md:p-10 rounded-2xl shadow-xl border border-white/5">

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl md:text-3xl font-bold tracking-tight mb-2 text-[#E6EDF3]">Log In</h2>
                        <p className="text-gray-400 text-sm md:text-base tracking-wide">Enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-[#3B82F6]">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full bg-[#0D1117] text-[#E6EDF3] placeholder-gray-600 rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all border border-white/10 focus:border-[#3B82F6]"
                                required
                            />
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-[#3B82F6] flex justify-between">
                                <span>Password</span>
                                <a href="#" className="text-[#3B82F6] hover:text-[#60A5FA] tracking-normal normal-case">Forgot password?</a>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-[#0D1117] text-[#E6EDF3] placeholder-gray-600 rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all border border-white/10 focus:border-[#3B82F6]"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-base md:text-lg rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/30 transition-all duration-300 shadow-lg active:scale-[0.98] mt-2"
                        >
                            Sign In
                        </button>

                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8 tracking-wide">
                        Don't have an account? <a href="/register" className="text-[#3B82F6] hover:text-[#60A5FA] underline decoration-[#3B82F6]/30 underline-offset-2 transition-colors">Sign up</a>
                    </p>

                </div>
            </div>

        </div>
    );
};

export default Login;