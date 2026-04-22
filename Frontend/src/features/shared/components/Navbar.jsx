import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Navbar=()=>{
    const navigate=useNavigate();
    const user=useSelector((state)=>state.auth.user);
    const cartItems = useSelector((state) => state.cart?.items || []);
    

    return(      <header className="sticky top-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-xl tracking-[0.3em] text-amber-500 font-bold uppercase cursor-pointer" onClick={() => navigate('/')}>
                        Snitch
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            {user.role === 'seller' && (
                                <button
                                    onClick={() => navigate('/seller/dashboard')}
                                    className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-amber-500 transition-colors hidden sm:block"
                                >
                                    Dashboard
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/cart')}
                                className="relative p-2 text-zinc-400 hover:text-amber-500 transition-colors flex items-center justify-center cursor-pointer"
                                aria-label="Cart"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                {cartItems.length > 0 && (
                                    <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-zinc-950 text-[10px] font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                                        {cartItems.length}
                                    </span>
                                )}
                            </button>
                            <div className="flex items-center justify-center text-sm font-medium tracking-wide text-[#e7e5e5]">
                                {user.fullname}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/login')} className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-100 transition-colors">
                                Sign In
                            </button>
                            <button onClick={() => navigate('/register')} className="text-xs font-bold uppercase tracking-widest bg-amber-500 text-zinc-950 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors">
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </header>
    )
}
export default Navbar;
