import React, { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const ProductCard = ({ product }) => {
    const [imageIndex, setImageIndex] = useState(0);

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.images && product.images.length > 0) {
            setImageIndex((prev) => (prev + 1) % product.images.length);
        }
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.images && product.images.length > 0) {
            setImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        }
    };

    const hasMultipleImages = product.images && product.images.length > 1;

    return (
        <div className="group flex flex-col bg-[#131313] rounded-2xl overflow-hidden hover:bg-[#1a1a1a] transition-all duration-300 relative cursor-pointer">
            {/* Image Section */}
            <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                    <>
                        <img 
                            src={product.images[imageIndex].url} 
                            alt={product.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Navigation Arrows (Visible on Hover) */}
                        {hasMultipleImages && (
                            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                <button onClick={prevImage} className="w-8 h-8 rounded-full bg-zinc-950/60 text-zinc-300 flex items-center justify-center hover:bg-amber-500 hover:text-zinc-950 transition-colors backdrop-blur-sm cursor-pointer shadow-md">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                <button onClick={nextImage} className="w-8 h-8 rounded-full bg-zinc-950/60 text-zinc-300 flex items-center justify-center hover:bg-amber-500 hover:text-zinc-950 transition-colors backdrop-blur-sm cursor-pointer shadow-md">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        )}
                        {/* Dots Indicator */}
                        {hasMultipleImages && (
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                {product.images.map((_, idx) => (
                                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === imageIndex ? 'bg-amber-400 w-3' : 'bg-zinc-500/80 hover:bg-zinc-400 w-1.5'}`}></div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 relative z-0">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">No Image</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1.5 gap-2">
                    <h3 className="text-zinc-100 font-medium truncate group-hover:text-amber-500 transition-colors">
                        {product.title}
                    </h3>
                    <div className="text-amber-500 font-semibold whitespace-nowrap text-sm">
                        {product.price.currency} {product.price.amount}
                    </div>
                </div>
                
                <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {product.description}
                </p>
                

            </div>
        </div>
    );
};

const Home = () => {
    const { handleGetAllProducts } = useProduct();
    const products = useSelector((state) => state.product.allProducts) || [];
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    return (
        <div className="min-h-[100dvh] bg-[#0e0e0e] text-[#e7e5e5] font-sans selection:bg-amber-500/30 selection:text-amber-200 pb-12">
            {/* Navbar */}
            <header className="sticky top-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
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

            {/* Hero Section */}
            <div className="relative bg-[#131313] overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 relative z-10 flex flex-col items-center text-center">
                    <p className="text-amber-500 font-semibold uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-4">Latest Collection 2026</p>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-50 mb-6 max-w-3xl leading-tight">
                        Elevate your everyday <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">wardrobe</span>
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
                        Discover premium clothing curated for modern aesthetics and unparalleled comfort. Explore the new arrivals today.
                    </p>

                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">New Arrivals</h2>
                        <p className="text-zinc-500 text-sm mt-1">Explore our latest products from top sellers</p>
                    </div>
                </div>

                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center border border-zinc-800/50 rounded-3xl bg-zinc-900/20">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-5 text-zinc-600">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-zinc-300 mb-2">No items found</h3>
                        <p className="text-zinc-500 max-w-sm mb-6 text-sm">
                            We couldn't find any products in our catalog at the moment. Please check back later!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
