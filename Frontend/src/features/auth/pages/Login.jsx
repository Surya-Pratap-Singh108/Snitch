import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth.js';
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle.jsx';

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
        <div className="h-[100dvh] w-full flex overflow-hidden bg-zinc-950 text-zinc-50 font-sans selection:bg-amber-500/30 selection:text-amber-200">

            {/* Left Pane - Branding (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-zinc-950 items-center justify-center border-r border-zinc-800/50 z-0">

                {/* Premium Abstract Accents (Background) */}
                <div className="absolute top-1/4 -left-32 w-[30rem] h-[30rem] bg-amber-600 opacity-10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-1/4 -right-32 w-[40rem] h-[40rem] bg-rose-700 opacity-[0.08] rounded-full blur-[140px] mix-blend-screen pointer-events-none"></div>

                <div className="relative z-10 p-16 max-w-2xl flex flex-col justify-center h-full">
                    <div className="mb-12">
                        <h2 className="text-xl tracking-[0.3em] text-amber-500 font-semibold uppercase mb-4 drop-shadow-md">Snitch</h2>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-8 text-zinc-50 drop-shadow-xl">
                            Welcome <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Back.</span>
                        </h1>
                        <p className="text-zinc-400 text-lg lg:text-xl max-w-md leading-relaxed">
                            Log in to access your dashboard, track orders, and experience retail without compromises.
                        </p>
                    </div>

                    <div className="mt-auto space-y-6 pt-12 border-t border-zinc-800">
                        <div className="flex items-center space-x-4 group">
                            <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <p className="text-sm text-zinc-300 tracking-wide font-medium">Secure & Encrypted Sessions</p>
                        </div>
                        <div className="flex items-center space-x-4 group">
                            <div className="w-12 h-12 rounded-full border border-rose-500/30 flex items-center justify-center bg-rose-500/10 group-hover:bg-rose-500/20 group-hover:border-rose-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <p className="text-sm text-zinc-300 tracking-wide font-medium">Fast, Frictionless Checkout</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane - Form */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col items-center justify-start lg:justify-center px-6 py-6 sm:px-12 lg:px-16 xl:px-24 bg-zinc-950 relative z-20">
                <div className="w-full max-w-[440px] relative z-10 bg-zinc-900/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl border border-zinc-800 my-auto">

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl md:text-3xl font-bold tracking-tight mb-2 text-zinc-50">Log In</h2>
                        <p className="text-zinc-400 text-sm md:text-base tracking-wide">Enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-widest transition-colors group-focus-within:text-amber-500">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all border border-zinc-800 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                required
                            />
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-widest transition-colors group-focus-within:text-amber-500 flex justify-between">
                                <span>Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all border border-zinc-800 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-base md:text-lg rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-[0.98] mt-2"
                        >
                            Sign In
                        </button>

                    </form>
                    <ContinueWithGoogle />
                    <p className="text-center text-sm text-zinc-500 mt-8 tracking-wide">
                        Don't have an account? <a href="/register" className="text-amber-500 hover:text-amber-400 font-semibold underline decoration-amber-500/30 hover:decoration-amber-400 underline-offset-4 transition-colors">Sign up</a>
                    </p>

                </div>
            </div>

        </div>
    );
};

export default Login;