import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth.js';
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle.jsx';

const Register = () => {
    const {handleRegister}=useAuth();
    const navigate=useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        password: '',
        isSeller: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit =async (e) => {
        e.preventDefault();
        await handleRegister({
            email:formData.email,
            contact:formData.contactNumber,
            password:formData.password,
            fullname:formData.fullName,
            isSeller:formData.isSeller,
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
                            Redefining <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Commerce.</span>
                        </h1>
                        <p className="text-zinc-400 text-lg lg:text-xl max-w-md leading-relaxed">
                            Join the most exclusive platform for modern apparel. Experience retail without compromises.
                        </p>
                    </div>

                    <div className="mt-auto space-y-6 pt-12 border-t border-zinc-800">
                        <div className="flex items-center space-x-4 group">
                            <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <p className="text-sm text-zinc-300 tracking-wide font-medium">Secure & Encrypted Onboarding</p>
                        </div>
                        <div className="flex items-center space-x-4 group">
                            <div className="w-12 h-12 rounded-full border border-rose-500/30 flex items-center justify-center bg-rose-500/10 group-hover:bg-rose-500/20 group-hover:border-rose-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <p className="text-sm text-zinc-300 tracking-wide font-medium">Premium Seller Network</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane - Form */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col items-center justify-start lg:justify-center px-6 py-6 sm:px-12 lg:px-16 xl:px-24 bg-zinc-950 relative z-20">
                <div className="w-full max-w-[440px] relative z-10 bg-zinc-900/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl border border-zinc-800 my-auto">

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl md:text-3xl font-bold tracking-tight mb-2 text-zinc-50">Create Account</h2>
                        <p className="text-zinc-400 text-sm md:text-base tracking-wide">Become a member of the Snitch collective.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-widest transition-colors group-focus-within:text-amber-500">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all border border-zinc-800 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                required
                            />
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-widest transition-colors group-focus-within:text-amber-500">Contact Number</label>
                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all border border-zinc-800 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                required
                            />
                        </div>

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
                            <label className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-widest transition-colors group-focus-within:text-amber-500">Password</label>
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

                        <div className="flex items-center pt-3 pb-6">
                            <label className="relative flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="isSeller"
                                    checked={formData.isSeller}
                                    onChange={handleChange}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-zinc-950 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-[4px] md:rounded-[6px] transition-all flex items-center justify-center border border-zinc-700 peer-checked:bg-amber-500 peer-checked:border-amber-500 peer-checked:shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                                    <svg className={`w-3 h-3 md:w-3.5 md:h-3.5 text-zinc-950 transition-transform duration-300 ease-out ${formData.isSeller ? 'scale-100 rotate-0' : 'scale-0 -rotate-45'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="ml-3 text-sm text-zinc-400 peer-checked:text-zinc-100 tracking-wide transition-colors select-none">Enroll as a Seller</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-base md:text-lg rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-[0.98]"
                        >
                            Sign Up
                        </button>

                    </form>
                    
                    <ContinueWithGoogle/>
                    <p className="text-center text-sm text-zinc-500 mt-8 tracking-wide">
                        Already have an account? <a href="/login" className="text-amber-500 hover:text-amber-400 font-semibold underline decoration-amber-500/30 hover:decoration-amber-400 underline-offset-4 transition-colors">Sign in</a>
                    </p>    

                </div>
            </div>

        </div>
    );
};

export default Register;