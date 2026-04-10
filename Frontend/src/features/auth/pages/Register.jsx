import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth.js';
import { useNavigate } from 'react-router';

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
                            Redefining <br />
                            <span className="text-[#3B82F6]">Commerce.</span>
                        </h1>
                        <p className="text-gray-400 text-lg lg:text-xl max-w-md leading-relaxed">
                            Join the most exclusive platform for modern apparel. Experience retail without compromises.
                        </p>
                    </div>

                    <div className="mt-auto space-y-6 pt-12 border-t border-white/5">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full border border-[#3B82F6]/30 flex items-center justify-center bg-[#3B82F6]/10">
                                <svg className="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <p className="text-sm text-gray-300 tracking-wide">Secure & Encrypted Onboarding</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full border border-[#22C55E]/30 flex items-center justify-center bg-[#22C55E]/10">
                                <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <p className="text-sm text-gray-300 tracking-wide">Premium Seller Network</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-24 bg-[#0D1117] relative z-20">
                <div className="w-full max-w-[440px] relative z-10 bg-[#161B22] p-8 md:p-10 rounded-2xl shadow-xl border border-white/5">

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl md:text-3xl font-bold tracking-tight mb-2 text-[#E6EDF3]">Create Account</h2>
                        <p className="text-gray-400 text-sm md:text-base tracking-wide">Become a member of the Snitch collective.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-[#3B82F6]">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full bg-[#0D1117] text-[#E6EDF3] placeholder-gray-600 rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all border border-white/10 focus:border-[#3B82F6]"
                                required
                            />
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-[#3B82F6]">Contact Number</label>
                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-[#0D1117] text-[#E6EDF3] placeholder-gray-600 rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all border border-white/10 focus:border-[#3B82F6]"
                                required
                            />
                        </div>

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
                            <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-[#3B82F6]">Password</label>
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

                        <div className="flex items-center pt-3 pb-6">
                            <label className="relative flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="isSeller"
                                    checked={formData.isSeller}
                                    onChange={handleChange}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-[#0D1117] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#3B82F6]/50 rounded-[4px] md:rounded-[6px] transition-all flex items-center justify-center border border-white/10 peer-checked:bg-[#22C55E] peer-checked:border-[#22C55E]">
                                    <svg className={`w-3 h-3 md:w-3.5 md:h-3.5 text-[#0D1117] transition-transform duration-300 ease-out ${formData.isSeller ? 'scale-100 rotate-0' : 'scale-0 -rotate-45'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="ml-3 text-sm text-gray-400 peer-checked:text-[#E6EDF3] tracking-wide transition-colors select-none">Enroll as a Seller</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-base md:text-lg rounded-xl px-4 py-4 md:py-3.5 focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/30 transition-all duration-300 shadow-lg active:scale-[0.98]"
                        >
                            Sign Up
                        </button>

                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8 tracking-wide">
                        Already have an account? <a href="/login" className="text-[#3B82F6] hover:text-[#60A5FA] underline decoration-[#3B82F6]/30 underline-offset-2 transition-colors">Sign in</a>
                    </p>    

                </div>
            </div>

        </div>
    );
};

export default Register;